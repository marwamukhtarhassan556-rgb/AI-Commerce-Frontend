/**
 * AI-Commerce Widget Embed Script
 * This script is included in client websites to load the chat/diagnostic widget.
 * Example embed code:
 * <script src="http://localhost:5173/widget/embed.js" data-store-id="YOUR_STORE_ID"></script>
 */

(function () {
  // Prevent duplicate initialization
  if (window.AiCommerceWidgetLoaded) return;
  window.AiCommerceWidgetLoaded = true;

  // Retrieve configuration from the script tag
  const scriptTag = document.currentScript;
  const storeId = scriptTag ? scriptTag.getAttribute('data-store-id') : null;
  
  // Define URLs
  const baseUrl = scriptTag ? new URL(scriptTag.src).origin : window.location.origin;
  const widgetUrl = `${baseUrl}/widget/widget.html?storeId=${encodeURIComponent(storeId || '')}`;

  // Create Styles for the Widget Launcher and Container on the Host Page
  const style = document.createElement('style');
  style.innerHTML = `
    .ai-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .ai-widget-iframe {
      border: none;
      width: 380px;
      height: 600px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      background: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: bottom right;
      opacity: 0;
      transform: scale(0.8) translateY(20px);
      pointer-events: none;
      display: block;
    }
    .ai-widget-iframe.open {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: auto;
    }
    .ai-widget-launcher {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #4f46e5;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      border: none;
      outline: none;
    }
    .ai-widget-launcher:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
    }
    .ai-widget-launcher svg {
      width: 28px;
      height: 28px;
      fill: white;
      transition: transform 0.3s ease;
    }
    .ai-widget-launcher.open svg {
      transform: rotate(90deg);
    }
  `;
  document.head.appendChild(style);

  // Create Container
  const container = document.createElement('div');
  container.className = 'ai-widget-container';

  // Create Iframe (hidden by default)
  const iframe = document.createElement('iframe');
  iframe.className = 'ai-widget-iframe';
  iframe.src = widgetUrl;
  iframe.title = 'AI Assistant';
  iframe.style.marginBottom = '75px'; // Leave space for launcher button
  container.appendChild(iframe);

  // Create Launcher Button
  const launcher = document.createElement('button');
  launcher.className = 'ai-widget-launcher';
  launcher.setAttribute('aria-label', 'Open AI Assistant');
  launcher.innerHTML = `
    <svg viewBox="0 0 24 24" id="ai-icon-open">
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
    </svg>
  `;
  container.appendChild(launcher);

  // Append Container to Body
  document.body.appendChild(container);

  // Toggle Widget State
  let isOpen = false;
  launcher.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.classList.add('open');
      launcher.classList.add('open');
      launcher.innerHTML = `
        <svg viewBox="0 0 24 24" id="ai-icon-close">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      `;
      // Optionally notify the iframe that it has been opened
      iframe.contentWindow.postMessage({ type: 'WIDGET_OPENED' }, '*');
    } else {
      iframe.classList.remove('open');
      launcher.classList.remove('open');
      launcher.innerHTML = `
        <svg viewBox="0 0 24 24" id="ai-icon-open">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
        </svg>
      `;
    }
  });

  // Handle messages from the iframe (e.g. close widget request)
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'WIDGET_CLOSE_REQUEST') {
      isOpen = false;
      iframe.classList.remove('open');
      launcher.classList.remove('open');
      launcher.innerHTML = `
        <svg viewBox="0 0 24 24" id="ai-icon-open">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
        </svg>
      `;
    }
  });
})();
