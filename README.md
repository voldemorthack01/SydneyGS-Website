# Sydney Gold Star Group - Website (v2)

Professional painting services website for Sydney Gold Star Group. Features a gallery, contact form, and admin dashboard for quote management.

![Sydney GS Logo](public/images/Logos/Logo.png)
*(Note: Screenshot/Logo placeholder)*

## 🚀 Features
- **Responsive Design**: Modern, mobile-friendly interface.
- **Quote Submission**: Secure contact form with validation.
- **Admin Dashboard**: Secure login to view and manage leads.
- **SEO Optimized**: Meta tags, Open Graph, Sitemap, and formatted URLs.
- **Secure**: Helmet headers, Rate Limiting, Bcrypt hashing, HttpOnly cookies.
- **Performant**: Gzip compression, static caching, and optimized assets.

## 📂 File Structure
```
.
├── data/               # SQLite database & storage
├── public/             # Static assets (HTML, CSS, JS, Images)
├── tests/              # Integration tests
├── .env                # Environment variables (Sensitive)
├── server.js           # Main Express application
├── package.json        # Dependencies & Scripts
└── README.md           # This file
```

## 🛠 Tech Stack
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: SQLite (via `better-sqlite3`)
- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Security**: Helmet, Bcrypt, Express-Rate-Limit
- **Testing**: Jest, Supertest

## ⚡ Setup & Installation

### Prerequisites
- Node.js installed (v16 or higher) -> [Download](https://nodejs.org/)
- Git (optional)

### 1. Install Dependencies
Open a terminal in the project folder:
```powershell
npm install
```

### 2. Configure Environment
A `.env` file is used for **local development**. A template is provided in `.env.example`.

**Local Setup (`.env`):**
```ini
PORT=3000
ADMIN_USERNAME=replace_with_admin_username
ADMIN_PASSWORD_HASH=$2b$10$...  # (Use generate-hash.js to create)
SESSION_SECRET=local_dev_secret
NODE_ENV=development
SELF_URL=http://localhost:3000/
```

**Production Setup (Render/Server):**
Do not upload `.env`. Instead, set these in your host's "Environment Variables" settings:
- `NODE_ENV`: `production`
- `SELF_URL`: `https://www.sydneygs.com/`
- `ADMIN_USERNAME`: `Admin`
- `ADMIN_PASSWORD_HASH`: (Your generated hash)
- `SESSION_SECRET`: (A long random string)

> **Note**: `.env.example` is a safe template to see what variables are required. `.env` contains your actual local secrets and is ignored by git.

### 3. Run the Application
- **Development** (Auto-restart):
  ```powershell
  npm run dev
  ```
- **Production**:
  ```powershell
  npm start
  ```
- **Test**:
  ```powershell
  npm test
  ```

Visit `http://localhost:3000` to view the site.

## 🔒 Security & Admin Access
The admin panel is at `/admin.html`.
- **Default User**: `replace_with_admin_username`
- **Default Password**: (As configured. Hashed in `.env`) -> *See internal notes for plain password.*

**Security Measures Implemented:**
- **Credentials**: Passwords are hashed (Bcrypt). No plaintext storage.
- **Headers**: `Helmet` secures HTTP headers (CSP, X-Frame-Options).
- **Rate Limiting**: Limits repeated requests to prevent abuse.
- **Validation**: All inputs are sanitized server-side.
- **CSRF/Auth**: Authentication uses secure HttpOnly cookies.

## 📊 Database
The SQLite database is auto-created at `data/submissions.db`.
**Schema:** `submissions (id, full_name, phone, email, message, submitted_at)`

## 🌐 Deployment

### 1. Clean URLs & Redirects
The application uses Express middleware to serve clean URLs (e.g., `/contact`) and permanently redirect legacy paths (`/contact.html` → `/contact`).
- **Canonical URLs**: All pages now reference `https://www.sydneygs.com/`.
- **Nginx (Optional)**: If using Nginx as a reverse proxy, you can add this for extra performance, though Express handles it fine:
  ```nginx
  rewrite ^/(.*)\.html$ /$1 permanent;
  ```

### 2. Data Persistence
The SQLite database lives in `/data/submissions.db`.
- **Important**: This folder is **ignored** by git to prevent overwriting production data.
- **Backup**: Regularly back up the `data/` folder from your server to a safe location (e.g., S3).
- **Docker/Render**: Ensure you mount a **Persistent Disk** to `/opt/render/project/src/data` (or your app's path) so data survives redeploys.

## 🚀 SEO & Local Search

### 1. Technical SEO
- **Metadata**: Unique Title, Description, and Open Graph tags on all pages.
- **Schema.org**: `LocalBusiness` JSON-LD implemented for rich results (Maps, Knowledge Graph).
- **Structure**: Semantic HTML5 (Header, Nav, Main, Footer).
- **Sitemap**: Auto-generated at `/sitemap.xml` with clean URLs.

### 2. Core Web Vitals Targets
To maintain ranking, aim for:
- **LCP (Loading)**: < 2.5s (Preload Hero images).
- **INP (Interactivity)**: < 200ms (Defer non-critical JS).
- **CLS (Stability)**: < 0.1 (Dimensions on all images).

### 3. Google Business Profile (GBP) Checklist
To dominate local search:
1. **Consistency**: Ensure Name, Address, Phone matches website exactly.
2. **Reviews**: Reply to every review within 24 hours.
3. **Posts**: Add weekly updates with photos of recent jobs.
4. **Services**: List specific suburbs (Parramatta, Penrith, Mosman, etc.).

## 🤝 Troubleshooting
- **`npm install` fails**: Ensure Node.js is installed. Try deleting `node_modules` and `package-lock.json` and re-running.
- **"Address in use"**: Check if another instance is running on port 3000.
- **Login fails**: Verify `.env` hash matches the password. Use `generate-hash.js` snippet to make a new one if needed.
- **Redirect Loops**: Check `trust proxy` setting in `server.js` if behind a Load Balancer (Render/Heroku).

## 📜 License
ISC License. Copyright © 2025 Sydney Gold Star Group.
