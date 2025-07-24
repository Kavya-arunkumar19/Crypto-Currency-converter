// Currency converter (EUR → USD)
async function convertCurrency() {
  const amount = document.getElementById("currency-amount").value;
  const resultEl = document.getElementById("currency-result");

  if (!amount || amount <= 0) {
    resultEl.innerText = "--";
    return;
  }

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=EUR&to=USD`);
    const data = await res.json();
    resultEl.innerText = data.rates.USD.toFixed(2);
  } catch {
    resultEl.innerText = "Error";
  }
}

// Crypto price checker
async function fetchCryptoPrice() {
  const crypto = document.getElementById("crypto").value;
  const currency = document.getElementById("crypto-currency").value;
  const resultBox = document.getElementById("crypto-result");

  resultBox.innerText = "⏳ Fetching...";

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`);
    const data = await res.json();
    const price = data[crypto][currency];
    resultBox.innerText = `💰 1 ${crypto.toUpperCase()} = ${price} ${currency.toUpperCase()}`;
  } catch {
    resultBox.innerText = "⚠️ Error fetching price.";
  }
}
