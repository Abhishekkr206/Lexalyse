# Lexalyse - The Complete Legal AI Platform

Lexalyse provides AI-powered analysis of 750+ bareacts, 50 years of precedents, and intelligent drafting assistance.\*

Lexalyse is an innovative educational platform built for law students, legal researchers, and professionals. By leveraging large language models (Google Gemini API), Lexalyse transforms how users interact with dense legal texts.

## 🌟 Key Features

- **📖 Academic Section:** Simplified, plain-English analysis of over 750 Indian Bare Acts using AI-powered explanations.
- **⚖️ Precedent Repository:** A comprehensive and searchable collection of case summaries spanning 50 years of judicial decisions.
- **🏛️ District Court API Integration:** Look up specifics on District Court cases dynamically via real-time API queries.
- **📜 Legal Maxims & Doctrines:** Explore over 250 essential maxims and a complete database of legal doctrines with cases and applications.
- **🖋️ Argument Enhancer:** AI-assisted tool designed to improve, structure, and strengthen formal legal arguments.
- **📝 DraftDash:** An intelligent drafting assistant to generate petitions, applications, plaints, and written statements for various court levels.
- **📰 Live Legal News:** Stay up to date with automated feeds fetching the latest headlines from legal news portals.

## 🚀 Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4, CSS Modules
- **Animations:** Framer Motion, Spline 3D (for the Hero interactive robot)
- **Icons:** Lucide React
- **Notifications/Toasts:** Sonner
- **AI Integration:** Google GenAI SDK (`@google/genai`)

## 🛠️ Local Development & Setup

To run Lexalyse locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/Abhishekkr206/Lexalyse.git
cd Lexalyse
```

### 2. Install Dependencies

Make sure you have Node.js installed on your machine.

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory (where `package.json` is located) and add your Google Gemini API key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

_(Note: Lexalyse relies on the Gemini API for bare act simplicity, case summaries, drafting, and real-time research. To use those features locally, you need an active API key)._

### 4. Run the Development Server

```bash
npm run dev
```

By default, the Vite dev server will start at `http://localhost:3000`.
Lexalyse uses React Router, and the `LandingPage` will serve on `/` while the main legal intelligence application interface is hosted on `/app`.

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

The compiled assets will be placed in the `dist` directory. You can preview the production build locally using `npm run preview`.

## ⚠️ Disclaimer

Lexalyse is an **educational and research platform only**. The "Simplified Law" and "AI Assistant" features are for academic purposes and **do not constitute legal advice or an attorney-client relationship**. Always refer to official government Gazettes for the definitive text of Bare Acts. Lexalyse shall not be held liable for any legal consequences, losses, or damages arising from the use or interpretation of the content provided natively or recursively through AI.

## 🤝 Contributing

Contributions to Lexalyse are welcome! Feel free to open issues or submit pull requests.
