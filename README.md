# ComicCraft — AI Comic Story Creator

A beginner-friendly web app that turns a story idea into a panel-by-panel comic script using the Google Gemini API.

## Requirements
- Node.js 18 or newer (a current LTS release is recommended)
- Visual Studio Code
- A Gemini API key with access to the configured model

## Setup
1. Extract the ZIP and open the `ComicCraft` folder in VS Code.
2. Open Terminal → New Terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to a new file named `.env`.
5. Open `.env` and replace `your_gemini_api_key_here` with your own Gemini API key. Never share this file or upload it to GitHub.
6. Start the app:

   ```bash
   npm start
   ```

7. Open `http://localhost:3000` in your browser.
8. Enter a story idea, choose a genre and panel count, then select **Generate my comic**.

## Project files
- `server.js` — Express backend and Gemini API call
- `public/index.html` — page structure
- `public/style.css` — responsive comic-book design
- `public/script.js` — form interaction, rendering, and script download
- `.env.example` — environment variable template

## Notes
- This version generates a comic **script** with scenes, dialogue, and illustration prompts. It does not generate image files.
- The backend uses `gemini-2.5-flash`. If your account does not have access to that model, update the model name to one currently available to your API key.
- API availability and model names can change. Keep your API key private.
- If the server reports a missing key, verify `.env` is in the project root and restart `npm start`.
