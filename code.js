// Currency converter (EUR → USD)
async function convertCurrency() {
  const amount = document.getElementById("currency-amount").value;
  const resultEl = document.getElementById("currency-result");
  const historyEl = document.getElementById("currency-history-list");

  if (!amount || amount <= 0) {
    resultEl.innerText = "--";
    return;
  }

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=EUR&to=USD`);
    const data = await res.json();
    const converted = data.rates.USD.toFixed(2);
    resultEl.innerText = converted;

    const entry = document.createElement("li");
    entry.innerText = `€${amount} ➝ $${converted}`;
    historyEl.prepend(entry);
  } catch {
    resultEl.innerText = "Error";
  }
}

// Crypto price checker
async function fetchCryptoPrice() {
  const crypto = document.getElementById("crypto").value;
  const currency = document.getElementById("crypto-currency").value;
  const resultBox = document.getElementById("crypto-result");
  const historyEl = document.getElementById("crypto-history-list");

  resultBox.innerText = "⏳ Fetching...";

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`);
    const data = await res.json();
    const price = data[crypto][currency];
    const formatted = `${price} ${currency.toUpperCase()}`;
    resultBox.innerText = `💰 1 ${crypto.toUpperCase()} = ${formatted}`;

    const entry = document.createElement("li");
    entry.innerText = `1 ${crypto.toUpperCase()} ➝ ${formatted}`;
    historyEl.prepend(entry);
  } catch {
    resultBox.innerText = "⚠️ Error fetching price.";
  }
}

// Theme toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
