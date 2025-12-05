# Setup Guide - Your Queen Jewelry Store

## Quick Start

Follow these steps to get the application running on your local machine.

### Step 1: Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use **MongoDB Atlas** for cloud hosting - [Sign up](https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js) or **yarn**

### Step 2: Database Setup

**For Local MongoDB:**
1. Install MongoDB from [here](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # Use MongoDB Compass or start the service from Services
   ```
3. MongoDB will create the database automatically

**For MongoDB Atlas (Cloud):**
1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with a password
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/your_queen_db`)
5. Save this string for the backend configuration

### Step 3: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   - Create a file named `.env` in the `backend` directory
   - Copy the following template and fill in your values:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/your_queen_db
   # For MongoDB Atlas, use:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your_queen_db?retryWrites=true&w=majority

   # JWT Secret (generate a random string)
   JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
   JWT_EXPIRE=7d

   # OAuth Configuration (Optional for now)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret

   # Payment Gateways (Optional for now)
   KHALTI_SECRET_KEY=your_khalti_secret_key
   ESEWA_MERCHANT_ID=your_esewa_merchant_id
   ESEWA_SECRET_KEY=your_esewa_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key

   # Email Configuration (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password

   # SMS Configuration (Optional)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number

   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   The server should start on `http://localhost:5000`
   The database tables will be created automatically on first run.

### Step 4: Frontend Setup

1. Open a new terminal window
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. (Optional) Create environment file:
   - Create a file named `.env` in the `frontend` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. Start the frontend development server:
   ```bash
   npm start
   ```

   The application should open automatically at `http://localhost:3000`

### Step 5: Create Admin User

To create an admin user, you can use the registration endpoint and then update the role in the database:

**Option 1: Using MongoDB directly**
```bash
mongosh  # or mongo for older versions

# Connect to your database
use your_queen_db

# Create an admin user (password should be bcrypt hashed)
db.users.insertOne({
  email: 'admin@yourqueen.com',
  password: '$2a$10$YourHashedPasswordHere',  // Use bcrypt to hash your password
  first_name: 'Admin',
  last_name: 'User',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Option 2: Register normally and update via backend**
1. Register a user through the frontend or API
2. Update the user role to admin using MongoDB:
```bash
db.users.updateOne(
  { email: 'admin@yourqueen.com' },
  { $set: { role: 'admin' } }
)
```

**Option 2: Using the API**
1. Register a regular user through the frontend
2. Update the user role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

### Step 6: Test the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account or login
3. Browse products, add to cart, and test the checkout flow
4. If you're an admin, access `/admin` to manage products and orders

## Troubleshooting

### Database Connection Issues
- Verify MongoDB is running (`mongo` or `mongosh` should connect)
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, verify your connection string and network access settings
- Ensure your MongoDB user has proper permissions

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: React will prompt to use a different port

### Module Not Found Errors
- Run `npm install` in both `backend` and `frontend` directories
- Delete `node_modules` and reinstall if issues persist

### CORS Errors
- Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Check that both servers are running

### MongoDB Connection Timeout
- Check that MongoDB service is running
- Verify firewall settings (for MongoDB Atlas)
- Ensure network access is allowed from your IP address (for MongoDB Atlas)

## Next Steps

- Add product images (update product records with image URLs)
- Configure payment gateways with real API keys
- Set up email notifications
- Deploy to production

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production` in backend `.env`
2. Build the frontend: `cd frontend && npm run build`
3. Use a process manager like PM2 for the backend
4. Set up a reverse proxy (nginx) to serve the frontend
5. Use environment variables for all sensitive data
6. Enable HTTPS
7. Set up proper database backups

## Support

For issues or questions, please refer to the main README.md or create an issue in the repository.

