# VersionLoop 🔄

> A full-stack Version Control System (VCS) built with Node.js, MongoDB, AWS S3, and a React frontend.

VersionLoop lets you track file changes locally and sync them with the cloud — combining a powerful CLI experience (similar to Git) with a modern web dashboard for repository management, issue tracking, and user collaboration.

**Status**: Active Development | **Version**: 1.0.0


//backend 
node index.js start

// frontend 
npm run dev
---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Setup & Installation](#-setup--installation)
- [CLI Commands](#-cli-commands)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Controllers Guide](#-controllers-guide)
- [Frontend Components](#-frontend-components)
- [Running the Project](#-running-the-project)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗂️ **Local Tracking** | Initialize repos and stage files in a hidden `.versionloopgit` directory |
| 📸 **Commits** | Create local snapshots with unique IDs, timestamps, and messages |
| ☁️ **Cloud Sync** | Push/pull file blobs to **AWS S3** and commit metadata to **MongoDB Atlas** |
| ⏪ **Time Travel** | Revert your workspace to any previous commit state using a Commit ID |
| 👤 **User Auth** | Secure JWT-based registration and login with bcrypt password hashing |
| 📁 **Repository Management** | Create, browse, and manage repositories via the web dashboard |
| 🐛 **Issue Tracking** | Built-in issue creation and management per repository |
| ⚡ **Real-time** | Socket.io backend for live collaboration features |
| 🖥️ **React Dashboard** | Modern frontend built with React 19, Vite, and GitHub Primer UI |

---

## 🛠️ Tech Stack

**Backend**
- [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) — commit metadata & user data
- [AWS S3 SDK v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) — file blob storage
- [Socket.io](https://socket.io/) — real-time room-based events
- [JWT](https://jwt.io/) + [bcryptjs](https://www.npmjs.com/package/bcryptjs) — authentication
- [yargs](https://yargs.js.org/) — CLI command parsing

**Frontend**
- [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- [React Router v7](https://reactrouter.com/) — client-side routing
- [GitHub Primer React](https://primer.style/react/) — UI component library
- [Axios](https://axios-http.com/) — HTTP client

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **MongoDB Atlas** account (for metadata storage)
- **AWS Account** with an S3 bucket configured
- **AWS CLI** installed and configured (`aws configure`)

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aakash5275/VersionLoop.git
cd VersionLoop
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=3000
MONGODB_URL=your_mongodb_atlas_connection_string
S3_BUCKET=your_s3_bucket_name
AWS_REGION=ap-south-1
JWT_SECRET=your_jwt_secret_key
```

### 5. Configure AWS Credentials

Run the following in your terminal to set your AWS Access/Secret keys:

```bash
aws configure
```

### 6. MongoDB Atlas Setup

- In your Atlas dashboard, go to **Network Access** and whitelist your IP address.
- Create a **Database User** with read/write permissions.

### 7. Run the Application

**Start Backend Server:**
```bash
cd backend
npm start
```

**Start Frontend Development Server:**
```bash
cd ../frontend
npm run dev
```

---

## 🎮 CLI Commands

VersionLoop provides a powerful CLI interface for version control operations. All commands are run from the backend directory.

### Command Syntax
```bash
node index.js <command> [options]
```

### Available Commands

| Command | Syntax | Description |
|---------|--------|-------------|
| **start** | `node index.js start` | Start the Express server and connect to MongoDB |
| **init** | `node index.js init` | Initialize a new repository (creates `.versionloopgit` folder) |
| **add** | `node index.js add <file>` | Stage a file for the next commit |
| **commit** | `node index.js commit "<message>"` | Create a commit snapshot with a message |
| **pull** | `node index.js pull` | Fetch latest commits and files from MongoDB/S3 |
| **push** | `node index.js push` | Upload local commits and files to MongoDB/S3 |
| **revert** | `node index.js revert <commitId>` | Restore workspace to a previous commit state |

### Command Examples

```bash
# Initialize a new repository
node index.js init

# Add files to staging area
node index.js add src/app.js
node index.js add package.json

# Commit changes
node index.js commit "Initial project setup"

# Push to cloud (MongoDB & AWS S3)
node index.js push

# Pull latest changes from cloud
node index.js pull

# Revert to a previous commit
node index.js revert abc123def456
```

---

## 🌐 API Endpoints

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/allUsers` | Fetch all registered users |
| POST | `/signup` | Register a new user account |
| POST | `/login` | Authenticate user and return JWT token |
| GET | `/userProfile` | Get current user profile |
| PUT | `/updateProfile` | Update user profile information |
| DELETE | `/deleteProfile` | Delete user account |

### Repository Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/repo/create` | Create a new repository |
| GET | `/repo/all` | Fetch all repositories |
| GET | `/repo/:id` | Fetch repository by ID |
| GET | `/repo/name/:name` | Search repository by name |
| GET | `/repo/user/userId` | Fetch repositories for current user |
| PUT | `/repo/update/:id` | Update repository details |
| DELETE | `/repo/delete/:id` | Delete a repository |
| PATCH | `/repo/toggle/:id` | Toggle repository visibility (public/private) |

### Issue Tracking Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/issue/create` | Create a new issue |
| PUT | `/issue/update/:id` | Update issue status/details |
| DELETE | `/issue/delete/:id` | Delete an issue |
| GET | `/issue/all` | Fetch all issues |
| GET | `/issue/id/:id` | Fetch specific issue by ID |

---

## 📂 Project Structure

```
VersionLoop/
├── backend/
│   ├── config/
│   │   └── aws-config.js           # AWS S3 SDK configuration
│   ├── controllers/               # Business logic for all operations
│   │   ├── init.js               # Repository initialization
│   │   ├── add.js                # File staging logic
│   │   ├── commit.js             # Commit creation
│   │   ├── pull.js               # Download from cloud
│   │   ├── push.js               # Upload to cloud
│   │   ├── revert.js             # Commit reversion
│   │   ├── userController.js     # User management
│   │   ├── repoController.js     # Repository management
│   │   └── issueController.js    # Issue tracking
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   └── authorizeMiddleware.js # Authorization checks
│   ├── models/
│   │   ├── userModel.js          # User schema
│   │   ├── repoModel.js          # Repository schema
│   │   └── issueModel.js         # Issue schema
│   ├── routes/
│   │   ├── main.router.js        # Main route aggregator
│   │   ├── user.router.js        # User routes
│   │   ├── repo.router.js        # Repository routes
│   │   └── issue.router.js       # Issue routes
│   ├── index.js                  # CLI entry point & server setup
│   ├── package.json
│   └── .env                       # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/             # Login/Signup pages
│   │   │   ├── dashboard/        # Main dashboard
│   │   │   ├── repo/             # Repository management
│   │   │   └── user/             # User profile & navbar
│   │   ├── App.jsx               # Main App component
│   │   ├── Routes.jsx            # Route definitions
│   │   ├── authContext.jsx       # Auth state management
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── vite.config.js            # Vite configuration
│   ├── eslint.config.js
│   ├── package.json
│   └── index.html
│
└── README.md
```

---

## 🎯 Controllers Guide

### Version Control Controllers (CLI)

#### `init.js` - Repository Initialization
- **Function**: `initRepo()`
- **Purpose**: Creates hidden `.versionloopgit` directory structure for tracking
- **Outputs**: Initializes local repository for version control

#### `add.js` - File Staging
- **Function**: `addrepo(file)`
- **Purpose**: Adds files to staging area before commit
- **Parameters**: `file` (string) - path to file to stage
- **Outputs**: Updates staging area with file changes

#### `commit.js` - Create Snapshots
- **Function**: `commitrepo(message)`
- **Purpose**: Creates a snapshot of staged files with metadata
- **Parameters**: `message` (string) - commit message
- **Outputs**: Local commit with unique ID and timestamp

#### `push.js` - Upload to Cloud
- **Function**: `pushrepo()`
- **Purpose**: Uploads commits and files to AWS S3 and MongoDB
- **Outputs**: Files stored in S3, metadata in MongoDB

#### `pull.js` - Download from Cloud
- **Function**: `pullrepo()`
- **Purpose**: Fetches latest commits and files from cloud
- **Outputs**: Updates local repository with remote changes

#### `revert.js` - Time Travel
- **Function**: `revertrepo(commitId)`
- **Purpose**: Restores workspace to a previous commit state
- **Parameters**: `commitId` (string) - ID of commit to revert to
- **Outputs**: Workspace files replaced with specified commit version

### API Controllers

#### `userController.js` - User Management
- `getAllUsers()` - List all registered users
- `signUp()` - Register new user with bcrypt password hashing
- `login()` - Authenticate and return JWT token
- `getUserProfile()` - Fetch user details
- `updateUserProfile()` - Update user information
- `deleteUserProfile()` - Delete user account

#### `repoController.js` - Repository Management
- `createRepository()` - Create new repository
- `getAllRepositories()` - List all repositories
- `fetchRepositoryById()` - Get specific repository
- `fetchRepositoryByName()` - Search repository by name
- `fetchRepositoryForCurrentUser()` - Get user's repositories
- `updateRepositoryById()` - Modify repository details
- `deleteRepositoryById()` - Remove repository
- `toggleVisibilityById()` - Toggle public/private status

#### `issueController.js` - Issue Tracking
- `createIssue()` - Create new issue
- `updateIssueById()` - Update issue status/description
- `deleteIssueById()` - Remove issue
- `getAllIssues()` - List all issues
- `getIssueById()` - Fetch specific issue

---

## 🎨 Frontend Components

### Authentication Module (`components/auth/`)
- **Login.jsx** - User login page with JWT integration
- **Signup.jsx** - User registration with form validation
- **auth.css** - Authentication styling

### Dashboard (`components/dashboard/`)
- **Dashboard.jsx** - Main application dashboard
- **dashboard.css** - Dashboard styling

### Repository Management (`components/repo/`)
- Repository creation and management UI
- File browsing and versioning interface

### User Management (`components/user/`)
- **Navbar.jsx** - Navigation bar with user menu
- **Profile.jsx** - User profile page
- **navbar.css** - Navigation styling

### Root Components
- **App.jsx** - Main application wrapper
- **Routes.jsx** - Client-side route definitions (React Router v7)
- **authContext.jsx** - Global authentication state management
- **main.jsx** - React entry point

---

## 🚀 Running the Project

### Start the Backend Server

```bash
cd backend
node index.js start
# Server will run on http://localhost:3000
```

### Start the Frontend Dev Server

```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 📖 CLI Usage Guide

The VersionLoop CLI is powered by `yargs`. All commands are run via `node index.js <command>` from the `backend/` directory.

### Initialize a Repository

```bash
node index.js init
```

Sets up a new local repository by creating the hidden `.versionloopgit` directory to track your changes.

### Stage a File

```bash
node index.js add <file>
```

Prepares a specific file to be included in your next commit (moves it to the staging area).

### Commit Changes

```bash
node index.js commit "<message>"
```

Takes a snapshot of all staged files and saves them locally with a unique ID and your descriptive message.

### Push to Cloud

```bash
node index.js push
```

Syncs your local work with the cloud — uploads file versions to **AWS S3** and saves commit metadata to **MongoDB**.

### Pull from Cloud

```bash
node index.js pull
```

Downloads the latest commit history and file versions from the cloud to your local machine.

### Revert to a Previous State

```bash
node index.js revert <commitId>
```

"Time travel" back to any previous version. Replaces your current local files with the exact state they were in at the specified Commit ID.

---

## 🌐 API Endpoints

The backend REST API is organized into the following route groups:

| Router | Base Path | Description |
|---|---|---|
| `user.router` | `/api/user` | Register, login, profile |
| `repo.router` | `/api/repo` | Create, list, manage repos |
| `issue.router` | `/api/issue` | Create and manage issues |
| `main.router` | `/` | Health check & root routes |

---

## 🏗️ Project Structure

```
VersionLoop/
├── backend/
│   ├── index.js              # CLI entry point (yargs) & Express server
│   ├── controllers/
│   │   ├── init.js           # Repo initialization logic
│   │   ├── add.js            # File staging logic
│   │   ├── commit.js         # Local snapshot creation
│   │   ├── push.js           # Upload to S3 + MongoDB
│   │   ├── pull.js           # Download from cloud
│   │   ├── revert.js         # Workspace restoration
│   │   ├── userController.js # Auth (register/login/JWT)
│   │   ├── repoController.js # Repository CRUD
│   │   └── issueController.js# Issue tracking
│   ├── models/               # Mongoose schemas (commits, users, repos)
│   ├── routes/               # Express routers
│   ├── middleware/           # JWT auth middleware
│   ├── config/               # AWS S3 & MongoDB connection setup
│   └── .env                  # Environment variables (not committed)
│
└── frontend/
    ├── src/
    │   ├── App.jsx           # Root app component
    │   ├── Routes.jsx        # Client-side routing
    │   ├── authContext.jsx   # Auth state context
    │   └── components/
    │       ├── auth/         # Login & Register pages
    │       ├── dashboard/    # Main dashboard view
    │       ├── repo/         # Repository pages
    │       └── user/         # User profile pages
    ├── index.html
    └── vite.config.js
```

---

## 🔒 Authentication Flow

1. User registers via `POST /api/user/register` — password is hashed with **bcryptjs**.
2. Login via `POST /api/user/login` — returns a signed **JWT**.
3. Protected routes require the JWT in the `Authorization: Bearer <token>` header.
4. Frontend stores the token and passes it with every authenticated request via **Axios**.

---

## 🤝 Contributing

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Aakash Gupta** — [GitHub](https://github.com/Aakash5275)