# Quick Start Guide

Get Your Queen up and running in 5 minutes!

## Option 1: Docker (Easiest) 🐳

**Prerequisites:** Docker and Docker Compose installed

```bash
# Clone the repository
git clone https://github.com/Mr-strangerX11/Your-Queen.git
cd Your-Queen

# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

**Stop services:**
```bash
docker-compose down
```

---

## Option 2: Manual Setup

**Prerequisites:**
- Node.js 16+
- MongoDB 4.4+

### Step 1: Clone and Install

```bash
git clone https://github.com/Mr-strangerX11/Your-Queen.git
cd Your-Queen
npm run install-all
```

### Step 2: Start MongoDB

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
- Start MongoDB service from Services app

### Step 3: Configure Environment

```bash
cd backend
cp env.template .env
# Edit .env if needed (default values work for local development)
```

### Step 4: Start Application

```bash
# From project root
npm run dev
```

This starts:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

---

## First Steps

### 1. Create Admin User

**Using MongoDB Shell:**
```javascript
use your_queen_db
db.users.insertOne({
  email: 'admin@yourqueen.com',
  password: '$2a$10$...',  // Hash a password using bcrypt
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  createdAt: new Date()
})
```

**Or register via frontend and update role:**
```javascript
db.users.updateOne(
  { email: 'your@email.com' },
  { $set: { role: 'admin' } }
)
```

### 2. Access Admin Panel

Navigate to http://localhost:3000/admin

### 3. Add Products

Use the admin panel to add your first products!

---

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**MongoDB connection error:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `backend/.env`

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

---

## Next Steps

- 📖 Read the full [README.md](README.md)
- 🚀 Deploy your app: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🤝 Contribute: [CONTRIBUTING.md](CONTRIBUTING.md)
- 📝 Detailed setup: [SETUP.md](SETUP.md)

---

**Need help?** Create an issue on [GitHub](https://github.com/Mr-strangerX11/Your-Queen/issues)
