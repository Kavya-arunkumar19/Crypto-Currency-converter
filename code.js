// Enhanced crypto price fetching with detailed error handling
async function fetchCryptoPrice() {
    const crypto = document.getElementById("crypto").value;
    const currency = document.getElementById("currency").value;
    const resultDiv = document.getElementById("crypto-result");
    
    // Show loading state
    resultDiv.innerHTML = '<span class="loading"></span>Fetching live price...';
    resultDiv.classList.add('show');
    
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}&include_24hr_change=true`;
    
    try {
        console.log('Fetching from:', url); // Debug log
        
        const response = await fetch(url);
        console.log('Response status:', response.status); // Debug log
        
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            } else if (response.status === 403) {
                throw new Error('API access forbidden. You may need to register for a free account.');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
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
            throw new Error('No data found for selected cryptocurrency');
        }
    } catch (error) {
        console.error('Fetch error:', error); // Debug log
        
        let errorMessage = '❌ Unable to fetch crypto price.';
        
        if (error.message.includes('Rate limit')) {
            errorMessage = '⏱️ Too many requests. Please wait 1-2 minutes and try again.';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            errorMessage = '🌐 Network error. Check your internet connection or try using a web server.';
        } else if (error.message.includes('CORS')) {
            errorMessage = '🔒 CORS error. Try running from a web server instead of opening the file directly.';
        } else if (error.message.includes('forbidden')) {
            errorMessage = '🚫 API access limited. Consider registering for a free CoinGecko account.';
        }
        
        resultDiv.innerHTML = `
            <div style="color: #e74c3c;">
                ${errorMessage}
                <br><small style="display: block; margin-top: 10px; opacity: 0.8;">
                    Error details: ${error.message}
                </small>
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