# Your Queen - Premium Online Jewelry Store

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)

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
- **MongoDB** - NoSQL Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Passport** - OAuth authentication

## Installation

For detailed setup instructions, see [SETUP.md](SETUP.md) or follow the [Quick Start Guide](QUICKSTART.md).

### Quick Start with Docker 🐳

```bash
git clone https://github.com/Mr-strangerX11/Your-Queen.git
cd Your-Queen
docker-compose up -d
```

Access at http://localhost:3000

### Manual Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
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
   - Install and start MongoDB service
   - Update database connection URI in `backend/.env`

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
Your-Queen/
├── backend/                    # Node.js/Express backend
│   ├── config/
│   │   └── database.js        # MongoDB configuration
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   ├── wishlist.js
│   │   ├── admin.js
│   │   └── payments.js
│   ├── uploads/               # User uploaded files
│   ├── env.template           # Environment variables template
│   └── server.js              # Express server entry point
├── frontend/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   └── layout/
│   │   │       ├── Navbar.js
│   │   │       └── Footer.js
│   │   ├── pages/             # Page components
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
│   │   │   └── AuthContext.js # Authentication context
│   │   ├── utils/
│   │   │   └── api.js         # API utility
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .github/
│   └── workflows/             # GitHub Actions
│       └── release.yml        # Automated releases
├── Dockerfile                 # Production Docker image
├── docker-compose.yml         # Development setup
├── docker-compose.prod.yml    # Production setup
├── DEPLOYMENT.md              # Deployment guide
├── CONTRIBUTING.md            # Contribution guidelines
├── QUICKSTART.md              # Quick start guide
├── LICENSE                    # MIT License
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

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Setup Guide](SETUP.md)** - Detailed setup instructions
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to various platforms
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Publishing Checklist](PUBLISHING_CHECKLIST.md)** - Pre-deployment checklist
- **[NPM Publishing](NPM_PUBLISHING.md)** - Publishing components to NPM
- **[Changelog](CHANGELOG.md)** - Version history

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
MONGODB_URI=mongodb://localhost:27017/your_queen_db

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

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deploy Options:

**Docker (Recommended)**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Heroku**
```bash
heroku create your-queen-app
git push heroku main
```

**Vercel (Frontend) + MongoDB Atlas**
- Deploy frontend to Vercel
- Backend to Railway/Render
- Database on MongoDB Atlas

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete guides on deploying to various platforms.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on:
- How to set up the development environment
- Coding standards
- Pull request process
- Code of conduct

### Quick Start for Contributors

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@yourqueen.com or create an issue in the repository.

---

Built with ❤️ for modern women who love elegant jewelry.

