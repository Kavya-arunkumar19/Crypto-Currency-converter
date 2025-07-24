async function convertCurrency() {
  const amount = document.getElementById("amount").value;
  const from = "EUR";
  const to = "USD";

  const resultEl = document.getElementById("converted-amount");

  if (!amount || amount <= 0) {
    resultEl.innerText = "--";
    return;
  }

  const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const converted = data.rates[to];

    resultEl.innerText = converted.toFixed(2);
  } catch (err) {
    resultEl.innerText = "⚠️";
  }
}
