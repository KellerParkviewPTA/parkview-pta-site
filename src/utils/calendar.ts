// Small helpers for "Add to calendar" links — no external packages needed.

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// Parses a friendly time string like "6:00 PM" into { hours, minutes } (24h).
function parseTime(time?: string): { hours: number; minutes: number } {
  if (!time) return { hours: 18, minutes: 0 };
  const match = time.trim().match(/(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?/);
  if (!match) return { hours: 18, minutes: 0 };
  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
}

export function eventDateRange(date: Date, startTime?: string, endTime?: string) {
  const start = new Date(date);
  const { hours: sh, minutes: sm } = parseTime(startTime);
  start.setHours(sh, sm, 0, 0);

  const end = new Date(start);
  if (endTime) {
    const { hours: eh, minutes: em } = parseTime(endTime);
    end.setHours(eh, em, 0, 0);
  } else {
    end.setHours(start.getHours() + 1);
  }
  return { start, end };
}

function toUTCStamp(d: Date) {
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    '00Z'
  );
}

export function googleCalendarUrl(opts: {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
}) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    details: opts.description ?? '',
    location: opts.location ?? '',
    dates: `${toUTCStamp(opts.start)}/${toUTCStamp(opts.end)}`,
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function buildIcs(opts: {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
}) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Parkview Elementary PTA//Site Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${opts.uid}@parkviewpta`,
    `DTSTAMP:${toUTCStamp(new Date())}`,
    `DTSTART:${toUTCStamp(opts.start)}`,
    `DTEND:${toUTCStamp(opts.end)}`,
    `SUMMARY:${(opts.title ?? '').replace(/\n/g, ' ')}`,
    opts.description ? `DESCRIPTION:${opts.description.replace(/\n/g, '\\n')}` : '',
    opts.location ? `LOCATION:${opts.location.replace(/\n/g, ' ')}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  return lines.join('\r\n');
}

export const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'PTA Meeting': { bg: 'bg-gold/15', text: 'text-gold-bright', dot: 'bg-gold' },
  Fundraiser: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  'School Event': { bg: 'bg-sky-500/15', text: 'text-sky-300', dot: 'bg-sky-400' },
  'Spirit Day': { bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-300', dot: 'bg-fuchsia-400' },
  'Volunteer Need': { bg: 'bg-orange-500/15', text: 'text-orange-300', dot: 'bg-orange-400' },
  'No School': { bg: 'bg-paper/15', text: 'text-paper', dot: 'bg-paper/70' },
};
