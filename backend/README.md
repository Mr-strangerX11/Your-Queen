# Your Queen Backend API

Express.js backend API for the Your Queen jewelry store.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration:
   - Database credentials
   - JWT secret
   - OAuth credentials
   - Payment gateway keys

4. Make sure PostgreSQL is running and create the database:
   ```sql
   CREATE DATABASE your_queen_db;
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` and the database tables will be created automatically.

## API Documentation

See the main README.md for API endpoint documentation.

## Database Schema

The application uses the following main tables:
- `users` - User accounts
- `products` - Product catalog
- `cart` - Shopping cart items
- `wishlist` - User wishlists
- `orders` - Order records
- `order_items` - Order line items
- `addresses` - User shipping addresses
- `reviews` - Product reviews

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Role-Based Access

- `customer` - Default user role
- `manager` - Can manage products and orders
- `admin` - Full access to all features

