# GameVault – My Personal Game Library

GameVault is a small React web application where you can add and view your personal video game collection.
It was built as a beginner-friendly learning project, so the code is kept short and simple.

#Live Webpage: https://mygamelist-hazel.vercel.app/

## Features

- View all your games as cards on the home page
- See the total number of games in your library
- Add a new game using a simple form
- Click a game card to open its details page (three pages: Library, Add Game, Game Details)
- Games are saved in the browser (localStorage), so they stay after a page refresh
- Responsive dark navy and violet gaming design

## Technologies Used

- React + Vite (JavaScript / JSX)
- Tailwind CSS
- shadcn/ui (Button, Card, Input, Select, Textarea)
- React Router DOM
- React hooks: `useState`, `useEffect`, `useNavigate`
- Browser `localStorage`

## Installation

1. Install [Node.js](https://nodejs.org) (version 20 or newer).
2. Download or clone this project and open the folder in a terminal.
3. Install the packages:

   ```bash
   npm install
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open the address shown in the terminal (usually http://localhost:5173).

To create a production build, run `npm run build`.

## Project Structure

```
gamevault/
├── index.html
├── package.json
├── vite.config.js
├── jsconfig.json
├── components.json            (shadcn/ui settings)
├── public/favicon.svg
└── src/
    ├── main.jsx               (starts the app)
    ├── App.jsx                (games state, localStorage, routes + all 3 pages)
    ├── index.css              (Tailwind + theme colors)
    ├── lib/utils.js           (cn helper used by shadcn/ui)
    └── components/ui/         (shadcn/ui components)
        ├── button.jsx
        ├── card.jsx
        ├── input.jsx
        ├── select.jsx
        └── textarea.jsx
```

## About the shadcn/ui files

The files in `src/components/ui/` are shadcn/ui components. To regenerate the official versions yourself, run:

```bash
npx shadcn@latest add button card input select textarea
```
