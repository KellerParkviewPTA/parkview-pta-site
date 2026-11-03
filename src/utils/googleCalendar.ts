// Fetches the public Google Calendar .ics feed at build time so homepage
// event cards stay in sync with whatever's on the PTA's Google Calendar.
// Parsing logic lives in ./ics.ts (shared with googleVolunteerCalendar.ts).

import siteConfig from '../site.config';
import { fetchIcsOccurrences, formatTime, stripHtmlTags } from './ics';

export interface GoogleCalendarEvent {
  id: string;
  source: 'google';
  data: {
    title: string;
    date: Date;
    startTime?: string;
    endTime?: string;
    location?: string;
    category: string;
    description?: string;
  };
}

export async function getUpcomingGoogleCalendarEvents(limit = 5): Promise<GoogleCalendarEvent[]> {
  const url = siteConfig.links.googleCalendarSubscribeUrl;
  if (!url) return [];

  const occurrences = await fetchIcsOccurrences(url);

  return occurrences.slice(0, limit).map((o) => ({
    id: o.uid.replace(/[^a-zA-Z0-9-]/g, '') || `gcal-${o.start.getTime()}`,
    source: 'google' as const,
    data: {
      title: o.summary,
      date: o.start,
      startTime: o.hasTime ? formatTime(o.start) : undefined,
      endTime: o.hasTime ? formatTime(o.end) : undefined,
      location: o.location,
      category: 'School Event',
      description: o.description ? stripHtmlTags(o.description) : undefined,
    },
  }));
}
