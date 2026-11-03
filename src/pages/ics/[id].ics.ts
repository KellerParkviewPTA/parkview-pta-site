import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { eventDateRange, buildIcs } from '../../utils/calendar';

export const prerender = true;

export async function getStaticPaths() {
  const events = await getCollection('events');
  return events.map((event) => ({ params: { id: event.id }, props: { event } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { event } = props as any;
  const { start, end } = eventDateRange(event.data.date, event.data.startTime, event.data.endTime);
  const ics = buildIcs({
    uid: event.id,
    title: event.data.title,
    description: event.data.description,
    location: event.data.location,
    start,
    end,
  });

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.id}.ics"`,
    },
  });
};
