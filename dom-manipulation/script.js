// JavaScript file: script.js

// Mock API URL (using JSONPlaceholder as an example).
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Initialize the quotes array with data from local storage or default values.
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to save quotes to local storage.
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to fetch quotes from the server.
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();
    
    // Assume serverQuotes contains an array of quotes.
    mergeServerQuotes(serverQuotes);
  } catch (error) {
    console.error('Error fetching quotes from the server:', error);
  }
}

// Function to merge server quotes into local storage and resolve conflicts.
function mergeServerQuotes(serverQuotes) {
  // Convert server data into the expected format.
  const formattedServerQuotes = serverQuotes.map(serverQuote => ({
    text: serverQuote.body,
    category: 'Server' // Default category for simplicity.
  }));

  // Merge server quotes with local quotes, prioritizing server data.
  const mergedQuotes = [...formattedServerQuotes, ...quotes];
  
  // Remove duplicates (based on text).
  const uniqueQuotes = Array.from(new Set(mergedQuotes.map(q => q.text)))
    .map(text => mergedQuotes.find(q => q.text === text));

  // Update local quotes and save them.
  quotes = uniqueQuotes;
  saveQuotes();
  populateCategories();
  alert('Data has been synchronized with the server.');
}

// Function to post new quotes to the server.
async function postQuoteToServer(newQuote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      body: JSON.stringify({
        title: newQuote.text,
        body: newQuote.text,
        userId: 1
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    if (response.ok) {
      alert('Quote successfully posted to the server.');
    } else {
      alert('Failed to post quote to the server.');
    }
  } catch (error) {
    console.error('Error posting quote to the server:', error);
  }
}

// Function to display a random quote.
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <em>${randomQuote.category}</em></p>`;

  // Store the last viewed quote in session storage (optional).
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Function to add a new quote.
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    postQuoteToServer(newQuote); // Post the new quote to the server.

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added successfully!");
  } else {
    alert("Please enter both the quote and the category.");
  }
}

// Function to populate categories in the dropdown.
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes();
  }
}

// Function to filter quotes based on the selected category.
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `<p>"${randomQuote.text}" - <em>${randomQuote.category}</em></p>`;
  } else {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes available for this category.</p>";
  }

  localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Sync with server every 5 minutes (300,000 milliseconds).
setInterval(fetchQuotesFromServer, 300000);

// Load the last viewed quote from session storage (optional).
window.onload = function() {
  const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if (lastViewedQuote) {
    document.getElementById("quoteDisplay").innerHTML = `<p>"${lastViewedQuote.text}" - <em>${lastViewedQuote.category}</em></p>`;
  }

  populateCategories();
  fetchQuotesFromServer(); // Fetch quotes when the page loads.
};
