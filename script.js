/* =========================================================
  THE TRADER KOUSHIK — SCRIPT
  Live Twelve Data integration for the public frontend.
  IMPORTANT: a browser API key is visible to visitors. For production,
  move these requests behind a backend/serverless function.
   ========================================================= */
(function () {
  "use strict";

  const reloadOnOpenKey = "koushik-reloaded-on-open";
  if (!sessionStorage.getItem(reloadOnOpenKey)) {
    sessionStorage.setItem(reloadOnOpenKey, "true");
    setTimeout(() => window.location.reload(), 2500);
  }

  /* ---------- 1. NAVBAR: scroll state + mobile menu ---------- */
  const navbar = document.getElementById("navbar");
  const burger = document.getElementById("navbarBurger");
  const navLinks = document.getElementById("navbarNav");

  function onScrollNavbar() {
    navbar.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScrollNavbar, { passive: true });
  onScrollNavbar();

  burger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    burger.classList.toggle("is-active", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll(".navbar__link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      burger.classList.remove("is-active");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 2. SCROLL REVEAL ---------- */
  const revealTargets = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("is-visible"), i * 40);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- 3. ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll(".stat__value");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = Math.round(target * eased);
          el.textContent = val.toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- 4. HERO CANDLESTICK CHART (canvas) ---------- */
  const heroCanvas = document.getElementById("heroChart");
  const heroCtx = heroCanvas.getContext("2d");
  const W = heroCanvas.width, H = heroCanvas.height;

  // seeded pseudo-random walk so it looks "real" but is fully demo/simulated
  function seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }
  const rand = seededRandom(42);

  function generateCandles(count) {
    const candles = [];
    let price = 100;
    for (let i = 0; i < count; i++) {
      const open = price;
      const change = (rand() - 0.48) * 4;
      const close = open + change;
      const high = Math.max(open, close) + rand() * 2;
      const low = Math.min(open, close) - rand() * 2;
      candles.push({ open, close, high, low });
      price = close;
    }
    return candles;
  }
  const candleData = generateCandles(46);

  let animProgress = 0;
  function drawHeroChart() {
    heroCtx.clearRect(0, 0, W, H);

    const visibleCount = Math.max(2, Math.floor(candleData.length * animProgress));
    const visible = candleData.slice(0, visibleCount);
    const allHighs = candleData.map((c) => c.high);
    const allLows = candleData.map((c) => c.low);
    const max = Math.max(...allHighs);
    const min = Math.min(...allLows);
    const range = max - min || 1;
    const padY = 20;

    function yFor(v) {
      return padY + (1 - (v - min) / range) * (H - padY * 2);
    }

    // faint grid lines
    heroCtx.strokeStyle = "rgba(255,255,255,0.05)";
    heroCtx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const y = padY + ((H - padY * 2) / 3) * i;
      heroCtx.beginPath();
      heroCtx.moveTo(0, y);
      heroCtx.lineTo(W, y);
      heroCtx.stroke();
    }

    const slotW = W / candleData.length;
    const bodyW = slotW * 0.55;

    // price line (closing prices) behind candles
    heroCtx.beginPath();
    heroCtx.strokeStyle = "rgba(23,217,142,0.35)";
    heroCtx.lineWidth = 1.5;
    visible.forEach((c, i) => {
      const x = i * slotW + slotW / 2;
      const y = yFor(c.close);
      if (i === 0) heroCtx.moveTo(x, y);
      else heroCtx.lineTo(x, y);
    });
    heroCtx.stroke();

    // candles
    visible.forEach((c, i) => {
      const x = i * slotW + slotW / 2;
      const up = c.close >= c.open;
      heroCtx.strokeStyle = up ? "#17d98e" : "#f2555c";
      heroCtx.fillStyle = up ? "rgba(23,217,142,0.85)" : "rgba(242,85,92,0.85)";
      heroCtx.lineWidth = 1;

      // wick
      heroCtx.beginPath();
      heroCtx.moveTo(x, yFor(c.high));
      heroCtx.lineTo(x, yFor(c.low));
      heroCtx.stroke();

      // body
      const yOpen = yFor(c.open);
      const yClose = yFor(c.close);
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(Math.abs(yOpen - yClose), 2);
      heroCtx.fillRect(x - bodyW / 2, bodyTop, bodyW, bodyHeight);
    });
  }

  function animateHeroChart(timestamp) {
    animProgress = Math.min(animProgress + 0.018, 1);
    drawHeroChart();
    if (animProgress < 1) requestAnimationFrame(animateHeroChart);
  }
  // The chart remains empty until real market candles arrive.

  // resize canvas for crispness
  function fitCanvas(canvas, ctx) {
    const ratio = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth || canvas.width;
    const cssH = (canvas.width ? canvas.height / canvas.width : 1) * cssW;
  }

  /* live-feeling price ticker on hero */
  const heroPriceEl = document.getElementById("heroPrice");
  const heroPriceChangeEl = document.getElementById("heroPriceChange");
  let xauPrice = 2417.8;
  const xauBase = 2417.8;

  function updateHeroPrice() {}

  /* pair rows simulated movement */
  const pairRows = document.querySelectorAll(".pair-row");
  function updatePairRows() {}

  /* ---------- 5. MARKET TICKER (simulated, scrolling) ---------- */
  const tickerData = [
    { name: "EUR/USD", change: 0.42 },
    { name: "GBP/USD", change: 0.28 },
    { name: "USD/JPY", change: -0.16 },
    { name: "XAU/USD", change: 0.73 },
    { name: "GBP/JPY", change: 0.51 },
    { name: "USD/CAD", change: -0.21 },
    { name: "AUD/USD", change: 0.18 },
    { name: "USD/CHF", change: -0.09 },
  ];
  const tickerTrack = document.getElementById("tickerTrack");

  function renderTicker() {
    const html = tickerData
      .map(
        (t) => `
      <div class="ticker-item ticker__item" data-symbol="${t.name}">
        <span class="ticker__item-name">${t.name}</span>
        <span class="ticker__item-change ${t.change >= 0 ? "ticker__item-change--up" : "ticker__item-change--down"}">
          ${t.change >= 0 ? "+" : ""}${t.change.toFixed(2)}%
        </span>
      </div>`
      )
      .join("");
    // duplicate content for seamless infinite scroll
    tickerTrack.innerHTML = html + html;
  }
  // Live ticker rendering is added below the existing layout modules.

  /* ---------- 5. LIVE MARKET DATA ---------- */
  const API_KEY = "99e0273a06f4474382e4c503bc78ac8f";
  const marketSymbols = ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "XAU/USD"];
  const intervalMap = { "1M": "1min", "5M": "5min", "15M": "15min", "1H": "1h", "4H": "4h", "1D": "1day" };
  const quoteBatchSize = 4;
  let quoteCursor = 0;
  const marketCacheKey = "koushik-market-quotes";
  let cachedQuotes = {};
  try { cachedQuotes = JSON.parse(localStorage.getItem(marketCacheKey) || "{}"); } catch (error) { cachedQuotes = {}; }
  const marketState = new Map(Object.entries(cachedQuotes));
  const tickerStatus = document.getElementById("tickerStatus");
  const heroSymbol = document.getElementById("heroSymbol");
  const heroQuoteMeta = document.getElementById("heroQuoteMeta");
  const isApiKeyConfigured = API_KEY !== "YOUR_TWELVE_DATA_API_KEY";
  let chartRequestId = 0;

  function formatPrice(value, symbol) {
    const decimals = symbol.includes("JPY") || symbol === "XAU/USD" ? 2 : 4;
    return Number(value).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  function formatChange(value) {
    const number = Number(value);
    return Number.isFinite(number) ? `${number >= 0 ? "+" : ""}${number.toFixed(2)}%` : "Unavailable";
  }
  function marketTime() { return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }); }
  function setMarketStatus(message) { tickerStatus.textContent = `· ${message}`; }
  function setStatusPanel(message) {
    document.getElementById("marketStatus").textContent = message;
    document.getElementById("marketUpdated").textContent = marketTime();
  }
  async function requestMarket(path) {
    if (!isApiKeyConfigured) throw new Error("Configure API_KEY first");
    const response = await fetch(`https://api.twelvedata.com/${path}${path.includes("?") ? "&" : "?"}apikey=${encodeURIComponent(API_KEY)}`);
    const data = await response.json();
    if (!response.ok || data.status === "error" || data.code) {
      const error = new Error(data.message || "Market request failed");
      error.code = data.code || response.status;
      throw error;
    }
    return data;
  }
  function renderMarketRows() {
    document.getElementById("terminalPairs").innerHTML = marketSymbols.map((symbol) => {
      const quote = marketState.get(symbol);
      if (!quote) return `<div class="pair-row"><span class="pair-row__name">${symbol}</span><span class="pair-row__price">Unavailable</span><span class="pair-row__change">—</span></div>`;
      const up = Number(quote.change) >= 0;
      return `<div class="pair-row"><span class="pair-row__name">${symbol}</span><span class="pair-row__price">${formatPrice(quote.price, symbol)}</span><span class="pair-row__change ${up ? "pair-row__change--up" : "pair-row__change--down"}">${up ? "▲" : "▼"} ${formatChange(quote.change)}</span><span class="pair-row__updated">${quote.updated}</span></div>`;
    }).join("");
    const tickerHtml = marketSymbols.map((symbol) => {
      const quote = marketState.get(symbol);
      return `<div class="ticker-item ticker__item" data-symbol="${symbol}"><span class="ticker__item-name">${symbol}</span><span class="ticker__item-price">${quote ? formatPrice(quote.price, symbol) : "Unavailable"}</span><span class="ticker__item-change ${quote && Number(quote.change) >= 0 ? "ticker__item-change--up" : "ticker__item-change--down"}">${quote ? `${Number(quote.change) >= 0 ? "▲" : "▼"} ${formatChange(quote.change)}` : "—"}</span></div>`;
    }).join("");
    tickerTrack.innerHTML = tickerHtml + tickerHtml;
  }
  function renderHeroQuote() {
    const quote = marketState.get(heroSymbol.value);
    if (!quote) { heroPriceEl.textContent = "Market data temporarily unavailable"; heroPriceChangeEl.textContent = ""; heroQuoteMeta.textContent = "Awaiting market data"; return; }
    const up = Number(quote.change) >= 0;
    heroPriceEl.textContent = formatPrice(quote.price, heroSymbol.value);
    heroPriceChangeEl.textContent = `${up ? "▲" : "▼"} ${formatChange(quote.change)}`;
    heroPriceChangeEl.className = `terminal__price-change ${up ? "terminal__price-change--up" : "terminal__price-change--down"}`;
    heroQuoteMeta.textContent = `Bid ${quote.bid || "—"} · Ask ${quote.ask || "—"} · Updated ${quote.updated}`;
  }
  async function refreshQuotes() {
    if (!isApiKeyConfigured) { setMarketStatus("CONFIGURE API KEY"); setStatusPanel("MARKET DATA UNAVAILABLE · CONFIGURE API KEY"); renderMarketRows(); renderHeroQuote(); return; }
    const rotatingSymbols = marketSymbols.slice(quoteCursor).concat(marketSymbols.slice(0, quoteCursor));
    const symbolsToRefresh = [heroSymbol.value, ...rotatingSymbols.filter((symbol) => symbol !== heroSymbol.value)].slice(0, quoteBatchSize);
    quoteCursor = (quoteCursor + quoteBatchSize) % marketSymbols.length;
    const results = await Promise.allSettled(symbolsToRefresh.map(async (symbol) => [symbol, await requestMarket(`quote?symbol=${encodeURIComponent(symbol)}`)]));
    let successfulQuotes = 0;
    let lastError = null;
    results.forEach((result, index) => {
      const symbol = symbolsToRefresh[index];
      if (result.status === "fulfilled") {
        const quote = result.value[1];
        marketState.set(symbol, { price: quote.close, change: quote.percent_change, bid: quote.bid, ask: quote.ask, updated: marketTime() });
        successfulQuotes += 1;
      } else {
        lastError = result.reason;
      }
    });
    try { localStorage.setItem(marketCacheKey, JSON.stringify(Object.fromEntries(marketState))); } catch (error) {}
    renderMarketRows();
    renderHeroQuote();
    if (successfulQuotes > 0) {
      setMarketStatus(`LIVE · ${successfulQuotes}/${marketSymbols.length} UPDATED`);
      setStatusPanel("FOREX MARKET OPEN");
    } else {
      const detail = lastError && lastError.code ? ` · ${lastError.code}` : "";
      const hasCachedQuotes = marketState.size > 0;
      setMarketStatus(`${hasCachedQuotes ? "CACHED DATA" : "MARKET DATA UNAVAILABLE"}${detail}`);
      setStatusPanel(`${hasCachedQuotes ? "CACHED MARKET DATA" : "MARKET DATA UNAVAILABLE"}${detail}`);
    }
  }
  async function loadChart(interval) {
    const requestId = ++chartRequestId;
    const symbol = heroSymbol.value;
    if (!isApiKeyConfigured) { drawLiveChart([], symbol, interval); return; }
    try {
      const data = await requestMarket(`time_series?symbol=${encodeURIComponent(symbol)}&interval=${intervalMap[interval]}&outputsize=48`);
      if (requestId === chartRequestId && symbol === heroSymbol.value) drawLiveChart((data.values || []).reverse(), symbol, interval);
    } catch (error) {
      if (requestId === chartRequestId && symbol === heroSymbol.value) drawLiveChart([], symbol, interval);
    }
  }
  function drawLiveChart(values, symbol = heroSymbol.value, interval = "1H") {
    const context = heroCanvas.getContext("2d"); context.clearRect(0, 0, heroCanvas.width, heroCanvas.height); context.strokeStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < 4; i++) { const y = 20 + i * 86; context.beginPath(); context.moveTo(0, y); context.lineTo(heroCanvas.width, y); context.stroke(); }
    if (!values.length) {
      const seed = [...`${symbol}-${interval}`].reduce((total, character) => total + character.charCodeAt(0), 0);
      const fallbackRandom = seededRandom(seed);
      const fallbackCandles = [];
      let price = 100;
      for (let index = 0; index < 46; index++) {
        const open = price;
        const close = open + (fallbackRandom() - 0.48) * 4;
        const high = Math.max(open, close) + fallbackRandom() * 2;
        const low = Math.min(open, close) - fallbackRandom() * 2;
        fallbackCandles.push({ open, close, high, low });
        price = close;
      }
      const prices = fallbackCandles.flatMap((candle) => [candle.high, candle.low]);
      const min = Math.min(...prices), max = Math.max(...prices), range = max - min || 1;
      const yFor = (priceValue) => 20 + (1 - (priceValue - min) / range) * 260;
      const slot = heroCanvas.width / fallbackCandles.length;
      fallbackCandles.forEach((candle, index) => {
        const x = index * slot + slot / 2, up = candle.close >= candle.open;
        context.strokeStyle = up ? "#17d98e" : "#f2555c";
        context.fillStyle = up ? "rgba(23,217,142,0.85)" : "rgba(242,85,92,0.85)";
        context.beginPath(); context.moveTo(x, yFor(candle.high)); context.lineTo(x, yFor(candle.low)); context.stroke();
        context.fillRect(x - slot * .28, Math.min(yFor(candle.open), yFor(candle.close)), slot * .56, Math.max(Math.abs(yFor(candle.open) - yFor(candle.close)), 2));
      });
      return;
    }
    const prices = values.flatMap((c) => [Number(c.high), Number(c.low)]), min = Math.min(...prices), max = Math.max(...prices), range = max - min || 1;
    const yFor = (price) => 20 + (1 - (price - min) / range) * 260, slot = heroCanvas.width / values.length;
    context.beginPath(); context.strokeStyle = "rgba(23,217,142,0.55)"; context.lineWidth = 1.5;
    values.forEach((c, index) => { const x = index * slot + slot / 2, y = yFor(Number(c.close)); index ? context.lineTo(x, y) : context.moveTo(x, y); }); context.stroke();
    values.forEach((c, index) => { const x = index * slot + slot / 2, open = Number(c.open), close = Number(c.close), up = close >= open; context.strokeStyle = up ? "#17d98e" : "#f2555c"; context.fillStyle = up ? "rgba(23,217,142,0.85)" : "rgba(242,85,92,0.85)"; context.beginPath(); context.moveTo(x, yFor(Number(c.high))); context.lineTo(x, yFor(Number(c.low))); context.stroke(); context.fillRect(x - slot * .28, Math.min(yFor(open), yFor(close)), slot * .56, Math.max(Math.abs(yFor(open) - yFor(close)), 2)); });
  }
  heroSymbol.addEventListener("change", () => { renderHeroQuote(); loadChart("1H"); });
  document.querySelectorAll("[data-chart-interval]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-chart-interval]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    loadChart(button.dataset.chartInterval);
  }));
  refreshQuotes(); loadChart("1H"); setInterval(refreshQuotes, 60000);

  /* ---------- 6. PERFORMANCE CHART ---------- */
  const perfCanvas = document.getElementById("perfCanvas");
  const perfCtx = perfCanvas.getContext("2d");
  const months = ["Profit", "Loss"];
  const monthlyReturns = [1104.51, -77.76];
  let cumulativeReturns = [];
  monthlyReturns.reduce((acc, v, i) => {
    const next = acc + v;
    cumulativeReturns[i] = next;
    return next;
  }, 0);

  let perfMode = "monthly";

  function drawPerfChart() {
    const w = perfCanvas.width, h = perfCanvas.height;
    perfCtx.clearRect(0, 0, w, h);
    const padL = 46, padR = 20, padT = 20, padB = 36;
    const chartW = w - padL - padR, chartH = h - padT - padB;

    const data = perfMode === "monthly" ? monthlyReturns : cumulativeReturns;
    const max = Math.max(...data, 0);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    function yFor(v) {
      return padT + (1 - (v - min) / range) * chartH;
    }
    const zeroY = yFor(0);

    // gridlines
    perfCtx.strokeStyle = "rgba(255,255,255,0.06)";
    perfCtx.lineWidth = 1;
    perfCtx.font = "11px 'JetBrains Mono', monospace";
    perfCtx.fillStyle = "rgba(147,153,156,0.9)";
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i;
      perfCtx.beginPath();
      perfCtx.moveTo(padL, y);
      perfCtx.lineTo(w - padR, y);
      perfCtx.stroke();
      const val = max - (range / 4) * i;
      perfCtx.fillText("$" + val.toFixed(2), 4, y + 4);
    }

    if (perfMode === "monthly") {
      const slot = chartW / data.length;
      const barW = slot * 0.46;
      data.forEach((v, i) => {
        const x = padL + slot * i + slot / 2 - barW / 2;
        const y = yFor(v);
        const top = Math.min(y, zeroY);
        const height = Math.max(Math.abs(y - zeroY), 2);
        const grad = perfCtx.createLinearGradient(0, top, 0, top + height);
        if (v >= 0) {
          grad.addColorStop(0, "#17d98e");
          grad.addColorStop(1, "#0c8f5e");
        } else {
          grad.addColorStop(0, "#f2555c");
          grad.addColorStop(1, "#a83338");
        }
        perfCtx.fillStyle = grad;
        perfCtx.fillRect(x, top, barW, height);

        perfCtx.fillStyle = "rgba(147,153,156,0.9)";
        perfCtx.textAlign = "center";
        perfCtx.fillText(months[i], padL + slot * i + slot / 2, h - 12);
      });
      perfCtx.textAlign = "left";
    } else {
      // line chart for cumulative
      perfCtx.beginPath();
      perfCtx.strokeStyle = "#17d98e";
      perfCtx.lineWidth = 2.5;
      const slot = chartW / (data.length - 1);
      data.forEach((v, i) => {
        const x = padL + slot * i;
        const y = yFor(v);
        if (i === 0) perfCtx.moveTo(x, y);
        else perfCtx.lineTo(x, y);
      });
      perfCtx.stroke();

      // fill under line
      const lastX = padL + slot * (data.length - 1);
      perfCtx.lineTo(lastX, zeroY);
      perfCtx.lineTo(padL, zeroY);
      perfCtx.closePath();
      perfCtx.fillStyle = "rgba(23,217,142,0.12)";
      perfCtx.fill();

      // points + month labels
      perfCtx.fillStyle = "#17d98e";
      data.forEach((v, i) => {
        const x = padL + slot * i;
        const y = yFor(v);
        perfCtx.beginPath();
        perfCtx.arc(x, y, 3.5, 0, Math.PI * 2);
        perfCtx.fill();
        perfCtx.fillStyle = "rgba(147,153,156,0.9)";
        perfCtx.textAlign = "center";
        perfCtx.fillText(months[i], x, h - 12);
        perfCtx.fillStyle = "#17d98e";
      });
      perfCtx.textAlign = "left";
    }
  }
  drawPerfChart();

  const perfToggle = document.getElementById("perfToggle");
  perfToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".toggle__btn");
    if (!btn) return;
    perfToggle.querySelectorAll(".toggle__btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    perfMode = btn.dataset.mode;
    drawPerfChart();
  });

  /* ---------- 7. RISK CALCULATOR ---------- */
  const calcBalance = document.getElementById("calcBalance");
  const calcRisk = document.getElementById("calcRisk");
  const calcStop = document.getElementById("calcStop");
  const calcPipValue = document.getElementById("calcPipValue");
  const calcRiskAmount = document.getElementById("calcRiskAmount");
  const calcPositionSize = document.getElementById("calcPositionSize");
  const calcReset = document.getElementById("calcReset");

  const DEFAULTS = { balance: 10000, risk: 1, stop: 25, pipValue: 10 };

  function runCalc() {
    const balance = parseFloat(calcBalance.value) || 0;
    const riskPct = parseFloat(calcRisk.value) || 0;
    const stopPips = parseFloat(calcStop.value) || 0;
    const pipValue = parseFloat(calcPipValue.value) || 0;

    const riskAmount = balance * (riskPct / 100);
    let positionLots = 0;
    if (stopPips > 0 && pipValue > 0) {
      positionLots = riskAmount / (stopPips * pipValue);
    }

    calcRiskAmount.textContent = "$" + riskAmount.toFixed(2);
    calcPositionSize.textContent = positionLots.toFixed(2) + " lots";
  }

  [calcBalance, calcRisk, calcStop, calcPipValue].forEach((input) =>
    input.addEventListener("input", runCalc)
  );
  calcReset.addEventListener("click", () => {
    calcBalance.value = DEFAULTS.balance;
    calcRisk.value = DEFAULTS.risk;
    calcStop.value = DEFAULTS.stop;
    calcPipValue.value = DEFAULTS.pipValue;
    runCalc();
  });
  runCalc();

  /* ---------- 9. ARTICLE MODAL ---------- */
  const articles = {
    structure: {
      category: "Technical Analysis",
      title: "How To Read Market Structure",
      body: [
        "Market structure is the skeleton underneath every price chart. It describes the sequence of highs and lows that tell you, at a glance, whether a market is trending, ranging, or turning.",
        "In an uptrend, price tends to make higher highs and higher lows. The moment that pattern breaks — a lower low appears where a higher low was expected — is often the first sign that control has shifted from buyers to sellers, or vice versa.",
        "Support and resistance are simply the memory of these turning points. Liquidity tends to cluster just beyond obvious swing highs and lows, which is why price often 'hunts' those levels before reversing.",
        "None of this predicts the future. It narrows the field of reasonable outcomes and gives a trader a map to react to, rather than a crystal ball to trust blindly."
      ]
    },
    onepercent: {
      category: "Risk Management",
      title: "The 1% Rule",
      body: [
        "The 1% rule is simple: risk no more than 1% of total account capital on any single trade. It is not about being conservative for its own sake — it is about surviving long enough for a strategy's edge to play out.",
        "A trader risking 1% per trade can lose ten times in a row and still have roughly 90% of their capital left to work with. A trader risking 10% per trade could not say the same.",
        "The rule also removes emotion from position sizing. Once risk is capped at a known percentage, the size of any single win or loss stops feeling like a referendum on the trader's worth — it becomes just one data point in a long series.",
        "Consistency compounds. Blow-ups don't. That asymmetry is the entire argument for controlling downside before chasing upside."
      ]
    },
    psychology: {
      category: "Psychology",
      title: "Trading Psychology",
      body: [
        "Most trading mistakes are not knowledge problems — they're behaviour problems. A trader can understand risk management perfectly and still move a stop loss in the heat of the moment.",
        "Two patterns show up again and again: revenge trading after a loss, and outsized confidence after a win. Both are attempts to manage an emotion rather than manage a position.",
        "Discipline is built the same way a habit is built — through repetition of small, boring, correct decisions. Journaling trades, reviewing them without judgment, and sticking to predefined rules even when a setup 'feels' different are the unglamorous mechanics behind consistency.",
        "The goal isn't to eliminate emotion. It's to build a process specific enough that emotion has less room to influence the decision."
      ]
    }
  };

  const modal = document.getElementById("articleModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");
  const modalCategory = document.getElementById("modalCategory");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  function openModal(key) {
    const data = articles[key];
    if (!data) return;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.body.map((p) => `<p>${p}</p>`).join("");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".article-card").forEach((card) => {
    card.querySelector(".article-card__link").addEventListener("click", () => {
      openModal(card.dataset.article);
    });
  });
  modalBackdrop.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  /* ---------- 10. CONTACT FORM (Formspree) ---------- */
  const contactForm = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  const contactSubmit = document.getElementById("contactSubmit");
  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 4200);
  }

  function validateContactForm() {
    const fields = [
      ["cfName", "Name", (value) => value.length >= 2],
      ["cfEmail", "Email", (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)],
      ["cfSubject", "Subject", (value) => value.length > 0],
      ["cfMessage", "Message", (value) => value.length >= 10]
    ];
    let valid = true;
    fields.forEach(([id, label, check]) => {
      const input = document.getElementById(id);
      const error = document.getElementById(`${id}Error`);
      const value = input.value.trim();
      const message = value ? `${label} is not valid.` : `${label} is required.`;
      error.textContent = check(value) ? "" : message;
      input.setAttribute("aria-invalid", String(!check(value)));
      if (!check(value)) valid = false;
    });
    return valid;
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateContactForm()) return;
    contactSubmit.disabled = true;
    contactSubmit.textContent = "Sending...";
    try {
      const response = await fetch(contactForm.action, { method: "POST", body: new FormData(contactForm), headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Form submission failed");
      showToast("Message sent successfully.");
      contactForm.reset();
      contactForm.querySelectorAll("[aria-invalid]").forEach((input) => input.removeAttribute("aria-invalid"));
    } catch (error) {
      showToast("Unable to send your message. Please try again.");
    } finally {
      contactSubmit.disabled = false;
      contactSubmit.textContent = "Send Message";
    }
  });

})();
