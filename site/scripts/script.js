// script.js

// Global variables to handle pagination & currency
let currentPage = 1;
let currentCurrency = 'usd';
const perPage = 8;

// On DOM load, fetch the first batch of cryptos
document.addEventListener("DOMContentLoaded", () => {
  initCurrencySelect();
  initLoadMoreButton();
  fetchAndRenderCryptos();
});

// Initializes the currency dropdown
function initCurrencySelect() {
  const currencySelect = document.getElementById('currencySelect');
  // Listen for changes in the dropdown
  currencySelect.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    currentPage = 1; // Reset to page 1 whenever currency changes
    clearCryptoContainer();
    fetchAndRenderCryptos();
  });
}

// Initializes the "Load More" button
function initLoadMoreButton() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    fetchAndRenderCryptos();
  });
}

// Clears the crypto container (used on currency change)
function clearCryptoContainer() {
  const container = document.getElementById("crypto-container");
  container.innerHTML = "";
}

// Fetch & render the cryptos based on currentCurrency & currentPage
async function fetchAndRenderCryptos() {
  const apiUrl = "https://api.coingecko.com/api/v3/coins/markets";
  const params = new URLSearchParams({
    vs_currency: currentCurrency,
    order: "market_cap_desc",
    per_page: perPage,
    page: currentPage,
    sparkline: "false",
  });

  try {
    const response = await fetch(`${apiUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    renderCryptoCards(data);
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
}

// Render the new batch of crypto cards
function renderCryptoCards(cryptoData) {
  const container = document.getElementById("crypto-container");

  cryptoData.forEach((coin) => {
    const { name, image, current_price, price_change_percentage_24h, symbol } = coin;

    // Create card
    const card = document.createElement("div");
    card.classList.add("crypto-card");

    // Price color
    const priceChangeClass = price_change_percentage_24h >= 0 ? "green" : "red";
    const priceChange = price_change_percentage_24h ? price_change_percentage_24h.toFixed(2) : 0;

    // TradingView link (placeholder) based on symbol + currency
    // e.g. BTC + USD => "https://www.tradingview.com/symbols/BTCUSD"
    // This may not always exist for every coin/currency pair, but good for demonstration
    const tradingViewLink = `https://www.tradingview.com/symbols/${symbol.toUpperCase()}${currentCurrency.toUpperCase()}`;

    card.innerHTML = `
      <img src="${image}" alt="${name}" width="50" height="50" style="margin-bottom:1rem;" />
      <h3>${name}</h3>
      <div class="price">Price: ${formatPrice(current_price, currentCurrency)}</div>
      <div class="change ${priceChangeClass}">
        24h Change: ${priceChange}%
      </div>
    `;

    // Create "View Chart" button
    const chartButton = document.createElement("button");
    chartButton.classList.add("chart-button");
    chartButton.textContent = "View Chart";

    // On click, open TradingView in a new tab (placeholder)
    chartButton.addEventListener('click', () => {
      window.open(tradingViewLink, '_blank');
    });

    card.appendChild(chartButton);
    container.appendChild(card);
  });
}

// Helper to format price with currency symbol
function formatPrice(price, currency) {
  // Basic local formatting
  let formatted = price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Append currency symbol or code
  switch (currency) {
    case 'usd':
      return `$${formatted}`;
    case 'eur':
      return `€${formatted}`;
    case 'ron':
      return `${formatted} RON`;
    default:
      return `${formatted} ${currency.toUpperCase()}`;
  }
}
