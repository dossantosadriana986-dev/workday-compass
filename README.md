# AI Workplace Productivity Assistant

An AI-powered workplace productivity dashboard designed to help professionals organise tasks, summarise meetings, and get support with everyday work.

## Project Overview

The **AI Workplace Productivity Assistant** is a modern, responsive web application that brings useful AI productivity tools into one workspace. It provides tools for turning meeting notes into clear summaries and action items, planning daily or weekly work, and interacting with an AI assistant for workplace support.

The application is designed with a clean white-and-blue SaaS interface and a responsive layout for desktop, tablet, and mobile devices.

> **Note:** This project is designed to work without a custom backend. Tasks, notes, and preferences can be stored in the browser using `localStorage`. Genuine AI-generated responses require a configured AI model/API connection. Do not expose private API keys in client-side code.

## Features Implemented

- **Meeting Notes Summarizer**
  - Accepts pasted meeting notes.
  - Produces a structured meeting summary.
  - Extracts decisions, action items, responsibilities, and deadlines.
  - Supports reviewing and editing generated content.

- **AI Task Planner**
  - Helps organise tasks by priority and deadline.
  - Generates suggested daily or weekly schedules.
  - Makes it easier to identify high-priority work.

- **AI Workplace Chatbot**
  - Interactive assistant for workplace questions.
  - Helps draft professional emails and improve writing.
  - Supports brainstorming and everyday work-related problem solving.

- **Productivity Dashboard**
  - Central dashboard with quick access to the main tools.
  - Sidebar navigation.
  - Recent activity and productivity overview.

- **Usability and responsible AI**
  - Editable, copyable, and regenerable AI outputs where supported.
  - Responsive layouts and clear loading and empty states.
  - Responsible AI disclaimer reminding users to review AI-generated content.
  - Browser-based persistence for supported data.

## Technologies and Tools Used

Update this list to match the actual dependencies and services in your implementation.

- **Lovable** — AI-assisted application building.
- **React** — User interface library (if used by the generated project).
- **TypeScript** — Type-safe JavaScript (if enabled).
- **Tailwind CSS** — Styling and responsive layouts (if included).
- **Vite** — Development server and build tooling (if included).
- **Browser `localStorage`** — Local persistence without a custom backend.
- **AI model/API integration** — Required for genuine AI-generated summaries, plans, and chat responses; configure according to the provider you choose.
- **Git and GitHub** — Version control and project hosting.

## Setup Instructions

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/) (use the version supported by your project).
- npm (included with Node.js), or the package manager used by your project.
- Git (optional, for cloning and version control).

### 1. Clone the repository

Replace the placeholder URL with your GitHub repository URL.

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
```

### 2. Install dependencies

For an npm-based project:

```bash
npm install
```

### 3. Configure AI access (if applicable)

If the application uses an external AI provider:

1. Create an API key with your chosen provider.
2. Follow that provider's recommended integration method.
3. Store secrets securely; never commit API keys to GitHub or expose private keys in browser code.
4. If the provider requires a server-side secret, a frontend-only deployment cannot safely keep that secret private. Use a provider-supported secure client flow or add a server-side proxy if your requirements change.

If no AI provider is configured, the interface may load, but genuine AI generation will not be available. Do not treat sample or placeholder output as AI-generated.

### 4. Start the development server

For a typical Vite project:

```bash
npm run dev
```

Open the local URL printed in your terminal (commonly `http://localhost:5173`).

### 5. Create a production build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

> The commands above assume the generated project uses Vite and npm. Check `package.json` and follow the scripts and package manager defined by your actual project.

## Usage

1. Open the dashboard.
2. Choose **Meeting Summarizer** to paste meeting notes and review the generated summary and action items.
3. Choose **Task Planner** to enter tasks, priorities, and deadlines and generate a suggested schedule.
4. Open **AI Assistant** to ask workplace questions or request help drafting and improving content.
5. Edit, copy, or regenerate outputs where those controls are available.

## Data and Privacy

- Locally saved information may remain in the browser's `localStorage` on that device.
- Clearing browser data may remove locally stored information.
- Do not enter confidential workplace information unless your organisation permits it and you understand the AI provider's data-handling terms.
- Review AI-generated content for accuracy before relying on it.

## Responsible AI Disclaimer

AI-generated summaries, task plans, and chatbot responses may be incomplete or inaccurate. Users should verify important details, deadlines, decisions, and recommendations before sharing or acting on them. The application is an assistive productivity tool and does not replace professional judgement.

## Project Status

This README describes the intended application features and a typical Lovable-generated frontend setup. Confirm the actual implementation, dependencies, AI integration, and available controls before describing them as completed.

## Contributing

Contributions and suggestions are welcome:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Submit a pull request describing the changes.

## License

No license has been specified yet. Add a `LICENSE` file before granting others permission to reuse, modify, or distribute this project.

Github https://meetwise-momentum-maker.lovable.app/
