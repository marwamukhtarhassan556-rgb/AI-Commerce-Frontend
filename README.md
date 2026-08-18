# 🛍️ Navi AI Commerce — Front-End Application

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SignalR](https://img.shields.io/badge/SignalR-Realtime-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)

Navi AI Commerce is a state-of-the-art, AI-powered e-commerce sales agent and analytics platform. This front-end application provides intuitive, responsive web interfaces for both **E-Commerce Merchants** and **Platform SuperAdmins**.

---

## 🌟 Key Features

### 🏪 Merchant Portal (`/merchant`)
- **Dashboard Overview:** Real-time revenue charts, AI conversation metrics, ticket resolution rates, and SignalR live notifications.
- **Product Catalog & AI Recommendations:** Manage store inventory, max discounts, and view AI-suggested product bundles.
- **AI Knowledge Base:** Upload store policies, FAQs, and product manuals (PDF, DOCX, CSV, TXT) for RAG vector search.
- **Store OpenAPI Integration:** Upload OpenAPI schemas in **JSON** or **YAML** (`.yaml`, `.yml`) to automatically map endpoints with AI.
- **Storefront Widget Generator:** Automatic provisioning of widget keys and production script tags for React, Vue, Angular, or Vanilla JS storefronts.
- **Ticket Management:** View customer support tickets, AI sentiment analysis, and escalate/resolve issues seamlessly.
- **Subscription & Token Usage:** Monitor active plans, remaining AI tokens, and daily customer message limits.

### 🛡️ SuperAdmin Portal (`/admin`)
- **System KPIs & Analytics:** Platform-wide metrics, active stores, MRR, and platform distribution.
- **Merchant Management:** Monitor registered stores, view store details, and toggle merchant status (Active / Inactive / Suspended).
- **Subscription & Plan Builder:** Create, update, and manage subscription packages, pricing, and feature flags.
- **AI Diagnostics & Health:** Real-time monitoring of AI service status, LLM providers (OpenAI, Anthropic, OpenRouter), and token latency.
- **Bundle Tracking:** Track promo code copies, top bundles, and total discount impact.
- **Audit Logs:** Full security audit log viewer for platform and AI microservice events.

---

## 🏗️ Technology Stack

- **Core Framework:** React 19, Vite 8
- **Styling:** Tailwind CSS v4, Vanilla CSS Design System
- **Icons & UI:** Lucide React, Framer Motion
- **HTTP & API Client:** Axios with JWT auto-refresh interceptors & multi-backend fallbacks
- **Real-Time Communication:** `@microsoft/signalr`
- **Schema Parsers:** `yaml` (YAML & JSON OpenAPI specification parsing)
- **Deployment:** Vercel / Docker (Nginx static distribution)

---

## 📁 Project Structure

```
AI-Commerce-Frontend/
├── public/                  # Static assets & widget fallback files
├── src/
│   ├── api/                 # API clients (axiosConfig, integrationApi, authService, etc.)
│   ├── components/          # Reusable UI components
│   │   ├── merchant/        # Merchant-specific components (TopBar, Sidebar, WidgetAccessPanel, etc.)
│   │   ├── super-admin/     # SuperAdmin layout & UI cards
│   │   ├── ui/              # Generic buttons, modals, badges, states
│   │   └── storefront/      # Storefront widget previews
│   ├── hooks/               # Custom React hooks (useAuth, useSignalR, etc.)
│   ├── pages/               # Main application pages
│   │   ├── merchant/        # Merchant routes (Dashboard, Catalog, Tickets, Integrations, Profile, etc.)
│   │   └── super-admin/     # SuperAdmin routes (Overview, Merchants, Plans, Diagnostics, etc.)
│   ├── services/            # Admin & background service handlers
│   ├── utils/               # Helper utilities (error handlers, profile mappers, formatters)
│   ├── App.jsx              # Main React router & role guards
│   └── main.jsx             # Entry point
├── Dockerfile               # Production Docker container setup
├── nginx.conf               # Nginx reverse-proxy & routing config for SPA
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite configuration & proxy settings
```

---

## ⚙️ Environment Variables

Create a `.env` or `.env.local` file in the root directory:

```env
# Primary ASP.NET Backend API
VITE_API_BASE_URL=https://aisales123.runasp.net

# FastAPI AI Microservice URL
VITE_AI_SERVICE_URL=https://aicommerce-ai-service-production.up.railway.app/api/v1

# Optional Dev Token (Local Development Only)
VITE_AI_DEV_TOKEN=your_development_token_here
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18.x or higher
- **npm** v9.x or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArwaMostafa19/AI-Sales-Agent-Backend-.git
   cd Front-end/AI-Commerce-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

4. **Build for Production:**
   ```bash
   npm run build
   ```
   The compiled static files will be generated in the `dist/` directory.

---

## 🐳 Docker Support

To build and run the frontend using Docker & Nginx:

```bash
# Build the Docker image
docker build -t ai-commerce-frontend .

# Run the container on port 80
docker run -d -p 80:80 ai-commerce-frontend
```

---

## 🔒 Authentication & Authorization Flow

1. **User Login:** Authenticates against ASP.NET identity endpoints (`/api/auth/login`).
2. **Token Management:** JWT Access Tokens and Refresh Tokens are securely handled by Axios interceptors in `axiosConfig.js`.
3. **Role Guards:** `ProtectedMerchantRoute` and `ProtectedAdminRoute` ensure strict role separation between Merchants and SuperAdmins.

---

## 📄 License

This project is part of the ITI Graduation Project for AI Commerce Sales Agent System. All rights reserved.
