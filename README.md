# The Trader Koushik Website

A single-page personal branding and education website for a forex trader, built as a static frontend with a premium dark trading-terminal aesthetic. The project combines brand positioning, market-data presentation, strategy messaging, educational content, and lead capture into a highly visual landing experience.

## Overview

This project is designed as a digital portfolio and conversion-focused website for a trading educator. Its goals are to:

- present the trader's identity and brand positioning
- communicate the trading philosophy and execution framework
- surface live market data in a terminal-inspired interface
- explain risk-first methodology and process-based decision making
- direct interested users to contact or learning channels
- support a gallery page for personal and brand imagery

The site is built for static deployment and does not depend on a JavaScript framework, bundler, or backend runtime.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas rendering for dashboard-style charts
- Google Fonts
- Twelve Data API for quote and time-series requests
- Formspree for form submission handling

## Project Structure

```text
.
├── index.html
├── gallery.html
├── style.css
├── script.js
├── logo.png
├── koushik.png
├── dashboard.png
├── Display pic.jpeg
├── pics/
├── README.md
└── node_modules/
```

## Key Frontend Responsibilities

### 1. Landing Page Layout
The main page is implemented as a one-page marketing site with sections for:

- navigation
- hero introduction
- strategy positioning
- trading philosophy
- framework breakdown
- performance visuals
- educational content
- testimonials
- CTA section
- contact form
- footer

### 2. Trading Terminal UI
The hero section uses a terminal-style card inspired by trading dashboards. It includes:

- instrument selector
- market price display
- directional change indicator
- faux/live data status UI
- symbol rows for multiple markets
- a chart canvas area and interaction controls

### 3. Market Data Integration
The JavaScript layer integrates with the Twelve Data API to retrieve:

- live quote data for supported symbols
- time-series data for chart rendering
- cached fallback data from localStorage

Supported symbols include:

- EUR/USD
- GBP/USD
- USD/JPY
- USD/CHF
- AUD/USD
- USD/CAD
- XAU/USD

### 4. Interactive JavaScript Modules
`script.js` handles the following behaviors:

- mobile navigation toggling
- scroll reveal animations
- animated counters
- live chart rendering
- quote refresh logic
- market ticker generation
- trading calculator logic
- performance chart drawing
- modal-based educational article display
- contact form submission behavior

### 5. Responsive Design System
The stylesheet implements a custom design language using CSS variables and reusable patterns for:

- dark theme surfaces and borders
- emerald/gold accent system
- card-based layout modules
- responsive breakpoints
- terminal styling
- hover and motion states

## Local Development

Because this is a static website, it can be served directly with a local web server.

### Option 1: open directly
Open `index.html` in a browser.

### Option 2: serve locally
```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Using a local server is recommended because some browser behaviors and API requests are restricted under `file://` access.

## Environment and Configuration Notes

### API Key Handling
The project currently contains a browser-exposed Twelve Data API key in the frontend script. This is not suitable for production usage because client-side keys are visible to users.

For production deployment, the recommended pattern is:

1. move quote requests behind a backend or serverless endpoint
2. store the API key in a secure environment variable
3. validate response data before returning to the frontend
4. add rate limiting and error handling

### Form Submission
The contact form uses Formspree as the configured delivery endpoint. Before deploying to production, verify:

- the correct Formspree account is linked
- the form is receiving submissions successfully
- email notifications are configured properly
- spam protection is active if required

### Content Ownership
Marketing and performance information presented on the site should be reviewed before public launch to ensure:

- claims are accurate
- disclosure language is present
- educational copy does not imply guaranteed financial returns
- any statistics or credentials are verified and current

## Accessibility and Browser Considerations

The project includes accessibility-oriented patterns such as:

- semantic sectioning
- labeled controls
- descriptive ARIA attributes on chart elements
- mobile menu state management
- modal close interactions

Additional validation is recommended for:

- keyboard navigation
- screen-reader behavior
- mobile responsiveness
- high-contrast readability
- reduced-motion support

## Deployment Notes

This website is suitable for static hosting platforms such as:

- GitHub Pages
- Netlify
- Vercel static hosting
- any standard web host serving static files

For production deployment, make sure to:

- review all public trade claims
- secure the market-data backend flow
- confirm contact form routing
- update branding assets and legal disclosures as needed

## License and Usage

This repository is intended for personal website use and branding for the trader represented by the project. Any public deployment should be reviewed to ensure the content aligns with legal, compliance, and marketing requirements.

## Summary

This project is a polished, static, marketing-heavy frontend that blends branding, financial-market visuals, educational positioning, and conversion-oriented sections. It is lightweight, easy to maintain, and well-suited for deployment as a static personal website while remaining flexible enough for future upgrades such as CMS integration, backend data handling, or a more advanced trading dashboard.

Replace the coming-soon content with course cards, curriculum details, pricing, registration, or a waitlist workflow when the courses are ready.

### Replace images

Place optimized images in `pics/` and update the image paths in `gallery.html`. Use descriptive alt text for meaningful images and empty alt text for purely decorative images.

## Important Limitations

- The market display depends on Twelve Data availability, browser network access, API limits, and correct symbol support.
- API errors and rate limits can prevent live values from loading.
- Fallback chart data is simulated and must never be presented as real market history.
- Performance figures, testimonials, and some statistics are illustrative or placeholder content.
- The contact form depends on an external Formspree service.
- There is no backend, authentication, database, CMS, or admin dashboard in this small website.
- The website does not execute trades or connect to a brokerage account.

## Deployment

The site can be deployed to any static hosting provider, including GitHub Pages, Netlify, Vercel static hosting, Cloudflare Pages, or traditional web hosting.

Before deployment:

- Test all navigation links.
- Confirm image paths and case-sensitive filenames.
- Test the site over HTTPS.
- Move market API requests to a secure backend or serverless function.
- Confirm the contact form endpoint.
- Replace illustrative claims with verified content or label them clearly.
- Test desktop, tablet, and mobile layouts.
- Check the browser console for API, image, font, or form errors.

## Disclaimer

The website presents educational material and a personal trading profile. Nothing on the site should be interpreted as investment, financial, legal, or tax advice. Visitors should conduct their own research and consult an appropriately qualified professional before making financial decisions.

## Author

**Koushik**  
Full-Time Forex Trader  
NISM Certified, Reg. No. `202500055982`
