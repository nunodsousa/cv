# Nuno de Sousa - CV Portfolio

https://nunodsousa.github.io/cv/

A modern, interactive CV portfolio built with React, TypeScript, and Vite.

## Features

- 🎨 Modern, responsive design
- 💬 AI-powered chat interface
- ✨ Interactive animations with Framer Motion
- 📱 Mobile-friendly layout
- 🎯 Professional presentation of experience, education, and achievements

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key (optional, for AI chat feature)

3. Run the app:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## GitHub Pages Deployment

This project is configured for GitHub Pages deployment:

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"

2. **Set up the API key** (if using AI chat):
   - Go to Settings → Secrets and variables → Actions
   - Add a secret named `GEMINI_API_KEY` with your API key

3. **Deploy automatically**:
   - The site will automatically deploy on every push to the `main` branch
   - Or manually trigger via Actions → "Deploy to GitHub Pages" → Run workflow

The site will be available at: `https://nunodsousa.github.io/cv/`

## Technologies

- React 19
- TypeScript
- Vite
- Framer Motion
- Three.js
- Tailwind CSS
- Lucide React Icons
