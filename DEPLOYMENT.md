# Deployment Guide - Your Queen Jewelry Store

This guide covers various deployment options for the Your Queen application.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Docker Deployment](#docker-deployment)
- [Platform-Specific Deployments](#platform-specific-deployments)
  - [Vercel + MongoDB Atlas](#vercel--mongodb-atlas)
  - [Heroku](#heroku)
  - [Railway](#railway)
  - [Render](#render)
  - [DigitalOcean App Platform](#digitalocean-app-platform)
- [Manual Deployment](#manual-deployment)

---

## Prerequisites

Before deploying, ensure you have:

1. **MongoDB Database**: Either:
   - MongoDB Atlas (cloud) - [Sign up free](https://www.mongodb.com/cloud/atlas)
   - Self-hosted MongoDB server
   - Docker container with MongoDB

2. **Environment Variables**: All required secrets and API keys

3. **Domain Name** (optional but recommended for production)

---

## Docker Deployment

The easiest way to deploy Your Queen is using Docker.

### Development Environment

```bash
# Clone the repository
git clone https://github.com/Mr-strangerX11/Your-Queen.git
cd Your-Queen

# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Production Environment

```bash
# Create .env file from template
cp .env.example .env

# Edit .env with your production values
nano .env

# Build and start production services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

Access the application at http://localhost:5000 (frontend is served by backend in production).

---

## Platform-Specific Deployments

### Vercel + MongoDB Atlas

**Best for**: Quick deployment of frontend with serverless backend

#### Steps:

1. **Set up MongoDB Atlas**
   - Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/your_queen_db`

2. **Deploy Backend** (Choose one option):
   
   **Option A: Deploy to Vercel Serverless**
   - Create `api/` directory in backend for serverless functions
   - Configure `vercel.json` for serverless deployment
   
   **Option B: Deploy Backend to Railway/Render**
   - See Railway or Render sections below for backend deployment
   - Note the backend URL (e.g., `https://your-backend.railway.app`)

3. **Deploy Frontend to Vercel**
   ```bash
   cd frontend
   npm install -g vercel
   vercel login
   vercel
   ```
   
   Set environment variables in Vercel:
   - `REACT_APP_API_URL`: Your backend URL

4. **Configure Environment**
   - Add all environment variables in Vercel dashboard
   - Set `FRONTEND_URL` in backend to your Vercel frontend URL

---

### Heroku

**Best for**: Full-stack deployment with free tier

#### Prerequisites:
- Heroku account
- Heroku CLI installed

#### Steps:

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku App**
   ```bash
   heroku login
   heroku create your-queen-app
   ```

3. **Add MongoDB**
   ```bash
   # Option 1: Use MongoDB Atlas
   # Set MONGODB_URI config var with your Atlas connection string
   heroku config:set MONGODB_URI="mongodb+srv://..."
   
   # Option 2: Use mLab MongoDB addon (paid)
   heroku addons:create mongolab:sandbox
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set FRONTEND_URL="https://your-queen-app.herokuapp.com"
   # Add other variables as needed
   ```

5. **Create Procfile**
   ```
   web: cd backend && npm start
   ```

6. **Deploy**
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   git push heroku main
   ```

7. **Open App**
   ```bash
   heroku open
   ```

---

### Railway

**Best for**: Easy deployment with free tier and great developer experience

#### Steps:

1. **Install Railway CLI** (optional)
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Deploy via Railway Dashboard**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your forked repository

3. **Add MongoDB**
   - Click "New" → "Database" → "Add MongoDB"
   - Railway will automatically set `MONGO_URL` variable

4. **Configure Environment Variables**
   - Go to your service → "Variables"
   - Add all required variables:
     ```
     NODE_ENV=production
     MONGODB_URI=${{MONGO_URL}}/your_queen_db
     JWT_SECRET=your-secret-key
     FRONTEND_URL=${{RAILWAY_STATIC_URL}}
     PORT=5000
     ```

5. **Deploy**
   - Railway auto-deploys on every push to main branch
   - Or use CLI: `railway up`

6. **Custom Domain** (optional)
   - Go to "Settings" → "Domains"
   - Add your custom domain

---

### Render

**Best for**: Similar to Heroku with better pricing

#### Steps:

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   ```
   Name: your-queen-backend
   Environment: Node
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```

3. **Add MongoDB**
   - In Render dashboard, create a MongoDB instance
   - Or use MongoDB Atlas and set connection string

4. **Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret>
   FRONTEND_URL=https://your-queen-app.onrender.com
   PORT=5000
   ```

5. **Deploy Frontend**
   - Create another service for frontend:
   ```
   Name: your-queen-frontend
   Environment: Static Site
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/build
   ```

6. **Update API URL**
   - Set `REACT_APP_API_URL` in frontend service to backend URL

---

### DigitalOcean App Platform

**Best for**: Full control with managed infrastructure

#### Steps:

1. **Create App**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect GitHub repository

2. **Configure Components**
   
   **Backend Service:**
   ```
   Name: backend
   Source Directory: /backend
   Build Command: npm install
   Run Command: npm start
   HTTP Port: 5000
   ```

   **Frontend Service:**
   ```
   Name: frontend
   Source Directory: /frontend
   Build Command: npm install && npm run build
   Output Directory: build
   ```

3. **Add Database**
   - Add a managed MongoDB database cluster
   - Or use MongoDB Atlas connection string

4. **Environment Variables**
   - Add all required environment variables in App Platform settings

5. **Deploy**
   - Click "Create Resources"
   - App Platform will build and deploy automatically

---

## Manual Deployment (VPS)

**Best for**: Maximum control and customization

### Requirements:
- Ubuntu/Debian VPS (AWS EC2, DigitalOcean Droplet, etc.)
- Root or sudo access

### Steps:

1. **SSH into your server**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   apt update
   apt install -y mongodb-org
   systemctl start mongod
   systemctl enable mongod
   
   # Install PM2
   npm install -g pm2
   
   # Install Nginx
   apt install -y nginx
   ```

3. **Clone and Setup Application**
   ```bash
   cd /var/www
   git clone https://github.com/Mr-strangerX11/Your-Queen.git
   cd Your-Queen
   npm run install-all
   ```

4. **Configure Environment**
   ```bash
   cd backend
   cp env.template .env
   nano .env
   # Update values
   ```

5. **Build Frontend**
   ```bash
   cd ../frontend
   npm run build
   ```

6. **Start Backend with PM2**
   ```bash
   cd ../backend
   pm2 start server.js --name your-queen-backend
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   ```bash
   nano /etc/nginx/sites-available/your-queen
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Serve frontend
       location / {
           root /var/www/Your-Queen/frontend/build;
           try_files $uri $uri/ /index.html;
       }
       
       # Proxy API requests
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Serve uploads
       location /uploads {
           proxy_pass http://localhost:5000;
       }
   }
   ```
   
   Enable site:
   ```bash
   ln -s /etc/nginx/sites-available/your-queen /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

8. **Setup SSL (optional but recommended)**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d your-domain.com
   ```

9. **Configure Firewall**
   ```bash
   ufw allow 'Nginx Full'
   ufw allow OpenSSH
   ufw enable
   ```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] Application is accessible via URL
- [ ] Database connection is working
- [ ] User registration and login works
- [ ] Product browsing works
- [ ] Cart functionality works
- [ ] Payment integration is configured (if using)
- [ ] Admin panel is accessible
- [ ] SSL certificate is installed (for production)
- [ ] Environment variables are set correctly
- [ ] Logs are being captured
- [ ] Backups are configured

---

## Monitoring and Maintenance

### Logs
- **Heroku**: `heroku logs --tail`
- **Railway**: View in dashboard or `railway logs`
- **Render**: View in dashboard
- **PM2**: `pm2 logs your-queen-backend`
- **Docker**: `docker-compose logs -f`

### Backups
- Set up regular MongoDB backups
- Use MongoDB Atlas automated backups (recommended)
- Or use `mongodump` for manual backups

### Updates
```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm run install-all

# Rebuild frontend
cd frontend && npm run build

# Restart backend
pm2 restart your-queen-backend
```

---

## Troubleshooting

### Common Issues

1. **Database connection fails**
   - Verify MONGODB_URI is correct
   - Check if MongoDB is running
   - Verify network access (whitelist IP in MongoDB Atlas)

2. **CORS errors**
   - Ensure FRONTEND_URL is set correctly in backend
   - Check CORS configuration in backend/server.js

3. **Build fails**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version` (should be v16+)

4. **App crashes on startup**
   - Check logs for specific error
   - Verify all required environment variables are set
   - Check MongoDB connection

---

## Support

For deployment issues:
1. Check the logs first
2. Review this guide
3. Create an issue on GitHub
4. Join our community Discord (if available)

---

**Happy Deploying! 🚀**
