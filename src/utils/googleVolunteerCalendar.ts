// Fetches the public "Volunteer Opportunities" Google Calendar .ics feed at
// build time, so adding a normal calendar event there automatically becomes
// a volunteer opportunity card on /volunteer — no /admin editing needed.
//
// IMPORTANT LIMITATION: Google Calendar "Appointment Schedules" (bookable
// slots) are NOT included in the public .ics feed — only regular events are.
// So each opportunity should be added as a normal event (title, date/time,
// location), with the actual signup link (an Appointment Schedule booking
// page, Google Form, etc.) pasted somewhere in the event's description. The
// first URL found in the description is used as the "Sign Up" button link.

import siteConfig from '../site.config';
import { fetchIcsOccurrences, formatTime, stripHtmlTags } from './ics';

export interface GoogleVolunteerOpportunity {
  id: string;
  source: 'google-volunteer';
  data: {
    title: string;
    description?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    location?: string;
    signupUrl?: string;
  };
}

const URL_PATTERN = /https?:\/\/[^\s<>"]+/i;
// Google Calendar often auto-wraps pasted links in a real <a href="..."> tag.
// Prefer the href value (the real destination) over the visible link text.
const HREF_PATTERN = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/i;

export async function getGoogleVolunteerOpportunities(limit = 20): Promise<GoogleVolunteerOpportunity[]> {
  const url = siteConfig.links.volunteerCalendarSubscribeUrl;
  if (!url) return [];

  const occurrences = await fetchIcsOccurrences(url);

  return occurrences.slice(0, limit).map((o) => {
    const rawDescription = o.description;
    const signupUrl = rawDescription?.match(HREF_PATTERN)?.[1] ?? rawDescription?.match(URL_PATTERN)?.[0];
    // Strip any HTML tags Google added, then remove every occurrence of the
    // signup link text (it can appear twice — once as the href, once as the
    // visible link text), leaving clean plain text for the card description.
    const description = rawDescription
      ? stripHtmlTags(signupUrl ? rawDescription.split(signupUrl).join('') : rawDescription)
      : undefined;
    return {
      id: o.uid.replace(/[^a-zA-Z0-9-]/g, '') || `gcal-vol-${o.start.getTime()}`,
      source: 'google-volunteer' as const,
      data: {
        title: o.summary,
        description: description || undefined,
        date: o.start,
        startTime: o.hasTime ? formatTime(o.start) : undefined,
        endTime: o.hasTime ? formatTime(o.end) : undefined,
        location: o.location,
        signupUrl,
      },
    };
  });
}
