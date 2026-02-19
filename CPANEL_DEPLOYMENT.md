# BB4Peace cPanel Deployment Guide

## Prerequisites
- cPanel with Node.js Selector (CloudLinux)
- SSH access (recommended) or File Manager
- Domain: bbforpeace.org

## Step 1: Build Locally

```bash
# In your project directory
npm run build
```

This creates:
- `.next/standalone/` - Minimal production server
- `.next/static/` - Static assets

## Step 2: Prepare Files for Upload

After building, you need these files/folders:

```
bb4peace/
├── .next/
│   ├── standalone/     # Main server files
│   └── static/         # Static assets
├── public/             # Images, documents
├── db/                 # SQLite database folder
├── package.json
└── .env               # Environment variables (create on server)
```

## Step 3: Create Node.js Application in cPanel

1. Login to cPanel
2. Go to **Setup Node.js App** (or "Node.js Selector")
3. Click **Create Application**
4. Configure:
   - **Node.js version**: 20.x (or 18.x)
   - **Application mode**: Production
   - **Application root**: `bb4peace` (or your folder name)
   - **Application URL**: bbforpeace.org
   - **Application startup file**: `server.js`

5. Click **Create**

## Step 4: Upload Files

### Option A: Using SSH + Git (Recommended)

```bash
# SSH into your server
ssh username@bbforpeace.org

# Navigate to app directory
cd ~/bb4peace

# Clone repository
git clone https://github.com/valuemaxcodershub/bbforpeace.git .

# Install dependencies
npm install --production

# Build
npm run build
```

### Option B: Using File Manager

1. Zip locally:
   - `.next/standalone/`
   - `.next/static/`
   - `public/`
   - `package.json`

2. Upload zip to cPanel via File Manager
3. Extract in application root

## Step 5: Configure Static Files

Copy static files to standalone folder:

```bash
# From SSH or terminal
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
```

## Step 6: Create server.js

Create `server.js` in your app root:

```javascript
// server.js - cPanel entry point
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = false
const hostname = '0.0.0.0'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

## Step 7: Environment Variables

In cPanel Node.js app settings, add environment variables:

```
NODE_ENV=production
PAYLOAD_SECRET=your-32-character-secret-key-here
NEXT_PUBLIC_SITE_URL=https://bbforpeace.org
DATABASE_URI=file:./db/payload.db
```

Or create `.env` file in app root.

### Generate PAYLOAD_SECRET

```bash
# Run this to generate a secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 8: Database Setup

Create database folder and ensure write permissions:

```bash
mkdir -p db
chmod 755 db
```

SQLite database will be auto-created on first run.

## Step 9: Start Application

1. In cPanel Node.js Selector, click **Run NPM Install**
2. Click **Restart** to start the application

## Step 10: Create Admin User

Visit `https://bbforpeace.org/admin` and create your first admin account.

---

## Troubleshooting

### Application won't start
- Check Node.js logs in cPanel
- Verify `server.js` exists
- Ensure correct Node.js version (18+)

### 502/503 errors
- Check if application is running in Node.js Selector
- Review error logs

### Database errors
- Ensure `db/` folder exists with write permissions
- Check `DATABASE_URI` environment variable

### Static files not loading
- Verify `.next/static` copied to standalone folder
- Check `public/` folder is in place

---

## File Structure After Deployment

```
~/bb4peace/
├── .next/
│   └── standalone/
│       ├── .next/
│       │   └── static/     # Copied static assets
│       ├── public/         # Copied public folder
│       └── server.js       # Next.js server
├── db/
│   └── payload.db          # SQLite database (auto-created)
├── public/
│   ├── images/
│   └── documents/
├── server.js               # Entry point
├── package.json
└── .env
```

---

## Alternative: Using Standalone Build Directly

If cPanel uses Passenger (common), modify `.htaccess`:

```apache
PassengerNodejs /opt/alt/alt-nodejs20/root/usr/bin/node
PassengerAppRoot /home/username/bb4peace/.next/standalone
PassengerStartupFile server.js
```

---

## Updating the Site

```bash
# SSH into server
cd ~/bb4peace

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Rebuild
npm run build

# Copy static files
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Restart in cPanel Node.js Selector
```
