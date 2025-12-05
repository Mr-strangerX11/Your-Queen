# Running Your Queen Jewelry Store

This document provides step-by-step instructions to get the application running on your local machine.

## ✅ Quick Start

The project is now set up and ready to run! Follow these steps:

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher) - ✅ Already installed (v20.19.6)
- **npm** (v7 or higher) - ✅ Already installed (10.8.2)
- **MongoDB** - Running via Docker container
- **Docker** - ✅ Already installed (v28.0.4)

### 2. MongoDB Setup

MongoDB is running in a Docker container. If you need to start it again:

```bash
# Start MongoDB container
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=your_queen_db mongo:7.0

# Check if MongoDB is running
docker ps | grep mongodb

# Stop MongoDB (if needed)
docker stop mongodb

# Start existing MongoDB container
docker start mongodb

# Remove MongoDB container (if needed)
docker rm -f mongodb
```

### 3. Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
# Install all dependencies (root, backend, and frontend)
npm run install-all

# Or install individually
npm install                    # Root dependencies
cd backend && npm install      # Backend dependencies
cd frontend && npm install     # Frontend dependencies
```

### 4. Environment Configuration

The backend `.env` file has been created at `backend/.env` with default values. 

**Important:** For production use, update the following values:
- `JWT_SECRET` - Use a strong, unique secret key
- OAuth credentials (Google, Facebook) - If you want social login
- Payment gateway keys (Khalti, eSewa, Stripe) - For payment processing
- Email configuration - For sending emails
- SMS configuration (Twilio) - For SMS notifications

### 5. Start the Application

#### Option A: Start Both Servers Together (Recommended)

```bash
# From the root directory
npm run dev
```

This will start both the backend and frontend servers concurrently.

#### Option B: Start Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## 🎯 Current Status

✅ **Backend Server:** Running on port 5000  
✅ **Frontend Server:** Running on port 3000  
✅ **MongoDB:** Running in Docker container on port 27017  
✅ **API Health:** Responding correctly  

## 📝 Available Scripts

### Root Directory
- `npm run dev` - Start both backend and frontend servers
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend server
- `npm run install-all` - Install all dependencies

### Backend Directory
- `npm start` - Start backend in production mode
- `npm run dev` - Start backend in development mode with nodemon

### Frontend Directory
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests

## 🔍 Testing the Application

1. **Register a new user:**
   - Navigate to http://localhost:3000
   - Click on "Register" or "Sign Up"
   - Fill in the registration form

2. **Browse products:**
   - View the home page
   - Navigate to the products page
   - Search and filter products

3. **Add items to cart:**
   - Click on a product
   - Add to cart
   - View and manage cart

4. **Access admin features:**
   - First, register a user
   - Update user role to 'admin' in MongoDB:
     ```bash
     docker exec -it mongodb mongosh
     use your_queen_db
     db.users.updateOne({email: "your@email.com"}, {$set: {role: "admin"}})
     ```
   - Access admin dashboard at http://localhost:3000/admin

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB container is running
docker ps | grep mongodb

# View MongoDB logs
docker logs mongodb

# Restart MongoDB
docker restart mongodb
```

### Port Already in Use
```bash
# Check what's using port 5000
lsof -i :5000

# Check what's using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

### Backend Not Starting
- Check MongoDB is running: `docker ps | grep mongodb`
- Verify `.env` file exists in backend directory
- Check backend logs for specific errors

### Frontend Not Starting
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for port conflicts

### Module Not Found Errors
```bash
# Reinstall dependencies
npm run install-all

# Or for specific directory
cd backend && npm install
cd frontend && npm install
```

## 📦 Database

The MongoDB database is automatically initialized when the backend server starts. Collections are created on-demand when data is first inserted.

### Available Collections:
- `users` - User accounts and profiles
- `products` - Product catalog
- `orders` - Customer orders
- `carts` - Shopping carts
- `wishlists` - User wishlists
- `addresses` - Shipping addresses
- `reviews` - Product reviews

## 🔐 Security Notes

- The `.env` file is included in `.gitignore` and will not be committed
- Default JWT secret is for development only - change in production
- OAuth and payment credentials need to be configured for those features to work
- Always use HTTPS in production
- Implement rate limiting and input validation

## 🚀 Next Steps

1. **Add Sample Data:** Populate the database with sample products
2. **Configure Payments:** Add real payment gateway credentials
3. **Set Up OAuth:** Configure Google and Facebook login
4. **Customize Branding:** Update colors, logos, and content
5. **Deploy:** Choose a hosting platform (Heroku, AWS, DigitalOcean, etc.)

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)

---

**Note:** The application is now fully running and ready for development! 🎉
