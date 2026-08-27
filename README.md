# The Forex Trader Koushik

A personal forex trading profile and educational website for Koushik. The site presents Koushik's trading philosophy, process, risk-first approach, educational material, performance illustration, and contact details in a focused one-page experience with a separate gallery page.

> **Important:** This website is for personal branding, education, and illustration. It is not financial advice, a solicitation to trade, or a promise of future returns. Trading involves substantial risk. Past performance does not guarantee future results.

## About Koushik

Koushik is presented as a full-time forex trader who approaches the market as a probability game rather than a prediction contest. His process emphasizes:

- Technical analysis and price action
- Market structure and liquidity mapping
- Confluence across price action, momentum, and higher-timeframe context
- Predefined entries, stop-loss levels, and exits
- Position sizing and capital protection
- Trading psychology and emotional control
- Patience, discipline, and consistent execution

The site's central message is **"Focused on Process, Not Predictions."** Koushik's approach is based on waiting for several independent signals to align, defining risk before entering a trade, and reviewing decisions without allowing individual wins or losses to control the process.

The About section also identifies Koushik as NISM certified with registration number `202500055982`. Any personal credentials, statistics, testimonials, or claims should be reviewed and updated by the site owner before publication.

## Website Purpose

This small website acts as a digital introduction to Koushik and his trading work. It is designed to:

1. Introduce Koushik and his trading philosophy.
2. Explain a repeatable framework for evaluating trades.
3. Provide simple educational resources about market structure, risk, and psychology.
4. Show an interactive market-data preview.
5. Help visitors understand risk before contacting or learning more.
6. Give visitors a direct contact form and access to a visual gallery.

## Main Sections

### Home and Live Market Terminal

The hero section introduces the brand with the headline:

> Trading With Precision. Thinking Beyond The Chart.

It includes a terminal-style market display with:

- A candlestick chart drawn using the HTML Canvas API
- Currency/instrument selection
- Chart intervals: `1M`, `5M`, `15M`, `1H`, `4H`, and `1D`
- Current price, percentage change, bid, ask, and update time
- A list of supported market symbols
- A live-data status indicator

Supported instruments are:

- `EUR/USD`
- `GBP/USD`
- `USD/JPY`
- `USD/CHF`
- `AUD/USD`
- `USD/CAD`
- `XAU/USD`

The chart requests time-series data for the selected instrument. If the data provider is unavailable, rate-limited, or not configured, the site draws a symbol-specific fallback chart so changing the instrument still changes the visual result.

### Market Ticker

The ticker displays current or cached market prices and percentage changes for the supported instruments. The page also explains that market data may be delayed depending on the provider and subscription plan.

### About Koushik

The About section contains Koushik's portrait, profile introduction, trading principles, credentials, experience statistics, and focus areas. The displayed statistics are currently marked as editable placeholders and should not be treated as verified performance claims without supporting records.

### Trading Philosophy

The philosophy section is built around three principles:

- **Discipline:** Follow the setup, respect the stop, and avoid chasing the market.
- **Risk First:** Protect capital before pursuing returns.
- **Patience:** Accept that the best trade can sometimes be no trade.

### Koushik Framework

The strategy section explains a five-step process:

1. **Market Structure:** Identify trends, breakouts, support, resistance, liquidity zones, and key levels.
2. **Confluence:** Combine price action, structure, momentum, and higher-timeframe context.
3. **Entry:** Wait for confirmation instead of entering purely from prediction.
4. **Risk Management:** Use predefined stops and controlled position sizing.
5. **Exit:** Manage exits using risk/reward targets and market structure.

### Performance

The Performance section uses a canvas chart with two views:

- Monthly profit/loss bars
- Cumulative return line chart

The current values are illustrative website content and should be replaced with verified, clearly dated results if the site is used publicly for performance reporting.

### Risk Calculator

Visitors can enter:

- Account balance
- Risk percentage
- Stop-loss distance in pips
- Pip value

The calculator displays the estimated risk amount and position size in lots.

The calculations are:

```text
Risk amount = account balance × (risk percentage ÷ 100)
Position size = risk amount ÷ (stop-loss pips × pip value)
```

This is a simplified educational calculator. Actual position sizing can depend on currency pair, account currency, contract size, broker specifications, spread, commissions, and instrument type.

### Education

Three article cards open in accessible modal dialogs:

- **How To Read Market Structure**
- **The 1% Rule**
- **Trading Psychology**

The articles explain how to read highs and lows, why controlling downside matters, and how process and journaling help reduce emotional decisions.

### Courses

The site includes a courses section indicating that courses are coming soon. This can later be connected to course details, registration, payment, or an email waitlist.

### Gallery

`gallery.html` provides a separate gallery page for images and visual records related to Koushik's work, discipline, and trading journey. It opens from the main navigation in a new browser tab.

### Contact

The contact section includes a validated form for name, email, subject, and message. Submissions are currently sent through Formspree using the endpoint configured in `index.html`.

## Technology

This is a lightweight static website built with:

- HTML5 for page structure and accessibility markup
- CSS3 for layout, responsive behavior, visual design, animation, and theming
- Vanilla JavaScript for interactivity and data handling
- HTML Canvas for the market and performance charts
- Twelve Data API for market quotes and time-series data
- Formspree for contact-form delivery
- Google Fonts: Space Grotesk, Inter, and JetBrains Mono

No frontend framework or build tool is required.

## Project Structure

```text
.
├── index.html       # Main one-page personal website
├── gallery.html     # Separate image gallery page
├── script.js        # Navigation, charts, market data, calculator, modals, and form logic
├── style.css        # Complete site styling and responsive layout
├── koushik.png      # Profile image
├── logo.png         # Brand logo and favicon source
├── dashboard.png    # Dashboard or supporting visual asset
└── pics/            # Gallery and supporting image assets
```

## Running Locally

Because this is a static site, it can be opened directly in a browser:

1. Open `index.html` in a browser.
2. Use the navigation to move between sections.
3. Open the Gallery link to view `gallery.html`.

For a more reliable local development experience, serve the folder with any static server. For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

A local server is recommended because browser security policies can affect API requests and form behavior when HTML files are opened with a `file://` URL.

## Market Data Configuration

The market integration is implemented in `script.js` through Twelve Data. The current file contains an API key value used by the browser. Browser-visible API keys are not private and can be copied by visitors.

For production:

1. Do not expose a private production API key in client-side JavaScript.
2. Move Twelve Data requests behind a server, serverless function, or proxy.
3. Store the secret in an environment variable on that server.
4. Add request throttling, error handling, and provider usage monitoring.
5. Check the provider's terms and the data plan's rate limits.

The site stores successful quote results in browser `localStorage` under `koushik-market-quotes` so cached values can be displayed when appropriate.

## Contact Form Configuration

The form action is configured in `index.html` and currently points to Formspree. Before publishing:

1. Confirm that the endpoint belongs to the correct Formspree account.
2. Configure the desired notification email and spam controls.
3. Test successful and failed submissions.
4. Add a privacy notice if visitor information is collected.
5. Replace the endpoint if the project moves to a different form provider or backend.

## Responsive and Accessibility Features

The website includes:

- Responsive layout for desktop and mobile screens
- Mobile navigation with an accessible expanded/collapsed state
- Semantic sections and headings
- Labels for form controls and the instrument selector
- Canvas `role="img"` and descriptive `aria-label` attributes
- Keyboard Escape support for closing article modals
- Live status messaging for market data and form feedback
- Reduced reliance on images for conveying essential content

Accessibility should still be tested with keyboard navigation, screen readers, zoom, and real mobile devices before launch.

## Customization Guide

### Update profile information

Edit the About section in `index.html` to update:

- Name and professional description
- Certification details
- Experience and chart-study statistics
- Trading principles and areas of focus
- Profile image and logo

### Update market instruments

Keep the symbol options in `index.html` synchronized with the `marketSymbols` array in `script.js`. If a provider uses a different symbol format, update the request mapping accordingly.

### Update performance content

Edit the performance values and summary text in `index.html` and the chart arrays in `script.js`. Keep all public performance claims accurate, dated, and supported by appropriate records.

### Add courses

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
