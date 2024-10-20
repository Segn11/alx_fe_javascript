let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to dynamically create the form for adding a new quote
function createAddQuoteForm() {
    const formContainer = document.getElementById('quoteFormContainer');

    formContainer.innerHTML = `
        <input type="text" id="quoteText" placeholder="Enter quote" required />
        <input type="text" id="quoteAuthor" placeholder="Enter author" required />
        <input type="text" id="quoteCategory" placeholder="Enter category" required />
        <button id="addQuoteButton">Add Quote</button>
    `;

    document.getElementById('addQuoteButton').addEventListener('click', () => {
        const text = document.getElementById('quoteText').value.trim();
        const author = document.getElementById('quoteAuthor').value.trim();
        const category = document.getElementById('quoteCategory').value.trim();
        if (text && author && category) {
            addQuote(text, author, category);
            document.getElementById('quoteText').value = '';
            document.getElementById('quoteAuthor').value = '';
            document.getElementById('quoteCategory').value = '';
        } else {
            showNotification('Please fill in all fields to add a quote.');
        }
    });
}

// Function to add a new quote
function addQuote(text, author, category) {
    const newQuote = {
        id: Date.now(),
        text,
        author,
        category
    };
    quotes.push(newQuote);
    saveQuotes();
    displayQuotes(quotes);
    populateCategories();
    showNotification('New quote added successfully!');
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display quotes on the page
function displayQuotes(quotesToDisplay) {
    const quotesContainer = document.getElementById('quotesContainer');
    quotesContainer.innerHTML = '';

    quotesToDisplay.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.className = 'quote';
        quoteElement.innerHTML = `<p>${quote.text}</p><footer>— ${quote.author} (${quote.category})</footer>`;
        quotesContainer.appendChild(quoteElement);
    });
}

// Function to populate the category filter dynamically
function populateCategories() {
    const categories = ['all', ...new Set(quotes.map(q => q.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    displayQuotes(filteredQuotes);
    localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Restore last selected category from local storage on page load
function restoreLastSelectedCategory() {
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    document.getElementById('categoryFilter').value = lastSelectedCategory;
    filterQuotes();
}

// Function to show a random quote
function showNewQuote() {
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        displayQuotes([randomQuote]);
    } else {
        showNotification('No quotes available. Please add some quotes.');
    }
}

// Function to show a notification message
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Function to sync quotes with the server and handle conflicts
async function syncQuotes() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Mock API URL
        const serverQuotes = await response.json();

        // Here we're just simulating merging and resolving conflicts
        const mergedQuotes = [...serverQuotes, ...quotes];
        quotes = mergedQuotes.filter((quote, index, self) =>
            index === self.findIndex(q => q.id === quote.id)
        );

        saveQuotes();
        displayQuotes(quotes);
        showNotification('Quotes synced with the server!');
    } catch (error) {
        showNotification('Failed to sync with the server.');
    }
}

// Function to handle import and export of quotes as JSON
function exportToJsonFile() {
    const jsonData = JSON.stringify(quotes);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes = [...quotes, ...importedQuotes];
        saveQuotes();
        displayQuotes(quotes);
        populateCategories();
        showNotification('Quotes imported successfully!');
    };

    reader.readAsText(file);
}

// Initialize the application
window.onload = function() {
    createAddQuoteForm();
    displayQuotes(quotes);
    populateCategories();
    restoreLastSelectedCategory();

    document.getElementById('showNewQuoteButton').addEventListener('click', showNewQuote);
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
    document.getElementById('importQuotes').addEventListener('change', importFromJsonFile);

    // Periodically sync with the server every 60 seconds
    setInterval(syncQuotes, 60000);
};
