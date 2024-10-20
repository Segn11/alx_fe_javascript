// Array to store quotes
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
];

// Display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').innerText = `${quote.text} - ${quote.category}`;
}

// Add a new quote to the array and update the DOM
function addQuote(text, category) {
  quotes.push({ text, category });
  displayRandomQuote();
}

// Create a form for adding new quotes
function createAddQuoteForm() {
  const form = document.createElement('form');
  form.innerHTML = `
      <input type="text" id="newQuoteText" placeholder="Enter quote text" required>
      <input type="text" id="newQuoteCategory" placeholder="Enter quote category" required>
      <button type="submit">Add Quote</button>
  `;
  form.onsubmit = (e) => {
      e.preventDefault();
      const text = document.getElementById('newQuoteText').value;
      const category = document.getElementById('newQuoteCategory').value;
      addQuote(text, category);
      form.reset();
  };
  document.getElementById('addQuoteForm').appendChild(form);
}

// Populate the category dropdown with unique categories
function populateCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))];
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
}

// Filter quotes by selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      document.getElementById('quoteDisplay').innerText = `${filteredQuotes[randomIndex].text} - ${filteredQuotes[randomIndex].category}`;
  } else {
      document.getElementById('quoteDisplay').innerText = "No quotes available for the selected category.";
  }
}

// Export quotes to JSON
function exportQuotes() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Fetch quotes from a mock API using POST request
async function fetchQuotesFromServer() {
  try {
      const response = await fetch('https://example.com/quotes', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(quotes)
      });

      if (response.ok) {
          const serverQuotes = await response.json();
          quotes = [...quotes, ...serverQuotes];
          populateCategories();
          displayRandomQuote();
      } else {
          console.error('Failed to fetch quotes from the server');
      }
  } catch (error) {
      console.error('Error fetching quotes:', error);
  }
}

// Initial setup
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
createAddQuoteForm();
populateCategories();
displayRandomQuote();
