// JavaScript file: script.js

// Array of quote objects, each containing 'text' and 'category'
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Wisdom" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    // Select a random quote from the array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    // Display the selected quote in the 'quoteDisplay' div
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <em>${randomQuote.category}</em></p>`;
  }
  
  // Event listener for showing a new random quote
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Function to add a new quote
  function addQuote() {
    // Get the values from the input fields
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    // Check if both fields are filled
    if (newQuoteText && newQuoteCategory) {
      // Create a new quote object and add it to the quotes array
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
  
      // Clear the input fields after adding
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
  
      alert("New quote added successfully!");
    } else {
      alert("Please enter both the quote and the category.");
    }
  }
  