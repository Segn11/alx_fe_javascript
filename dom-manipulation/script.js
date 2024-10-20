let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let lastSelectedCategory = localStorage.getItem('lastCategory') || 'all';

document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    showRandomQuote();
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('addQuoteButton').addEventListener('click', addQuote);
    document.getElementById('exportButton').addEventListener('click', exportQuotes);
    
    // Set the last selected category
    document.getElementById('categoryFilter').value = lastSelectedCategory;
});

function showRandomQuote() {
    const filteredQuotes = quotes.filter(quote => lastSelectedCategory === 'all' || quote.category === lastSelectedCategory);
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    
    if (quote) {
        document.getElementById('quoteDisplay').textContent = `${quote.text} - ${quote.category}`;
    } else {
        document.getElementById('quoteDisplay').textContent = "No quotes available.";
    }
}

function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        
        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert("Please fill in both fields.");
    }
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function populateCategories() {
    const categorySet = new Set(quotes.map(quote => quote.category));
    const categorySelect = document.getElementById('categoryFilter');
    
    // Clear existing categories
    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    
    categorySet.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function filterQuotes() {
    lastSelectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastCategory', lastSelectedCategory);
    showRandomQuote();
}

function exportQuotes() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}
