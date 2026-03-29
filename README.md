# VersionLoop 🔄

> A full-stack Version Control System (VCS) built with Node.js, MongoDB, AWS S3, and a React frontend.

VersionLoop lets you track file changes locally and sync them with the cloud — combining a powerful CLI experience (similar to Git) with a modern web dashboard for repository management, issue tracking, and user collaboration.

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