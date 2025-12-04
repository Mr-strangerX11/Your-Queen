# Your Queen Frontend

React frontend application for the Your Queen jewelry store.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (optional):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will start on `http://localhost:3000`.

## Features

- Responsive design with TailwindCSS
- Smooth animations with Framer Motion
- Product browsing and filtering
- Shopping cart and checkout
- User authentication and dashboard
- Admin panel for product management
- Wishlist functionality
- Order tracking

## Project Structure

- `src/components/` - Reusable components
- `src/pages/` - Page components
- `src/context/` - React context providers
- `src/utils/` - Utility functions
- `public/` - Static assets

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

