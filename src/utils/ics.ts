// Shared iCalendar (.ics) fetch/parse helpers, used by both the main Google
// Calendar integration (src/utils/googleCalendar.ts) and the Volunteer
// Opportunities calendar integration (src/utils/googleVolunteerCalendar.ts).
// Hand-rolled — no external packages needed. Supports a practical subset of
// RRULE (DAILY/WEEKLY/MONTHLY/YEARLY with INTERVAL, COUNT, UNTIL, BYDAY —
// including "2nd Tuesday"-style monthly rules). EXDATE and more exotic
// recurrence rules are not handled.

export interface IcsOccurrence {
  start: Date;
  end: Date;
  hasTime: boolean;
  uid: string;
  summary: string;
  location?: string;
  description?: string;
}

function unfoldLines(ics: string): string[] {
  const rawLines = ics.split(/\r\n|\n|\r/);
  const lines: string[] = [];
  for (const line of rawLines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && lines.length > 0) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

function unescapeText(s: string): string {
  return s.replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}

function parseProp(line: string): { name: string; params: Record<string, string>; value: string } | null {
  const colonIdx = line.indexOf(':');
  if (colonIdx === -1) return null;
  const head = line.slice(0, colonIdx);
  const value = line.slice(colonIdx + 1);
  const [name, ...paramParts] = head.split(';');
  const params: Record<string, string> = {};
  for (const p of paramParts) {
    const [k, v] = p.split('=');
    if (k && v) params[k.toUpperCase()] = v;
  }
  return { name: name.toUpperCase(), params, value };
}

function parseDate(value: string, params: Record<string, string>): { date: Date; hasTime: boolean } {
  const isDateOnly = params.VALUE === 'DATE' || /^\d{8}$/.test(value);
  const y = +value.slice(0, 4);
  const mo = +value.slice(4, 6) - 1;
  const d = +value.slice(6, 8);
  if (isDateOnly) return { date: new Date(y, mo, d), hasTime: false };

  const h = +value.slice(9, 11);
  const mi = +value.slice(11, 13);
  const se = +(value.slice(13, 15) || '0');
  if (value.endsWith('Z')) return { date: new Date(Date.UTC(y, mo, d, h, mi, se)), hasTime: true };
  return { date: new Date(y, mo, d, h, mi, se), hasTime: true };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// Google Calendar sometimes auto-wraps pasted links in a real <a href="...">
// tag inside the DESCRIPTION field. Strip any HTML tags so plain-text
// consumers (event/opportunity cards) don't show raw markup.
export function stripHtmlTags(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface RRuleParts {
  freq?: string;
  interval: number;
  count?: number;
  until?: Date;
  byday: string[];
}

function parseRRule(value: string): RRuleParts {
  const parts: RRuleParts = { interval: 1, byday: [] };
  for (const seg of value.split(';')) {
    const [k, v] = seg.split('=');
    if (!k || !v) continue;
    switch (k.toUpperCase()) {
      case 'FREQ':
        parts.freq = v.toUpperCase();
        break;
      case 'INTERVAL':
        parts.interval = parseInt(v, 10) || 1;
        break;
      case 'COUNT':
        parts.count = parseInt(v, 10);
        break;
      case 'UNTIL':
        parts.until = parseDate(v, {}).date;
        break;
      case 'BYDAY':
        parts.byday = v.split(',');
        break;
    }
  }
  return parts;
}

const DAY_CODES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

function nthWeekdayOfMonth(year: number, month: number, dow: number, ordinal: number): Date {
  if (ordinal > 0) {
    const first = new Date(year, month, 1);
    const offset = (dow - first.getDay() + 7) % 7;
    return new Date(year, month, 1 + offset + (ordinal - 1) * 7);
  }
  const last = new Date(year, month + 1, 0);
  const offset = (last.getDay() - dow + 7) % 7;
  return new Date(year, month, last.getDate() - offset + (ordinal + 1) * 7);
}

function expandOccurrences(dtstart: Date, rrule: RRuleParts, windowEnd: Date, maxOccurrences: number): Date[] {
  if (!rrule.freq) return [dtstart];
  const [h, m, s] = [dtstart.getHours(), dtstart.getMinutes(), dtstart.getSeconds()];
  const results: Date[] = [];
  const withinLimits = (d: Date) => (!rrule.until || d <= rrule.until) && d <= windowEnd;

  if (rrule.freq === 'DAILY') {
    let cursor = new Date(dtstart);
    while (results.length < maxOccurrences && withinLimits(cursor)) {
      if (rrule.count !== undefined && results.length >= rrule.count) break;
      results.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + rrule.interval);
    }
  } else if (rrule.freq === 'WEEKLY') {
    const days = (rrule.byday.length > 0 ? rrule.byday.map((c) => DAY_CODES.indexOf(c)) : [dtstart.getDay()]).sort(
      (a, b) => a - b,
    );
    let weekStart = new Date(dtstart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    outer: while (results.length < maxOccurrences) {
      for (const dow of days) {
        const occ = new Date(weekStart);
        occ.setDate(occ.getDate() + dow);
        occ.setHours(h, m, s, 0);
        if (occ < dtstart) continue;
        if (!withinLimits(occ)) break outer;
        if (rrule.count !== undefined && results.length >= rrule.count) break outer;
        results.push(occ);
      }
      weekStart.setDate(weekStart.getDate() + rrule.interval * 7);
      if (weekStart > windowEnd) break;
    }
  } else if (rrule.freq === 'MONTHLY') {
    let monthCursor = 0;
    while (results.length < maxOccurrences) {
      const base = new Date(dtstart.getFullYear(), dtstart.getMonth() + monthCursor * rrule.interval, 1);
      let occ: Date;
      const ordinalMatch = rrule.byday[0]?.match(/(-?\d+)?(SU|MO|TU|WE|TH|FR|SA)/);
      if (ordinalMatch) {
        const ordinal = ordinalMatch[1] ? parseInt(ordinalMatch[1], 10) : 1;
        occ = nthWeekdayOfMonth(base.getFullYear(), base.getMonth(), DAY_CODES.indexOf(ordinalMatch[2]), ordinal);
      } else {
        occ = new Date(base.getFullYear(), base.getMonth(), dtstart.getDate());
      }
      occ.setHours(h, m, s, 0);
      monthCursor++;
      if (occ > windowEnd || monthCursor > 48) break;
      if (occ < dtstart) continue;
      if (rrule.count !== undefined && results.length >= rrule.count) break;
      if (!withinLimits(occ)) break;
      results.push(occ);
    }
  } else if (rrule.freq === 'YEARLY') {
    let yearCursor = 0;
    while (results.length < maxOccurrences) {
      const occ = new Date(dtstart.getFullYear() + yearCursor * rrule.interval, dtstart.getMonth(), dtstart.getDate(), h, m, s);
      yearCursor++;
      if (occ > windowEnd || yearCursor > 10) break;
      if (occ < dtstart) continue;
      if (rrule.count !== undefined && results.length >= rrule.count) break;
      if (!withinLimits(occ)) break;
      results.push(occ);
    }
  } else {
    return [dtstart];
  }

  return results;
}

/**
 * Fetches a public Google Calendar .ics feed at build time and expands it
 * into a flat, sorted list of upcoming occurrences (recurring events included).
 */
export async function fetchIcsOccurrences(url: string, windowDays = 365): Promise<IcsOccurrence[]> {
  let text: string;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    text = await res.text();
  } catch {
    return [];
  }

  const lines = unfoldLines(text);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const windowEnd = new Date(todayStart);
  windowEnd.setDate(windowEnd.getDate() + windowDays);

  const occurrences: IcsOccurrence[] = [];
  let current: Record<string, { params: Record<string, string>; value: string }> | null = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current && current['DTSTART']) {
        const dtstartProp = current['DTSTART'];
        const { date: dtstart, hasTime } = parseDate(dtstartProp.value, dtstartProp.params);
        const dtendProp = current['DTEND'];
        const dtend = dtendProp ? parseDate(dtendProp.value, dtendProp.params).date : null;
        const durationMs = dtend ? dtend.getTime() - dtstart.getTime() : 60 * 60 * 1000;
        const uid = current['UID']?.value ?? `gcal-${dtstart.getTime()}`;
        const summary = current['SUMMARY'] ? unescapeText(current['SUMMARY'].value) : 'Untitled Event';
        const location = current['LOCATION'] ? unescapeText(current['LOCATION'].value) : undefined;
        const description = current['DESCRIPTION'] ? unescapeText(current['DESCRIPTION'].value) : undefined;
        const rruleProp = current['RRULE'];

        const starts = rruleProp ? expandOccurrences(dtstart, parseRRule(rruleProp.value), windowEnd, 100) : [dtstart];

        starts.forEach((start, i) => {
          occurrences.push({
            start,
            end: new Date(start.getTime() + durationMs),
            hasTime,
            uid: starts.length > 1 ? `${uid}-${i}` : uid,
            summary,
            location,
            description,
          });
        });
      }
      current = null;
      continue;
    }
    if (!current) continue;
    const prop = parseProp(line);
    if (!prop) continue;
    current[prop.name] = { params: prop.params, value: prop.value };
  }

  return occurrences.filter((o) => o.start >= todayStart).sort((a, b) => a.start.getTime() - b.start.getTime());
}
