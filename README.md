
# Infinite Canvas with Shape Tools

This project is a React application that provides an infinite canvas where users can add and manipulate shapes. The application is built using React, TypeScript, Vite, and Konva.js.

## Features

- **Infinite Canvas**:
  - Canvas can be panned infinitely in any direction.
  - Canvas background can be changed using predefined patterns.
- **Shape Tools**:
  - Users can add different shapes (rectangle, circle, line, ellipse, text, arrow, star, polygon) to the canvas.
  - Shapes can be selected, dragged, and transformed (resized, rotated).
  - Shapes maintain z-index order on interaction.
- **Toolbar**:
  - The toolbar can be dragged to any position on the screen.
  - Contains tools to add shapes, select tools, undo/redo actions, and change canvas background patterns.
- **Responsive Design**:
  - The application adapts to different screen sizes and resolutions.

## Technologies Used

- React
- TypeScript
- Vite
- Konva.js
- SCSS

<img src="https://skillicons.dev/icons?i=react,ts,vite,sass" />

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/eugenepokalyuk/react-crafttech.git
   cd react-crafttech
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open the application**:

   Open your browser and navigate to `http://localhost:5173`.

## Project Structure

```
src/
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
│       ├── add.svg
│       ├── select.svg
│       ├── undo.svg
│       └── redo.svg
├── components/
│   ├── App/
│   │   └── App.tsx
│   ├── Canvas/
│   │   ├── Canvas.tsx
│   │   └── Canvas.scss
│   ├── Toolbar/
│   │   ├── Toolbar.tsx
│   │   └── Toolbar.scss
└── main.tsx
```

### Explanation of Key Files

- **`src/components/Canvas/Canvas.tsx`**: The main canvas component where shapes are added and manipulated.
- **`src/components/Toolbar/Toolbar.tsx`**: The toolbar component that provides tools for interacting with the canvas.
- **`src/main.tsx`**: Entry point for the React application.

## Comments

- The application uses Konva.js for rendering and manipulating shapes on the canvas.
- The toolbar is draggable and allows users to perform various actions such as adding shapes, selecting tools, and changing the canvas background.
- The application ensures a smooth user experience with real-time updates and error handling.

## Deployment

To build the application for production, run:

```bash
npm run build
```

The built files will be in the `dist` directory, which can be deployed to any static hosting service.