export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

export function getNextWeeklyReset(region: 'us' | 'eu' = 'us'): Date {
  const now = new Date();
  const reset = new Date(now);

  if (region === 'us') {
    // US reset is Tuesday 15:00 UTC
    const targetDay = 2; // Tuesday
    const targetHourUTC = 15;

    reset.setUTCHours(targetHourUTC, 0, 0, 0);

    const currentDay = now.getUTCDay();
    let daysUntil = (targetDay - currentDay + 7) % 7;

    // If it's Tuesday but past 15:00 UTC, next reset is next Tuesday
    if (daysUntil === 0 && now.getUTCHours() >= targetHourUTC) {
      daysUntil = 7;
    }

    reset.setUTCDate(now.getUTCDate() + daysUntil);
  } else {
    // EU reset is Wednesday 05:00 UTC
    const targetDay = 3; // Wednesday
    const targetHourUTC = 5;

    reset.setUTCHours(targetHourUTC, 0, 0, 0);

    const currentDay = now.getUTCDay();
    let daysUntil = (targetDay - currentDay + 7) % 7;

    if (daysUntil === 0 && now.getUTCHours() >= targetHourUTC) {
      daysUntil = 7;
    }

    reset.setUTCDate(now.getUTCDate() + daysUntil);
  }

  return reset;
}

export function calculateTimeRemaining(targetDate: Date): TimeRemaining {
  const total = targetDate.getTime() - new Date().getTime();

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, formatted: 'Resetting now!' };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  parts.push(`${hours}h`);
  parts.push(`${minutes}m`);

  return {
    days,
    hours,
    minutes,
    seconds,
    formatted: parts.join(' '),
  };
}
