import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ---------------------------------------------------------------------------
// Every collection below maps 1:1 to a folder in src/content/ and to a
// collection in public/admin/config.yml (the Decap CMS admin panel).
// If you add a field here, add it to admin/config.yml too, and vice versa.
// ---------------------------------------------------------------------------

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      startTime: z.string().optional(), // e.g. "6:00 PM"
      endTime: z.string().optional(),
      location: z.string().optional(),
      category: z.enum([
        'PTA Meeting',
        'Fundraiser',
        'School Event',
        'Spirit Day',
        'Volunteer Need',
        'No School',
      ]),
      description: z.string().optional(),
      image: image().optional(),
      signupUrl: z.string().optional(),
      featured: z.boolean().default(false),
    }),
});

const announcements = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/announcements' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    pinned: z.boolean().default(false),
    urgent: z.boolean().default(false),
    excerpt: z.string().optional(),
  }),
});

const board = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/board' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      email: z.string().email().optional(),
      photo: image().optional(),
      order: z.number().default(99),
    }),
});

const volunteerOpportunities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/volunteer-opportunities' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    spotsNeeded: z.number().default(1),
    spotsFilled: z.number().default(0),
    contactName: z.string().optional(),
    contactEmail: z.string().email().optional(),
  }),
});

const fundraisers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fundraisers' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      status: z.enum(['active', 'past']).default('active'),
      goalAmount: z.number().optional(),
      raisedAmount: z.number().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      donateUrl: z.string().optional(),
      image: image().optional(),
      fundedDescription: z.string().optional(), // for past fundraisers: what the money paid for
    }),
});

const sponsors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sponsors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      logo: image().optional(),
      tier: z.enum(['Gold', 'Black & Gold', 'Community']).default('Community'),
      url: z.string().optional(),
      order: z.number().default(99),
    }),
});

const meetings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/meetings' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    time: z.string().optional(),
    location: z.string().optional(),
    agendaFile: z.string().optional(), // path under /public/documents/
    minutesFile: z.string().optional(),
  }),
});

const documents = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/documents' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['Reimbursement', 'Field Trip', 'Budget Request', 'Bylaws', 'Other']).default('Other'),
    file: z.string(), // path under /public/documents/
    description: z.string().optional(),
  }),
});

const spiritNights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/spirit-nights' }),
  schema: ({ image }) =>
    z.object({
      restaurantName: z.string(),
      date: z.coerce.date(),
      details: z.string().optional(),
      flyer: image().optional(),
    }),
});

const storeItems = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/store-items' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      price: z.string().optional(),
      image: image().optional(),
      url: z.string().optional(),
      featured: z.boolean().default(false),
    }),
});

const sponsorshipTiers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sponsorship-tiers' }),
  schema: z.object({
    name: z.string(),
    price: z.string(),
    cadence: z.string().optional(),
    perks: z.array(z.string()).default([]),
    highlighted: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

// Long-form editable page text (mission, about story, bylaws, legal pages, etc.)
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
  }),
});

// Site-wide urgent alert banner (single JSON file toggled on/off in /admin)
const alert = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/alert' }),
  schema: z.object({
    enabled: z.boolean().default(false),
    message: z.string().default(''),
    linkText: z.string().optional(),
    linkUrl: z.string().optional(),
  }),
});

export const collections = {
  events,
  announcements,
  board,
  'volunteer-opportunities': volunteerOpportunities,
  fundraisers,
  sponsors,
  meetings,
  documents,
  'spirit-nights': spiritNights,
  'store-items': storeItems,
  'sponsorship-tiers': sponsorshipTiers,
  pages,
  alert,
};
