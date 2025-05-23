// Select the input field where the user types their message
const messageInput = document.querySelector(".message-input");

// Select the chat body where messages are displayed
const chatBody = document.querySelector(".chat-body");

// Select the button used to send messages
const sendMessageButton = document.querySelector("#send-message");

// Select the button to toggle the chatbot visibility
const chatbotToggler = document.querySelector("#chatbot-toggler");

// Select the button to close the chatbot
const closeChatbot = document.querySelector("#close-chatbot");

// API key for accessing the generative language model
const API_KEY = "AIzaSyBuznjKFi6BJWynboLvmGv5Loqu9sPRdSc";

// API endpoint for generating chatbot responses
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Object to store user data, specifically the message
const userData = {
  message: null, // Placeholder for the user's message
};

// Store the initial height of the input field for dynamic resizing
const initialInputHeight = messageInput.scrollHeight;

// Function to create a message element dynamically
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div"); // Create a new div element
  div.classList.add("message", ...classes); // Add the specified classes
  div.innerHTML = content; // Set the inner HTML content
  return div; // Return the created element
};

// Function to generate a bot response using the API
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text"); // Select the message text element

  // Define the API request options
  const requestOptions = {
    method: "POST", // HTTP method
    headers: { "Content-Type": "application/json" }, // Set content type to JSON
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userData.message }], // Include the user's message in the request body
        },
      ],
    }),
  };

  try {
    // Send the request to the API and wait for the response
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json(); // Parse the response as JSON
    if (!response.ok) throw new Error(data.error.message); // Handle API errors

    // Extract and format the bot's response text
    const apiResponseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold formatting
      .trim(); // Trim whitespace
    messageElement.innerText = apiResponseText; // Display the bot's response
  } catch (error) {
    console.log(error); // Log the error to the console
    messageElement.innerText = error.message; // Display the error message
    messageElement.style.color = "#ff0000"; // Set the text color to red
  } finally {
    incomingMessageDiv.classList.remove("thinking"); // Remove the "thinking" class
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" }); // Scroll to the bottom of the chat
  }
};

// Function to handle outgoing user messages
const handleOutgoingMessage = (e) => {
  e.preventDefault(); // Prevent the default form submission behavior
  userData.message = messageInput.value.trim(); // Get and trim the user's message
  messageInput.value = ""; // Clear the input field
  messageInput.dispatchEvent(new Event("input")); // Trigger the input event for resizing

  // Create and display the user's message
  const messageContent = `<div class="message-text">${userData.message}</div>`;
  const outgoingMessageDiv = createMessageElement(
    messageContent,
    "user-message" // Add the "user-message" class
  );
  outgoingMessageDiv.querySelector(".message-text").textContent =
    userData.message; // Set the message text
  chatBody.appendChild(outgoingMessageDiv); // Append the message to the chat body
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" }); // Scroll to the bottom of the chat

  // Simulate a delay before displaying the bot's response
  setTimeout(() => {
    const messageContent = `<svg
            class="bot-avatar"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 1024 1024"
          >
            <path
              d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"
            ></path>
          </svg>
          <div class="message-text">
            <div class="thinking-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>`;
    const incomingMessageDiv = createMessageElement(
      messageContent,
      "bot-message", // Add the "bot-message" class
      "thinking" // Add the "thinking" class
    );
    chatBody.appendChild(incomingMessageDiv); // Append the bot's message to the chat body
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" }); // Scroll to the bottom of the chat
    generateBotResponse(incomingMessageDiv); // Generate the bot's response
  }, 600); // Delay of 600ms
};

// Add an event listener for the "keydown" event on the input field
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim(); // Get and trim the user's message
  if (
    e.key === "Enter" && // Check if the Enter key was pressed
    userMessage && // Ensure the message is not empty
    !e.shiftKey && // Ensure the Shift key is not pressed
    window.innerWidth > 768 // Check if the screen width is greater than 768px
  ) {
    handleOutgoingMessage(e); // Handle the outgoing message
  }
});

// Add an event listener for the "input" event to adjust the input field height dynamically
messageInput.addEventListener("input", () => {
  messageInput.style.height = `${initialInputHeight}px`; // Reset the height to the initial value
  messageInput.style.height = `${messageInput.scrollHeight}px`; // Adjust the height based on the content
  document.querySelector(".chat-form").style.borderRadius =
    messageInput.scrollHeight > initialInputHeight ? "15px" : "32px"; // Adjust the border radius
});

// Add an event listener for the "click" event on the send message button
sendMessageButton.addEventListener("click", (e) => {
  handleOutgoingMessage(e); // Handle the outgoing message
});

// Add an event listener for the "click" event on the chatbot toggler
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot") // Toggle the chatbot visibility
);

// Add an event listener for the "click" event on the close chatbot button
closeChatbot.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot") // Hide the chatbot
);