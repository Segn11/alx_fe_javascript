// script.js

// Initialize quotes array
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
  { text: "The only way to do great work is to love what you do.", category: "Work" },
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerHTML = `<p>${quotes[randomIndex].text}</p><p><em>${quotes[randomIndex].category}</em></p>`;
}

// Function to create a form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteButton">Add Quote</button>
  `;
  document.body.appendChild(formContainer);

  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      showRandomQuote();
      populateCategories(); // Update categories dropdown if it exists
      alert("Quote added successfully!");
  } else {
      alert("Please fill in both fields.");
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = JSON.parse(localStorage.getItem("quotes"));
  if (storedQuotes) {
      quotes = storedQuotes;
  }
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById("quoteDisplay");
  
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `<p>${quote.text}</p><p><em>${quote.category}</em></p>`).join('');
  localStorage.setItem("selectedCategory", selectedCategory);
}

// Load quotes and selected category on page load
window.onload = function() {
  loadQuotes();
  showRandomQuote();
  populateCategories();

  // Restore last selected category
  const lastCategory = localStorage.getItem("selectedCategory");
  if (lastCategory) {
      document.getElementById("categoryFilter").value = lastCategory;
      filterQuotes(); // Display filtered quotes based on the last selected category
  }

  createAddQuoteForm(); // Create the form for adding new quotes
};

// Simulate fetching quotes from a server (mock API)
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // Use mock API
  const data = await response.json();
  // Process the data as needed
}

// Sync quotes periodically (simulating server updates)
function syncQuotes() {
  setInterval(() => {
      fetchQuotesFromServer().then(fetchedQuotes => {
          // Merge fetched quotes with existing ones and handle conflicts
          console.log("Fetched quotes from server", fetchedQuotes);
      });
  }, 30000); // Check every 30 seconds
}

// Call sync function to start syncing
syncQuotes();

