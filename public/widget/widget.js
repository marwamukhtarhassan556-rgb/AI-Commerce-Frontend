/**
 * AI-Commerce Widget Client Script
 * Handles widget UI interactions, message rendering, and API communication.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Parse Query Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const storeId = urlParams.get('storeId') || '';
  console.log('AI Widget initialized for Store ID:', storeId);

  // DOM Elements
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const closeBtn = document.getElementById('close-btn');

  // Close Button Handler - sends close message to the parent window
  closeBtn.addEventListener('click', () => {
    window.parent.postMessage({ type: 'WIDGET_CLOSE_REQUEST' }, '*');
  });

  // Form Submit Handler
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageText = chatInput.value.trim();
    if (!messageText) return;

    // 1. Add User Message to UI
    appendMessage(messageText, 'user');
    chatInput.value = '';
    
    // 2. Scroll to Bottom
    scrollToBottom();

    // 3. Show Typing Indicator and Fetch Response
    showTypingIndicator();
    
    // Simulate AI response (to be replaced with actual backend API call)
    setTimeout(async () => {
      removeTypingIndicator();
      try {
        const responseText = await fetchAIResponse(messageText, storeId);
        appendMessage(responseText, 'system');
      } catch (error) {
        console.error('Error fetching AI response:', error);
        appendMessage('Sorry, I encountered an issue. Please try again.', 'system');
      }
      scrollToBottom();
    }, 1500);
  });

  // Helper: Append Message to Container
  function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    const now = new Date();
    timeDiv.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    chatMessages.appendChild(messageDiv);
  }

  // Helper: Show Typing Indicator
  function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.id = 'typing-indicator';
    indicatorDiv.className = 'typing-indicator';
    indicatorDiv.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(indicatorDiv);
    scrollToBottom();
  }

  // Helper: Remove Typing Indicator
  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Helper: Scroll Chat to Bottom
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * API CALL PLACEHOLDER
   * Replace this mock function with the actual API call to the backend.
   */
  async function fetchAIResponse(userMessage, storeId) {
    // TODO: Implement actual API fetch request here:
    /*
    const response = await fetch('https://your-backend-api.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        storeId: storeId
      })
    });
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.reply;
    */

    // Mock Replies based on user input keywords
    const inputLower = userMessage.toLowerCase();
    if (inputLower.includes('shipping') || inputLower.includes('delivery')) {
      return 'We offer free worldwide shipping on orders above $50! Standard delivery takes 3-5 business days.';
    }
    if (inputLower.includes('price') || inputLower.includes('cost') || inputLower.includes('pricing')) {
      return 'You can view the prices of our products on the product pages. Let me know if you are looking for a specific item!';
    }
    if (inputLower.includes('hello') || inputLower.includes('hi') || inputLower.includes('hey')) {
      return 'Hello! How can I assist you with your shopping experience today?';
    }
    
    return `Thank you for your message! This is a mock response from the widget for message: "${userMessage}". Your store ID is ${storeId || 'not configured'}.`;
  }
});
