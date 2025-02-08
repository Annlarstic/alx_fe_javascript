let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

document.addEventListener("DOMContentLoaded", () => {
    loadQuotes(); // Load quotes from local storage on page load
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});

function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (!quoteDisplay) return;
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available. Please add some!";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${randomQuote.text} - <strong>(${randomQuote.category})</strong></p>`;
}

function addQuote() {
    const newQuoteTextElement = document.getElementById("newQuoteText");
    const newQuoteCategoryElement = document.getElementById("newQuoteCategory");
    
    if (!newQuoteTextElement || !newQuoteCategoryElement) return;
    
    const newQuoteText = newQuoteTextElement.value.trim();
    const newQuoteCategory = newQuoteCategoryElement.value.trim();
    
    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }
    
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save quotes to local storage when a new quote is added
    newQuoteTextElement.value = "";
    newQuoteCategoryElement.value = "";
    showRandomQuote();
}

function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
}

// ---------------------------- LocalStorage Logic -----------------------------

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Call loadQuotes when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    loadQuotes();
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});

// ---------------------------- JSON Export Function ---------------------------

function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ---------------------------- JSON Import Function ---------------------------

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}





// ---------------------------- Category Filter Logic --------------------------

// Populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    if (!categoryFilter) return;
    
    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Get unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Populate dropdown with categories
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem('categoryFilter', selectedCategory); // Save selected category filter
    
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (!quoteDisplay) return;
    
    const filteredQuotes = selectedCategory === "all"
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available in this category. Please add some!";
        return;
    }
    
    quoteDisplay.innerHTML = filteredQuotes.map(quote => `<p>${quote.text} - <strong>(${quote.category})</strong></p>`).join("");
}

// Ensure filter is applied on page load if saved in local storage
document.addEventListener("DOMContentLoaded", () => {
    const savedFilter = localStorage.getItem('categoryFilter');
    if (savedFilter) {
        document.getElementById("categoryFilter").value = savedFilter;
        filterQuotes();
    }
});









// Simulate fetching quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Replace with your server URL
        const serverQuotes = await response.json();
        return serverQuotes.map(quote => ({
            text: quote.title,
            category: 'Server'
        }));
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

// Simulate posting quotes to the server
async function postQuotesToServer(quotes) {
    try {
        await fetch('https://jsonplaceholder.typicode.com/posts', { // Replace with your server URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quotes)
        });
    } catch (error) {
        console.error('Error posting quotes to server:', error);
    }
}

// Sync local quotes with server quotes
async function syncQuotesWithServer() {
    const serverQuotes = await fetchQuotesFromServer();
    const mergedQuotes = mergeQuotes(quotes, serverQuotes);
    quotes = mergedQuotes;
    saveQuotes();
    populateCategories(); // Update categories in the dropdown
    filterQuotes(); // Apply filter after sync
    alert('Quotes synced with the server successfully!');
}

// Merge local quotes and server quotes, resolving conflicts
function mergeQuotes(localQuotes, serverQuotes) {
    // For simplicity, server's data takes precedence
    const merged = [...serverQuotes];
    localQuotes.forEach(localQuote => {
        if (!serverQuotes.some(serverQuote => serverQuote.text === localQuote.text)) {
            merged.push(localQuote);
        }
    });
    return merged;
}

// Periodically sync quotes with the server
setInterval(syncQuotesWithServer, 60000); // Sync every 60 seconds

document.addEventListener("DOMContentLoaded", () => {
    // Initial sync when the page loads
    syncQuotesWithServer();
});











function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000); 
}

async function syncQuotesWithServer() {
    const serverQuotes = await fetchQuotesFromServer();
    const mergedQuotes = mergeQuotes(quotes, serverQuotes);
    quotes = mergedQuotes;
    saveQuotes();
    populateCategories(); 
    filterQuotes(); 
    showNotification('Quotes synced with server!'); 
}
