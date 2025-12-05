# Your Queen - Jewelry Store Platform

A full-stack jewelry e-commerce application built with **Express.js** backend and **React** frontend, featuring product management, shopping cart, user authentication, admin dashboard, and multiple payment gateway integrations.

## 🎯 Project Overview

Your Queen is a comprehensive jewelry store platform that enables users to browse products, manage wishlists, add items to cart, place orders, and track their purchases. The platform also includes an admin dashboard for managing products and orders.

### Key Features

- 🛍️ **Product Browsing** - Browse and filter jewelry products
- 🛒 **Shopping Cart** - Add/remove items and manage quantities
- 💌 **Wishlist** - Save favorite items for later
- 👤 **User Authentication** - Secure login and registration
- 📦 **Order Management** - Place orders and track status
- ⭐ **Reviews & Ratings** - Leave product reviews
- 🔐 **Admin Panel** - Manage products, orders, and users
- 💳 **Multiple Payment Methods** - Khalti, eSewa, Stripe integration
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Built with React and TailwindCSS

## 📋 Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** (comes with Node.js)

## 🚀 Quick Start

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Your-Queen
```

### Step 2: Database Setup

**Option 1: Local MongoDB**
1. Install MongoDB and start the service
2. MongoDB will create the database automatically when the app connects

**Option 2: MongoDB Atlas (Cloud)**
1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Use the connection string in your `.env` file

### Step 3: Backend Setup

Navigate to the backend directory and set up:

```bash
cd backend
npm install
```

Create a `.env` file based on `env.template` and configure your environment variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/your_queen_db
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your_queen_db?retryWrites=true&w=majority
```

Start the backend server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`

### Step 4: Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
Your-Queen/
├── backend/                    # Express.js API server
│   ├── config/                # Database and configuration
│   ├── middleware/            # Authentication and middleware
│   ├── models/                # Database models (User, Product, Order, etc.)
│   ├── routes/                # API routes
│   ├── server.js              # Entry point
│   ├── package.json
│   └── env.template           # Environment template
│
├── frontend/                   # React application
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable components (Navbar, Footer)
│   │   ├── pages/             # Page components
│   │   ├── context/           # React context (Authentication)
│   │   ├── utils/             # Utility functions (API calls)
│   │   ├── App.js             # Main App component
│   │   └── index.js           # Entry point
│   ├── package.json
│   ├── tailwind.config.js     # TailwindCSS configuration
│   └── postcss.config.js      # PostCSS configuration
│
├── SETUP.md                   # Detailed setup guide
├── package.json               # Root package configuration
└── README.md                  # This file
```

## 🗄️ Database Schema

The application uses MongoDB with the following main collections:

- **users** - User accounts and authentication
- **products** - Product catalog
- **carts** - Shopping cart items
- **wishlists** - User wishlists
- **orders** - Order records with embedded order items
- **addresses** - User shipping addresses
- **reviews** - Product reviews and ratings

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/reviews` - Get product reviews

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove` - Remove item from wishlist

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/users` - Manage users

## 🔧 Configuration

### Backend Configuration

All backend configuration is managed through environment variables in the `.env` file. See `env.template` for available options.

**Key Variables:**
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string (local or cloud)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time
- `FRONTEND_URL` - Frontend URL for CORS
- `KHALTI_SECRET_KEY` - Khalti payment gateway key
- `ESEWA_*` - eSewa payment gateway credentials
- `STRIPE_SECRET_KEY` - Stripe payment gateway key

### Frontend Configuration

Frontend uses environment variables for API configuration. Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints
- CORS configuration
- Input validation and sanitization
- Secure payment gateway integrations

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev    # Start development server with auto-reload
npm run build  # Build for production
npm start      # Start production server
```

### Frontend Development

```bash
cd frontend
npm start      # Start development server
npm run build  # Build for production
npm test       # Run tests
```

## 🚢 Deployment

Detailed deployment instructions are coming soon. For now, ensure:

1. All environment variables are properly configured
2. Database is set up on your hosting provider
3. Backend and frontend are deployed to appropriate services
4. CORS is configured correctly

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For support or questions, please open an issue on GitHub or contact the development team.

## 🔗 Related Documentation

- [Detailed Setup Guide](./SETUP.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

---

**Happy coding! 🎉**
