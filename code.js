// Crypto Price Tracker using CoinGecko
async function fetchPrice() {
  const crypto = document.getElementById("crypto").value;
  const currency = document.getElementById("currency").value;
  const resultBox = document.getElementById("crypto-result");

  resultBox.innerText = "⏳ Fetching crypto price...";

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const price = data[crypto][currency];

    resultBox.innerText = `💸 ${crypto.charAt(0).toUpperCase() + crypto.slice(1)} is currently ${price} ${currency.toUpperCase()}`;
  } catch (err) {
    resultBox.innerText = "⚠️ Error fetching crypto price. Please try again later.";
  }
}

// Real Currency Converter using Frankfurter API
async function convertCurrency() {
  const amount = document.getElementById("amount").value;
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const resultBox = document.getElementById("conversion-result");

  if (!amount || amount <= 0) {
    resultBox.innerText = "⚠️ Please enter a valid amount.";
    return;
  }

  if (from === to) {
    resultBox.innerText = `ℹ️ ${amount} ${from} = ${amount} ${to}`;
    return;
  }

  resultBox.innerText = "⏳ Converting...";

  const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    const result = data.rates[to];

    resultBox.innerText = `✅ ${amount} ${from} = ${result} ${to}`;
  } catch (err) {
    resultBox.innerText = "⚠️ Error converting currency. Please check your internet or try again.";
  }
}
