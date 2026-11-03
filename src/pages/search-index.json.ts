import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [events, announcements, board, volunteerOpportunities, documents, pages] = await Promise.all([
    getCollection('events'),
    getCollection('announcements'),
    getCollection('board'),
    getCollection('volunteer-opportunities'),
    getCollection('documents'),
    getCollection('pages'),
  ]);

  const items = [
    ...events.map((e) => ({ title: e.data.title, section: 'Calendar', url: '/calendar' })),
    ...announcements.map((a) => ({ title: a.data.title, section: 'News', url: `/news/${a.id}` })),
    ...board.map((b) => ({ title: `${b.data.name} (${b.data.role})`, section: 'Board', url: '/about' })),
    ...volunteerOpportunities.map((v) => ({ title: v.data.title, section: 'Volunteer', url: '/volunteer' })),
    ...documents.map((d) => ({ title: d.data.title, section: 'Forms & Documents', url: '/forms-documents' })),
    ...pages
      .filter((p) => ['privacy-policy', 'accessibility'].includes(p.id))
      .map((p) => ({ title: p.data.title, section: 'Page', url: `/${p.id}` })),
    { title: 'Join the PTA', section: 'Page', url: '/join' },
    { title: 'Spirit Shop', section: 'Page', url: '/store' },
    { title: 'Fundraising', section: 'Page', url: '/fundraising' },
    { title: 'Spirit Wear & Spirit Nights', section: 'Page', url: '/spirit-wear' },
    { title: 'Parent Resources', section: 'Page', url: '/resources' },
    { title: 'Contact Us', section: 'Page', url: '/contact' },
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' },
  });
};
