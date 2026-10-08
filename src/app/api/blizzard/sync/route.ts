import { NextRequest, NextResponse } from 'next/server';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// In-memory token cache to prevent spamming Blizzard OAuth endpoint
let cachedToken: { token: string; expiresAt: number; region: string } | null = null;

async function getAccessToken(clientId: string, clientSecret: string, region: string): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.region === region && cachedToken.expiresAt > now + 60000) {
    return cachedToken.token;
  }

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenUrl =
    region === 'cn'
      ? 'https://oauth.battlenet.com.cn/token'
      : 'https://oauth.battle.net/token';

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authString}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Battle.net authentication failed: ${errorText}`);
  }

  const data = (await res.json()) as TokenResponse;
  cachedToken = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
    region,
  };

  return data.access_token;
}

function normalizeRealmSlug(realm: string): string {
  return realm
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]/g, '-');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const clientId = body.clientId || process.env.BLIZZARD_CLIENT_ID;
    const clientSecret = body.clientSecret || process.env.BLIZZARD_CLIENT_SECRET;
    const region = body.region || process.env.BLIZZARD_REGION || 'us';
    const action = body.action || 'character'; // 'verify' | 'character' | 'mounts'

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing Battle.net API credentials. Enter your Client ID and Client Secret in the Battle.net settings modal or configure them in .env.local.',
        },
        { status: 400 }
      );
    }

    const token = await getAccessToken(clientId, clientSecret, region);

    // 1. Verify credentials only
    if (action === 'verify' || (!body.characterName && !body.realm)) {
      return NextResponse.json({
        success: true,
        message: 'Connected! Battle.net OAuth client credentials verified successfully.',
        region,
      });
    }

    const characterName = body.characterName?.toLowerCase()?.trim();
    const realm = normalizeRealmSlug(body.realm || '');

    if (!characterName || !realm) {
      return NextResponse.json(
        { success: false, error: 'Character name and realm are required.' },
        { status: 400 }
      );
    }

    const baseUrl = `https://${region}.api.blizzard.com`;
    const namespace = `profile-${region}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Battlenet-Namespace': namespace,
    };

    // 2. Fetch Mounts Collection for this character/account
    if (action === 'mounts') {
      const mountsUrl = `${baseUrl}/profile/wow/character/${encodeURIComponent(realm)}/${encodeURIComponent(
        characterName
      )}/collections/mounts?locale=en_US`;

      const mountsRes = await fetch(mountsUrl, { headers, cache: 'no-store' });
      if (!mountsRes.ok) {
        const err = await mountsRes.text();
        return NextResponse.json(
          { success: false, error: `Could not fetch mounts: ${err}` },
          { status: mountsRes.status }
        );
      }

      const mountsData = await mountsRes.json();
      const ownedMountList = (mountsData.mounts || []).map((m: any) => ({
        id: m.mount?.id,
        name: m.mount?.name,
      }));

      return NextResponse.json({
        success: true,
        totalMounts: ownedMountList.length,
        ownedMounts: ownedMountList,
      });
    }

    // 3. Fetch Full Character Summary + Media + Raids
    const profileUrl = `${baseUrl}/profile/wow/character/${encodeURIComponent(realm)}/${encodeURIComponent(
      characterName
    )}?locale=en_US`;

    const profileRes = await fetch(profileUrl, { headers, cache: 'no-store' });
    if (!profileRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Character '${characterName}' on realm '${realm}' could not be found. Check spelling or ensure the character has logged in recently.`,
        },
        { status: profileRes.status }
      );
    }

    const profileData = await profileRes.json();

    // Fetch avatar media (non-blocking)
    let avatarUrl: string | undefined;
    let renderUrl: string | undefined;
    try {
      const mediaUrl = `${baseUrl}/profile/wow/character/${encodeURIComponent(realm)}/${encodeURIComponent(
        characterName
      )}/character-media?locale=en_US`;
      const mediaRes = await fetch(mediaUrl, { headers, cache: 'no-store' });
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        const assets = mediaData.assets || [];
        avatarUrl = assets.find((a: any) => a.key === 'avatar')?.value;
        renderUrl = assets.find((a: any) => a.key === 'main' || a.key === 'main-raw')?.value;
      }
    } catch {
      // media lookup is optional
    }

    // Fetch raid lockouts / encounters (non-blocking)
    const raidProgress: Record<string, { [difficulty: string]: number }> = {};
    try {
      const raidsUrl = `${baseUrl}/profile/wow/character/${encodeURIComponent(realm)}/${encodeURIComponent(
        characterName
      )}/encounters/raids?locale=en_US`;
      const raidsRes = await fetch(raidsUrl, { headers, cache: 'no-store' });
      if (raidsRes.ok) {
        const raidsData = await raidsRes.json();
        // Parse current and recent raid encounters if available
        (raidsData.expansions || []).forEach((exp: any) => {
          (exp.instances || []).forEach((inst: any) => {
            const raidName = inst.instance?.name?.toLowerCase() || '';
            const matchingKey = raidName.includes('nerub')
              ? 'raid-nerubar'
              : raidName.includes('icecrown')
              ? 'raid-icc'
              : raidName.includes('tempest')
              ? 'raid-tempest-keep'
              : raidName.includes('ulduar')
              ? 'raid-ulduar'
              : raidName.includes('antorus')
              ? 'raid-antorus'
              : raidName.includes('karazhan')
              ? 'raid-karazhan'
              : null;

            if (matchingKey) {
              raidProgress[matchingKey] = {};
              (inst.modes || []).forEach((mode: any) => {
                const diffName = mode.difficulty?.name || 'Normal';
                const bossesDefeated = mode.progress?.completed_count || 0;
                raidProgress[matchingKey][diffName] = bossesDefeated;
              });
            }
          });
        });
      }
    } catch {
      // raid lookup is optional
    }

    return NextResponse.json({
      success: true,
      character: {
        name: profileData.name,
        realm: profileData.realm?.name,
        region,
        level: profileData.level,
        itemLevel: profileData.equipped_item_level,
        averageItemLevel: profileData.average_item_level,
        class: profileData.character_class?.name,
        spec: profileData.active_spec?.name || 'Unknown',
        race: profileData.race?.name,
        faction: profileData.faction?.name,
        avatarUrl,
        renderUrl,
      },
      raidProgress,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred while communicating with Battle.net.',
      },
      { status: 500 }
    );
  }
}
