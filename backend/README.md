# VersionLoop Backend 🔄

> A powerful Node.js backend for VersionLoop - a full-stack Version Control System (VCS)

The backend provides both CLI commands for local version control operations and REST API endpoints for dashboard functionality. It integrates MongoDB for metadata storage and AWS S3 for file blob storage.

**Status**: Active Development | **Version**: 1.0.0

---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Setup & Installation](#-setup--installation)
- [CLI Commands](#-cli-commands)
- [API Endpoints](#-api-endpoints)
- [Controllers Guide](#-controllers-guide)
- [Environment Variables](#-environment-variables)
- [Architecture](#-architecture)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗂️ **Local Tracking** | Initialize repos and stage files in a hidden `.versionloopgit` directory |
| 📸 **Commits** | Create local snapshots with unique IDs, timestamps, and messages |
| ☁️ **Cloud Sync** | Push/pull file blobs to **AWS S3** and commit metadata to **MongoDB** |
| ⏪ **Time Travel** | Revert workspace to any previous commit state |
| 👤 **User Auth** | Secure JWT-based authentication with bcrypt password hashing |
| 📁 **Repository Management** | Create, browse, and manage repositories via REST API |
| 🐛 **Issue Tracking** | Built-in issue creation and management |
| ⚡ **Real-time** | Socket.io support for real-time collaboration |
| 🔐 **Middleware** | Authentication and authorization checking |

---

## 🛠️ Tech Stack

- **[Node.js](https://nodejs.org/)** v18+ - JavaScript runtime
- **[Express 5](https://expressjs.com/)** - Web framework and routing
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB ODM for schema validation
- **[AWS S3 SDK v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)** - Cloud file storage
- **[Socket.io](https://socket.io/)** - Real-time communication
- **[yargs](https://yargs.js.org/)** - CLI command parsing
- **[JWT](https://jwt.io/)** - Token-based authentication
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Password hashing

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **MongoDB Atlas** account with database user credentials
- **AWS Account** with:
  - S3 bucket created
  - IAM user with S3 permissions
  - AWS CLI installed and configured

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aakash5275/VersionLoop.git
cd VersionLoop/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=3000

# MongoDB
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/versionloop?retryWrites=true&w=majority

# AWS S3
S3_BUCKET=your-s3-bucket-name
AWS_REGION=ap-south-1

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Configure AWS Credentials

Run AWS CLI to set up credentials:

```bash
aws configure
```

Enter your AWS Access Key ID and Secret Access Key when prompted.

### 5. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster or use existing one
3. In **Network Access**, whitelist your IP address (or 0.0.0.0 for development)
4. Create database user with read/write permissions
5. Copy connection string and update `.env`

### 6. Start the Server

```bash
npm start
# or
node index.js start
```

You should see:
```
Connected to MongoDB
Server is running on port 3000
```

---

## 🎮 CLI Commands

VersionLoop provides powerful CLI commands for version control operations.

### Command Syntax

```bash
node index.js <command> [options]
```

### Available Commands

#### 1. **Initialize Repository**
```bash
node index.js init
```
- Creates `.versionloopgit` hidden directory
- Sets up local repository structure
- Ready for file staging and commits

#### 2. **Stage Files**
```bash
node index.js add <file>
```
- Adds file to staging area
- File path relative to current directory

**Examples:**
```bash
node index.js add src/app.js
node index.js add package.json
node index.js add src/components/Header.jsx
```

#### 3. **Create Commit**
```bash
node index.js commit "<message>"
```
- Creates snapshot of staged files
- Generates unique commit ID
- Stores metadata (timestamp, hash)

**Examples:**
```bash
node index.js commit "Initial project setup"
node index.js commit "Fix login bug and update styles"
node index.js commit "Add user authentication"
```

#### 4. **Push to Cloud**
```bash
node index.js push
```
- Uploads local commits to MongoDB
- Stores file blobs in AWS S3
- Syncs with cloud repository

#### 5. **Pull from Cloud**
```bash
node index.js pull
```
- Downloads latest commits from MongoDB
- Retrieves file versions from AWS S3
- Updates local repository

#### 6. **Revert to Previous State**
```bash
node index.js revert <commitId>
```
- "Time travel" to specific commit
- Restores all files to that state
- Replaces current workspace files

**Example:**
```bash
node index.js revert abc123def456xyz
```

### Complete Workflow Example

```bash
# Start backend server
node index.js start

# In another terminal, initialize repo
node index.js init

# Make changes and add files
node index.js add src/app.js
node index.js add config.js

# Create commit
node index.js commit "Initial setup with configuration"

# Push to cloud
node index.js push

# Later: Pull latest changes
node index.js pull

# If needed: Revert to previous version
node index.js revert <commit-id>
```

---

## 🌐 API Endpoints

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------|
| GET | `/allUsers` | Fetch all users | No |
| POST | `/signup` | Register new user | No |
| POST | `/login` | Authenticate user | No |
| GET | `/userProfile` | Get current user info | Yes |
| PUT | `/updateProfile` | Update user details | Yes |
| DELETE | `/deleteProfile` | Delete account | Yes |

### Repository Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------|
| POST | `/repo/create` | Create repository | Yes |
| GET | `/repo/all` | List all repositories | No |
| GET | `/repo/:id` | Get repository by ID | No |
| GET | `/repo/name/:name` | Search by repository name | No |
| GET | `/repo/user/userId` | Get user's repositories | Yes |
| PUT | `/repo/update/:id` | Update repository | Yes |
| DELETE | `/repo/delete/:id` | Delete repository | Yes |
| PATCH | `/repo/toggle/:id` | Toggle visibility | Yes |

### Issue Tracking

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------|
| POST | `/issue/create` | Create new issue | Yes |
| PUT | `/issue/update/:id` | Update issue | Yes |
| DELETE | `/issue/delete/:id` | Delete issue | Yes |
| GET | `/issue/all` | List all issues | No |
| GET | `/issue/id/:id` | Get specific issue | No |

### API Usage Examples

```javascript
// Register User
POST /signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Login
POST /login
{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Create Repository
POST /repo/create
Headers: { Authorization: "Bearer <token>" }
{
  "name": "My Project",
  "description": "A cool project",
  "isPublic": true
}

// Create Issue
POST /issue/create
Headers: { Authorization: "Bearer <token>" }
{
  "repoId": "repo_id_here",
  "title": "Fix login bug",
  "description": "Users unable to login",
  "priority": "high"
}
```

---

## 🎯 Controllers Guide

### Version Control Controllers

#### `init.js`
**Function:** `initRepo()`
- Initializes repository structure
- Creates `.versionloopgit` directory
- Sets up metadata tracking files

#### `add.js`
**Function:** `addrepo(file)`
- Stages files for commit
- Calculates file hash
- Adds to staging area

#### `commit.js`
**Function:** `commitrepo(message)`
- Creates snapshot of staged files
- Generates unique commit ID
- Stores commit metadata

#### `push.js`
**Function:** `pushrepo()`
- Uploads commits to MongoDB
- Stores files in AWS S3
- Updates remote repository

#### `pull.js`
**Function:** `pullrepo()`
- Fetches commits from MongoDB
- Downloads files from AWS S3
- Updates local workspace

#### `revert.js`
**Function:** `revertrepo(commitId)`
- Retrieves specific commit state
- Restores all files to that version
- Updates workspace

### API Controllers

#### `userController.js` - User Management
```javascript
// Handles user lifecycle
getAllUsers()       // Fetch all users
signUp()            // Create new user
login()             // Authenticate user
getUserProfile()    // Retrieve user info
updateUserProfile() // Modify user data
deleteUserProfile() // Remove user account
```

#### `repoController.js` - Repository Management
```javascript
// Handles repository operations
creatRepository()              // Create new repo
getAllRepositories()           // List all repos
fetchRepositoryById()          // Get specific repo
fetchRepositoryByName()        // Search repos
fetchRepositoryForCurrentUser() // Get user's repos
updateRepositoryById()         // Modify repo
deleteRepositoryById()         // Remove repo
toggleVisibilityById()         // Change public/private
```

#### `issueController.js` - Issue Tracking
```javascript
// Handles issue management
createIssue()      // Create new issue
updateIssueById()  // Modify issue
deleteIssueById()  // Remove issue
getAllIssues()     // List all issues
getIssueById()     // Get specific issue
```

---

## 🔒 Middleware

### Authentication Middleware
**File:** `middleware/authMiddleware.js`
- Verifies JWT tokens
- Extracts user information
- Protects authenticated routes

### Authorization Middleware
**File:** `middleware/authorizeMiddleware.js`
- Checks user permissions
- Validates resource ownership
- Enforces access control policies

---

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  avatar: String
}
```

### Repository Model
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  isPublic: Boolean,
  commits: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Issue Model
```javascript
{
  title: String,
  description: String,
  repository: ObjectId (ref: Repository),
  priority: String (low/medium/high),
  status: String (open/closed),
  creator: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌍 Environment Variables

```env
# Server Configuration
PORT=3000                    # Express server port

# Database
MONGODB_URL=<connection string>  # MongoDB Atlas URI

# AWS S3
S3_BUCKET=<bucket-name>      # S3 bucket name
AWS_REGION=ap-south-1        # AWS region

# Authentication
JWT_SECRET=<secret-key>      # Secret key for JWT tokens
```

---

## 🏗️ Architecture

VersionLoop uses a modular, scalable architecture:

```
Backend/
├── index.js              # CLI entry point + Express server
├── config/
│   └── aws-config.js    # AWS SDK configuration
├── routes/              # Express route handlers
│   ├── user.router.js
│   ├── repo.router.js
│   └── issue.router.js
├── controllers/         # Business logic
│   ├── [CLI controllers]
│   ├── userController.js
│   ├── repoController.js
│   └── issueController.js
├── models/              # Mongoose schemas
│   ├── userModel.js
│   ├── repoModel.js
│   └── issueModel.js
├── middleware/          # Express middleware
│   ├── authMiddleware.js
│   └── authorizeMiddleware.js
└── package.json
```

### Data Flow
1. **CLI Layer**: yargs parses commands
2. **Controller Layer**: Executes business logic
3. **Service Layer**: Manages AWS S3 and MongoDB operations
4. **Data Layer**: Mongoose models handle database access

---

## 🚀 Deployment

### Heroku Deployment

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create versionloop-backend

# Set environment variables
heroku config:set PORT=3000
heroku config:set MONGODB_URL=<your_url>
heroku config:set JWT_SECRET=<your_secret>

# Deploy
git push heroku main
```

---

## 📝 License

ISC - Created by Aakash Gupta

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests.

---

## 📞 Support

For issues and questions, please open an issue on GitHub.