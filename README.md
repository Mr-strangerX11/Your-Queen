# Your Queen - Premium Online Jewelry Store

A sophisticated full-stack e-commerce application for a premium jewelry store offering high-quality earrings, necklaces, and jewelry sets for modern women.

## Features

### Customer Features
- **Product Showcase**: Browse products with high-resolution images, filters, and search
- **Shopping Cart**: Add, update, and manage cart items
- **Checkout**: Secure checkout with multiple payment options (Khalti, eSewa, Card)
- **User Authentication**: Sign up/login with email, Google, or Facebook
- **User Dashboard**: View orders, manage wishlist, and profile
- **Wishlist**: Save favorite products for later
- **Order Tracking**: Track order status and history
- **Responsive Design**: Mobile-first, fully responsive design

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order statuses
- **Dashboard Analytics**: View sales statistics and reports
- **Inventory Management**: Track stock levels and low stock alerts

## Technology Stack

### Frontend
- **React 18** - UI library
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Passport** - OAuth authentication

## Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up the database**
   - Create a PostgreSQL database named `your_queen_db`
   - Update database credentials in `backend/.env`

4. **Configure environment variables**
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in all required environment variables:
     - Database credentials
     - JWT secret
     - OAuth credentials (Google, Facebook)
     - Payment gateway keys (Khalti, eSewa, Stripe)
     - Email and SMS configuration

5. **Initialize the database**
   - The database tables will be created automatically when you start the server
   - Or run the initialization script manually

6. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the backend (port 5000) and frontend (port 3000) servers.

   Or start them separately:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend (in a new terminal)
   cd frontend
   npm start
   ```

## Project Structure

```
online/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── products.js           # Product routes
│   │   ├── cart.js               # Cart routes
│   │   ├── orders.js             # Order routes
│   │   ├── users.js              # User routes
│   │   ├── wishlist.js           # Wishlist routes
│   │   ├── admin.js              # Admin routes
│   │   └── payments.js           # Payment routes
│   └── server.js                 # Express server
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Navbar.js
│   │   │       └── Footer.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Products.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Orders.js
│   │   │   ├── Wishlist.js
│   │   │   ├── Profile.js
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.js
│   │   │       ├── AdminProducts.js
│   │   │       └── AdminOrders.js
│   │   ├── context/
│   │   │   └── AuthContext.js    # Authentication context
│   │   ├── utils/
│   │   │   └── api.js             # API utility
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/social-login` - Social login (Google/Facebook)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/list` - Get all categories
- `GET /api/products/filters/options` - Get filter options

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## Payment Integration

The application supports multiple payment gateways:
- **Khalti** - Popular payment gateway in Nepal
- **eSewa** - Digital wallet in Nepal
- **Card Payments** - Stripe integration for card payments

Note: Payment integrations are set up with mock implementations. In production, you'll need to:
1. Obtain API keys from respective payment providers
2. Update the payment routes with actual SDK implementations
3. Configure webhooks for payment verification

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_queen_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Payments
KHALTI_SECRET_KEY=your_khalti_secret_key
ESEWA_MERCHANT_ID=your_esewa_merchant_id
STRIPE_SECRET_KEY=your_stripe_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Future Enhancements

- [ ] Mobile app using React Native/Expo
- [ ] AI-powered product recommendations
- [ ] Live chat support
- [ ] Email and SMS notifications
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Seasonal theme customization
- [ ] Product reviews and ratings
- [ ] Social media integration
- [ ] SEO optimization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@yourqueen.com or create an issue in the repository.

---

Built with ❤️ for modern women who love elegant jewelry.

