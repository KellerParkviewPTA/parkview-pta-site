/**
 * ============================================================
 *  PARKVIEW PTA — SITE CONFIG
 * ============================================================
 * This is the ONE file to edit for school-wide settings:
 * name, colors, contact info, and important external links.
 *
 * You do NOT need to know code to edit this file — just change
 * the text between the quotes "" and save. Don't remove the
 * commas or quotes.
 *
 * Anything marked TODO is placeholder info you should replace
 * with your PTA's real details.
 * ============================================================
 */

const siteConfig = {
  // ---- Basic identity ----
  schoolName: 'Parkview Elementary',
  ptaName: 'Parkview Elementary PTA',
  district: 'Keller ISD',
  city: 'Fort Worth, TX',
  tagline: '"Everyday. Every Student. Every Opportunity." (Dr. Stevens, Principal)',
  mascot: 'Panthers',

  // ---- Branding ----
  colors: {
    black: '#0B0B0C',
    gold: '#D4AF37',
    goldBright: '#FFC72C',
    offWhite: '#F7F5EF',
  },
  // Path to logo — swap this file to update the logo site-wide.
  logoPath: '/images/parkview-logo.jpeg',
  logoAltText: 'Parkview Panthers logo',

  // ---- Contact info ----
  address: {
    line1: '6900 Bayberry Dr',
    city: 'Fort Worth',
    state: 'TX',
    zip: '76137',
  },
  email: 'kellerparkviewpta@gmail.com',
  phone: '(817) 744-5000',

  // ---- Forms (no backend needed — Netlify Forms) ----
  // All forms submit to Netlify and notify this address.
  // Change this one value and every form on the site updates.
  formRecipientEmail: 'kellerparkviewpta@gmail.com',

  // ---- External links (fill these in when you have them) ----
  links: {
    joinPtaUrl: 'https://txpta.my.salesforce-sites.com/JoinPTA',
    sponsorshipDonationUrl: 'https://www.zeffy.com/en-US/ticketing/parkview-elementary-pta-sponsorships',
    storeUrl: 'https://TODO-add-your-spirit-shop-link.example.com', // TODO
    googleCalendarEmbedUrl: 'https://calendar.google.com/calendar/embed?src=kellerparkviewpta%40gmail.com&ctz=America%2FChicago',
    googleCalendarSubscribeUrl: 'https://calendar.google.com/calendar/ical/kellerparkviewpta%40gmail.com/public/basic.ics',
    // ---- Volunteer Opportunities calendar (separate from the main calendar above) ----
    // Create a second calendar in Google Calendar called "Volunteer Opportunities,"
    // make it public the same way (Settings > that calendar > Access permissions
    // for events > "Make available to public" > "See all event details").
    // Then grab its Calendar ID from Settings > that calendar > "Integrate calendar"
    // (looks like xxxxxxxx@group.calendar.google.com) and paste it below — this
    // overlays those events on the /calendar page's embed in addition to pulling
    // them into real cards on /volunteer. Leave blank to skip this feature.
    volunteerCalendarEmbedSrc: 'bdd7d9da1eb3131d0bb9f1557002e951a9dbac24b43a178e17f05e4ffb204cdd@group.calendar.google.com',
    volunteerCalendarSubscribeUrl:
      'https://calendar.google.com/calendar/ical/bdd7d9da1eb3131d0bb9f1557002e951a9dbac24b43a178e17f05e4ffb204cdd%40group.calendar.google.com/public/basic.ics',
    kellerISDCalendarUrl: 'https://www.kellerisd.net/about-kisd/calendar',
    kellerISDCalendarPdfUrl: 'https://www.kellerisd.net/fs/resource-manager/view/b5da7ec3-fe21-4cbd-9eef-31ac108be703', // 2026-2027 printable instructional calendar
    kellerISDHomepage: 'https://www.kellerisd.net/',
    schoolWebsite: 'https://pes.kellerisd.net/',
    lunchMenuUrl: 'https://www.kellerisd.net/departments/foodservices',
    transportationUrl: 'https://www.kellerisd.net/departments/transportation',
    parentPortalUrl: 'https://www.kellerisd.net/aeries',
    googleMapsEmbedSrc:
      'https://www.google.com/maps?q=6900+Bayberry+Dr+Fort+Worth+TX+76137&output=embed',
  },

  // ---- Social ----
  social: {
    facebook: 'https://www.facebook.com/parkview.pta.kellerisd',
    instagram: 'https://www.instagram.com/parkviewelementary_kisd/',
  },

  // ---- Analytics (off by default) ----
  analytics: {
    provider: 'none', // 'none' | 'plausible' | 'google'
    plausibleDomain: '', // TODO if using Plausible
    googleAnalyticsId: '', // TODO if using GA4, e.g. G-XXXXXXX
  },

  // ---- Feature toggles ----
  features: {
    builtInStoreGrid: false, // flip to true to show the simple built-in product grid on the Store page
    darkLightToggle: true,
  },
} as const;

export default siteConfig;
