# Your Queen Backend API

Express.js backend API for the Your Queen jewelry store using MongoDB.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based `env.template`:
   ```bash
   cp env.template .env
   ```

3. Update the `.env` file with your MongoDB configuration:
   - **For local MongoDB:**
     ```
     MONGODB_URI=mongodb://localhost:27017/your_queen_db
     ```
   - **For MongoDB Atlas (cloud):**
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your_queen_db?retryWrites=true&w=majority
     ```
   - JWT secret key
   - Other optional configurations (OAuth, payment gateways, etc.)

4. Make sure MongoDB is running:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` and MongoDB collections will be created automatically.

## API Documentation

See the main README.md for API endpoint documentation.

## Database Schema

The application uses MongoDB with the following main collections:
- `users` - User accounts
- `products` - Product catalog
- `carts` - Shopping cart items
- `wishlists` - User wishlists
- `orders` - Order records
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

