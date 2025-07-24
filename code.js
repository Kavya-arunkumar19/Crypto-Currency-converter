// Enhanced crypto price fetching with additional data
async function fetchCryptoPrice() {
    const crypto = document.getElementById("crypto").value;
    const currency = document.getElementById("currency").value;
    const resultDiv = document.getElementById("crypto-result");
    
    // Show loading state
    resultDiv.innerHTML = '<span class="loading"></span>Fetching live price...';
    resultDiv.classList.add('show');
    
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}&include_24hr_change=true`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data[crypto]) {
            const price = data[crypto][currency];
            const change24h = data[crypto][`${currency}_24h_change`];
            
            const cryptoName = crypto.charAt(0).toUpperCase() + crypto.slice(1);
            const currencyUpper = currency.toUpperCase();
            
            let changeClass = '';
            let changeSymbol = '';
            if (change24h > 0) {
                changeClass = 'price-up';
                changeSymbol = '+';
            } else if (change24h < 0) {
                changeClass = 'price-down';
                changeSymbol = '';
            }
            
            let changeHtml = '';
            if (change24h !== undefined) {
                changeHtml = `<span class="price-change ${changeClass}">${changeSymbol}${change24h.toFixed(2)}%</span>`;
            }
            
            resultDiv.innerHTML = `
                <div>
                    <strong>${cryptoName}</strong> Current Price: 
                    <strong>${formatPrice(price)} ${currencyUpper}</strong>
                    ${changeHtml}
                    <br><small style="opacity: 0.7; margin-top: 5px; display: block;">24h Change</small>
                </div>
            `;
        } else {
            throw new Error('Invalid cryptocurrency data');
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <div style="color: #e74c3c;">
                ❌ Unable to fetch crypto price. Please try again.
            </div>
        `;
    }
}

// Enhanced currency conversion with better formatting
async function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const resultDiv = document.getElementById("conversion-result");
    
    if (!amount || amount <= 0) {
        resultDiv.innerHTML = `
            <div style="color: #f39c12;">
                ⚠️ Please enter a valid amount
            </div>
        `;
        resultDiv.classList.add('show');
        return;
    }
    
    if (from === to) {
        resultDiv.innerHTML = `
            <div>
                <strong>${formatPrice(amount)} ${from}</strong> = <strong>${formatPrice(amount)} ${to}</strong>
                <br><small style="opacity: 0.7; margin-top: 5px; display: block;">Same currency selected</small>
            </div>
        `;
        resultDiv.classList.add('show');
        return;
    }
    
    // Show loading state
    resultDiv.innerHTML = '<span class="loading"></span>Converting currency...';
    resultDiv.classList.add('show');
    
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.rates && data.rates[to]) {
            const result = data.rates[to];
            const rate = result / amount;
            
            resultDiv.innerHTML = `
                <div>
                    <strong>${formatPrice(amount)} ${from}</strong> = <strong>${formatPrice(result)} ${to}</strong>
                    <br><small style="opacity: 0.7; margin-top: 5px; display: block;">Exchange Rate: 1 ${from} = ${rate.toFixed(4)} ${to}</small>
                </div>
            `;
        } else {
            throw new Error('Invalid conversion data');
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <div style="color: #e74c3c;">
                ❌ Unable to convert currency. Please try again.
            </div>
        `;
    }
}

// Format price with appropriate decimal places
function formatPrice(price) {
    if (price >= 1) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    } else {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(price);
    }
}

// Add enter key support for inputs
document.getElementById('amount').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        convertCurrency();
    }
});

// Add some sample data on load
window.addEventListener('load', function() {
    // Auto-focus on first input for better UX
    document.getElementById('crypto').focus();
});