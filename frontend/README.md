# VersionLoop Frontend 🎨

> Modern React dashboard for VersionLoop, a full-stack Version Control System

The frontend provides a comprehensive web interface for repository management, user authentication, issue tracking, and file versioning using a clean, modern design built with React 19, Vite, and GitHub Primer UI.

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup & Installation](#-setup--installation)
- [Project Structure](#-project-structure)
- [Components Guide](#-components-guide)
- [Running the Application](#-running-the-application)
- [Build & Deployment](#-build--deployment)

---

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based login/signup with bcrypt password hashing
- 📁 **Repository Dashboard** - Create, browse, and manage repositories
- 🔀 **Version Control UI** - Visualize commits, file history, and changes
- 🐛 **Issue Management** - Create, track, and manage project issues
- 👤 **User Profiles** - View and manage user information
- 🌙 **Modern UI** - GitHub Primer React components for professional appearance
- ⚡ **Fast Development** - Vite for instant HMR (Hot Module Replacement)
- 📱 **Responsive Design** - Works seamlessly across devices

---

## 🛠️ Tech Stack

- **[React 19](https://react.dev/)** - Modern React with latest features
- **[Vite 8](https://vitejs.dev/)** - Lightning-fast build tool with HMR
- **[React Router v7](https://reactrouter.com/)** - Client-side routing and navigation
-***[GitHub Primer React](https://primer.style/react/)** - Professional UI component library
- **[Axios](https://axios-http.com/)** - HTTP client for API calls
- **[ESLint](https://eslint.org/)** - Code quality and consistency

---

## 📦 Installation

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager
- Backend server running (see main README)

### Setup Steps

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Configure API Endpoint

Create or update `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
```425.7386
/

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx           # User login page
│   │   │   ├── Signup.jsx          # User registration
│   │   │   └── auth.css            # Auth styling
│   │   │
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   └── dashboard.css       # Dashboard styling
│   │   │
│   │   ├── repo/
│   │   │   └── [repo components]  # Repository management UI
│   │   │
│   │   └── user/
│   │       ├── Navbar.jsx          # Navigation bar
│   │       ├── Profile.jsx         # User profile page
│   │       └── navbar.css          # Navigation styling
│   │
│   ├── App.jsx                     # Main app wrapper
│   ├── App.css                     # App styles
│   ├── Routes.jsx                  # Route configuration
│   ├── authContext.jsx             # Auth state management
│   ├── main.jsx                    # React entry point
│   ├── index.css                   # Global styles
│   └── assets/                     # Static assets
│
├── public/                         # Public static files
├── vite.config.js                  # Vite configuration
├── eslint.config.js                # ESLint rules
├── package.json
├── index.html                      # HTML entry point
└── README.md
```

---

## 🧩 Components Guide

### Authentication Components (`src/components/auth/`)

#### `Login.jsx`
- User login form with email and password
- JWT token storage and validation
- Redirects to dashboard on successful login
- Error handling for invalid credentials

#### `Signup.jsx`
- User registration form
- Password strength validation
- Email verification
- Account creation with bcrypt hashing

### Dashboard (`src/components/dashboard/`)
  
#### `Dashboard.jsx`
- Main application hub
- Repository list view
- Quick actions for repository management
- Statistics and overview
- Issue summary

### Repository Components (`src/components/repo/`)
- Repository creation wizard
- File browser and explorer
- Commit history viewer
- File versioning interface
- Diff viewer for changes

### User Components (`src/components/user/`)

#### `Navbar.jsx`
- Top navigation bar
- User menu with profile/logout options
- Search functionality
- Logo and branding

#### `Profile.jsx`
- User profile information display
- Edit profile form
- Account settings
- Password change option

### Root Components

#### `App.jsx`
- Main application wrapper
- Applies global styling
- Sets up context providers

#### `Routes.jsx`
- Defines all application routes
- Protected routes for authenticated users
- Route guards with JWT verification

#### `authContext.jsx`
- Global authentication state management using React Context API
- Manages login/logout state
- Stores JWT token
- Tracks current user information

---

## 🚀 Running the Application

### Development Server

```bash
# Start development server with HMR
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
# Create optimized production build
npm run build
```

### Preview Production Build

```bash
# Preview the production bundle locally
npm run preview
```

### Linting

```bash
# Check code quality with ESLint
npm run lint
```

---

## 🔗 API Integration

The frontend communicates with the backend via Axios. Base URL is configured via `VITE_API_URL` environment variable.

### Example API Calls

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// User Authentication
const login = ({ email, password }) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

const signup = ({ name, email, password }) => {
  return axios.post(`${API_URL}/signup`, { name, email, password });
};

// Repository Operations
const createRepo = (repoData) => {
  return axios.post(`${API_URL}/repo/create`, repoData);
};

const getAllRepos = () => {
  return axios.get(`${API_URL}/repo/all`);
};

// Issue Management
const createIssue = (issueData) => {
  return axios.post(`${API_URL}/issue/create`, issueData);
};
```

---

## 🛠️ Customization

### Changing API URL
Update the `VITE_API_URL` in your `.env` file to point to your backend server.

### Styling
- Global styles: `src/index.css`
- Component-specific styles: alongside their `.jsx` files
- GitHub Primer CSS is imported automatically

### Adding New Routes
Edit `src/Routes.jsx` to add new page routes:

```javascript
import NewPage from './components/newpage/NewPage';

// Add to route definition
{
  path: '/new-page',
  element: <NewPage />
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### API Connection Issues
- Ensure backend server is running on port 3000
- Verify `VITE_API_URL` in `.env` is correct
- Check CORS settings in backend

### Module Import Errors
If you encounter import errors:
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

---

## 📝 License

ISC - Created by Aakash Gupta

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [GitHub Primer React](https://primer.style/react/)
- [Axios Documentation](https://axios-http.com/)
