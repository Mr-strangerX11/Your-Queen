# Setup Guide - Your Queen Jewelry Store

## Quick Start

Follow these steps to get the application running on your local machine.

### Step 1: Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js) or **yarn**

### Step 2: Database Setup

1. Start PostgreSQL service
2. Open PostgreSQL command line or pgAdmin
3. Create a new database:
   ```sql
   CREATE DATABASE your_queen_db;
   ```
4. Note down your database credentials (host, port, username, password)

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

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_queen_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password

   # JWT Secret (generate a random string)
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
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

To create an admin user, you can either:

**Option 1: Using PostgreSQL directly**
```sql
INSERT INTO users (email, password, first_name, last_name, role)
VALUES (
  'admin@yourqueen.com',
  '$2a$10$YourHashedPasswordHere',  -- Use bcrypt to hash your password
  'Admin',
  'User',
  'admin'
);
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
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure the database exists

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: React will prompt to use a different port

### Module Not Found Errors
- Run `npm install` in both `backend` and `frontend` directories
- Delete `node_modules` and reinstall if issues persist

### CORS Errors
- Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Check that both servers are running

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

