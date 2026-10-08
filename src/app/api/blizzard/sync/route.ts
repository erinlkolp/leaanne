import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const clientId = body.clientId || process.env.BLIZZARD_CLIENT_ID;
    const clientSecret = body.clientSecret || process.env.BLIZZARD_CLIENT_SECRET;
    const region = body.region || process.env.BLIZZARD_REGION || 'us';
    const characterName = body.characterName?.toLowerCase()?.trim();
    const realm = body.realm?.toLowerCase()?.trim()?.replace(/'/g, '').replace(/\s+/g, '-');

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing Blizzard API Credentials. Please set BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET in .env.local or enter them in the settings modal.',
        },
        { status: 400 }
      );
    }

    // 1. Obtain OAuth Token
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenUrl =
      region === 'cn'
        ? 'https://oauth.battlenet.com.cn/token'
        : 'https://oauth.battle.net/token';

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store',
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return NextResponse.json(
        {
          success: false,
          error: `Failed to authenticate with Battle.net API: ${errText}`,
        },
        { status: 401 }
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // If no character was requested, return success (auth check verified)
    if (!characterName || !realm) {
      return NextResponse.json({
        success: true,
        message: 'Successfully connected and verified Battle.net API credentials!',
        region,
      });
    }

    // 2. Fetch Character Summary
    const charUrl = `https://${region}.api.blizzard.com/profile/wow/character/${encodeURIComponent(
      realm
    )}/${encodeURIComponent(characterName)}?namespace=profile-${region}&locale=en_US`;

    const charRes = await fetch(charUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!charRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Character '${characterName}' on realm '${realm}' could not be found or has not logged in recently.`,
        },
        { status: 404 }
      );
    }

    const charData = await charRes.json();

    return NextResponse.json({
      success: true,
      character: {
        name: charData.name,
        level: charData.level,
        itemLevel: charData.equipped_item_level,
        averageItemLevel: charData.average_item_level,
        class: charData.character_class?.name,
        spec: charData.active_spec?.name,
        race: charData.race?.name,
        faction: charData.faction?.name,
        realm: charData.realm?.name,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred while communicating with Blizzard API.',
      },
      { status: 500 }
    );
  }
}
