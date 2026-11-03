# Launch Checklist — Things You Still Need to Provide

Everything below is placeholder content marked `TODO` in the code so the site builds and looks complete right away. Replace these before you consider the site "live." Most can be edited directly through the `/admin` panel (see README.md section 5); a few live in `src/site.config.ts` and require GitHub's web editor or a developer's help (also explained in README.md section 5).

## 1. Site-wide settings (`src/site.config.ts`)
- [x] Official school name and mascot confirmed (Parkview Panthers)
- [x] Real PTA tagline added (mission statement, doubling as the homepage tagline)
- [x] Logo replaced with your real logo (`public/images/parkview-logo.jpeg`)
- [x] Real street address added and corrected to match the school's own website: 6900 Bayberry Dr, **Fort Worth, TX 76137** (not Keller as originally guessed)
- [x] Real contact email and phone number added
- [x] Form submissions set to go to `kellerparkviewpta@gmail.com`
- [ ] Spirit Shop / store link
- [x] Google Calendar embed URL and "Subscribe" (ICS) URL added — the `/calendar` page now shows the live Google Calendar front and center (the old custom month/list calendar widget was removed in favor of it)
- [x] Keller ISD district calendar page + printable instructional-calendar PDF linked
- [x] School website, lunch menu, transportation info, and parent portal links — all pulled from pes.kellerisd.net
- [x] Google Maps embed set to the real school address — **please double-check it actually renders once deployed live**; I couldn't visually confirm it in this sandboxed preview tool (the map iframe is blocked here even for Google's own default example), but it uses the standard no-API-key Google Maps embed technique
- [x] Facebook and Instagram links (PTA Facebook page + Instagram added)
- [ ] Analytics: turn on Plausible or Google Analytics if desired (off by default)
- [x] Volunteer Opportunities calendar connected (`volunteerCalendarEmbedSrc` / `volunteerCalendarSubscribeUrl` in `site.config.ts`) — any regular event added to the "Volunteer Opportunities" Google Calendar, with a signup link pasted in the event's description, automatically becomes a real card on `/volunteer` and overlays onto the `/calendar` embed. Note: Google's "Appointment Schedule" booking-page feature itself does NOT sync this way (Google limitation) — pair it with a normal event + pasted link as described in README.md.

## 2. Board Members (`/admin` → Board Members)
- [x] All 9 real board members and roles added: Kim Vu (President), Kayla Darling (VP of Membership), Megan Duncan (Treasurer), Vanessa Malm (Secretary), Shali Wilson (Parliamentarian), Lisa Rangel (Hospitality), Becky Hoang (Programs), Tiffany Korell (Arts and Education), Steven Nguyen (Dads Club)
- [ ] Add a photo for each board member (`photo` field is optional and currently blank for all 9)
- [ ] Add individual email addresses for board members if desired (currently only the President has one, using the shared general PTA inbox — the other 8 have no email field set rather than a fake placeholder address)

## 3. News & Announcements (`/admin` → News & Announcements)
- [ ] Replace sample membership-count numbers with real figures
- [ ] Replace the welcome-back message with your own
- [ ] The "Reflections theme announced" sample post is still in News & Announcements even though the dedicated PTA Reflections page was removed — update or delete this post in `/admin` → News & Announcements if you're not running Reflections this year

## 4. Events & Volunteer Opportunities (`/admin`)
- [ ] Confirm "Winter Break" and "No School / Teacher Workday" dates against the official Keller ISD calendar
- [ ] Add real volunteer coordinator names/contacts (5 sample slots reference a placeholder name)
- [ ] Add ticket pricing and sign-up details to the Fall Festival event

## 5. Fundraisers (`/admin` → Fundraisers)
- [ ] Add a real donation link for the Playground Upgrade and Fall Festival funds
- [ ] Add more project details/photo for the playground upgrade

## 6. Sponsors (`/admin` → Sponsors)
- [ ] Replace all 5 placeholder sponsor names, logos, and website links with real sponsors (or delete the samples if you don't have sponsors yet)

## 7. Spirit Shop Items (`/admin` → Spirit Shop Items)
- [ ] Point each item's "Purchase Link" to your real store, or replace with your actual product list

## 8. Legal / long-form pages (`/admin` → Page Text)
- [ ] Mission statement — replace with your PTA's real mission
- [ ] About/history story — replace with your PTA's real history
- [ ] Bylaws — upload your official bylaws PDF via Forms & Documents and link it, or paste the full text
- [ ] Privacy Policy — have your board (and legal counsel, if possible) review before publishing
- [ ] Accessibility Statement — review and customize
- [ ] Volunteer info page — add the current Keller ISD background-check policy/instructions, and explain how (or whether) volunteer hours are tracked

## 9. Site-wide alert banner (`/admin` → Site-Wide Alert Banner)
- [ ] Leave "Show Banner" off until you have a real urgent message to display

## 13a. Join the PTA (`/join`)
- [x] "Join the PTA Now" button added, linking straight to the official Texas PTA membership portal (`https://txpta.my.salesforce-sites.com/JoinPTA`)
- [x] Removed the local membership tiers/form — membership signup and payment now happen entirely on the Texas PTA site, not on this site

## 13b. Sponsorship (`/admin` → Sponsorship Tiers, page at `/sponsorship`)
- [x] Moved the 5 dollar tiers from your flyer onto their own Sponsorship page: Panther Friend ($50), Bronze Sponsor ($150), Silver Sponsor ($250), Gold Sponsor ($500), Platinum Sponsor ($1000)
- [x] Removed the $11 Regular Member tier (that's now just "Join the PTA," see above)
- [x] Sponsorship payment link added: `links.sponsorshipDonationUrl` now points to your Zeffy page (`https://www.zeffy.com/en-US/ticketing/parkview-elementary-pta-sponsorships`)
- [x] The 5 tiers on `/sponsorship` were renamed/re-priced to match the Zeffy page exactly: Panther Friend ($50), Panther Bestie ($100), Panther Sweetheart ($250), Loyal Panther ($500), Panther Platinum ($1,000) — perk wording also copied from Zeffy so the site and checkout page agree

## 13. Other
- [ ] `astro.config.mjs` — update `site:` to your real domain once deployed
- [ ] Set up Netlify email notifications for form submissions (README.md section 6)
- [ ] Set up Netlify Identity + Git Gateway so board members can log into `/admin` (README.md section 4)
