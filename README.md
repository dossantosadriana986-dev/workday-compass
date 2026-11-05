# Workday Compass

Build a modern, responsive SaaS web app called **AI Workplace Productivity Assistant**.

**Purpose:** Help professionals improve productivity using AI-powered workplace tools.

**Core features:**
1. **Meeting Notes Summarizer:** Accept pasted meeting notes and generate structured summaries, key decisions, action items, assigned responsibilities, and deadlines.
2. **AI Task Planner:** Accept tasks, priorities, and deadlines. Generate practical daily or weekly schedules with prioritisation.
3. **AI Workplace Chatbot:** Provide an interactive AI assistant that answers workplace questions, drafts professional emails, improves writing, and helps solve work-related problems.

**UI/Design:**
- Modern, clean SaaS dashboard.
- White-to-light-blue gradient (ombre) colour scheme.
- Professional typography, subtle shadows, rounded cards and blue accents.
- Sidebar navigation: Dashboard, Meeting Summarizer, Task Planner, AI Assistant, Settings.
- Responsive layout for desktop, tablet and mobile.
- Dashboard with productivity statistics, recent activity and quick actions.

**Functionality:**
- All AI outputs must be specific, contextual and intelligently generated, not static generic responses.
- Use structured AI prompts for each feature.
- Allow users to edit, copy and regenerate AI-generated results.
- Include loading states and helpful empty states.
- Use localStorage for saving tasks, notes and preferences.
- No backend, database or authentication required.
- Use a frontend AI integration if available; keep API configuration separate and never hardcode API keys. If no AI connection is configured, provide a clear setup message rather than fake AI responses.

**Responsible AI:** Display a disclaimer explaining that AI-generated content may contain errors and should be reviewed before workplace decisions.

Build a polished, fully navigable application with working frontend interactions. Prioritise functionality, simplicity and a premium professional appearance.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/56e019d8-94c1-4601-bd8a-19b9d5b2459f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
