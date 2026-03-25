VersionLoop 🔄
A custom Version Control System (VCS) built with Node.js, MongoDB, and AWS S3.

VersionLoop allows you to track file changes locally and sync them with the cloud. It uses MongoDB to manage commit metadata and AWS S3 to store the actual file versions, providing a CLI experience similar to Git.

🚀 Features
Local Tracking: Initialize repositories and stage files in a hidden .versionloopgit directory.

Commits: Create local snapshots of your project with unique IDs and timestamps.

Hybrid Cloud Sync: * MongoDB: Stores commit history, file hashes, and user data.

AWS S3: High-durability storage for file blobs and versions.

Time Travel: Instantly revert your workspace to any previous commit state using a Commit ID.

Real-time Backend: Built-in Socket.io support for potential real-time collaboration features.

🛠️ Prerequisites
Node.js (v18 or higher)

MongoDB Atlas account for metadata.

AWS Account with an S3 Bucket.

AWS CLI installed and configured (aws configure).

⚙️ Setup & Installation
1. Clone & Install
PowerShell
git clone https://github.com/Aakash5275/VersionLoop.git
cd VersionLoop/backend
npm install
2. Environment Configuration
Create a .env file in the backend folder and add your credentials:

Code snippet
PORT=3000
MONGODB_URL=your_mongodb_atlas_connection_string
S3_BUCKET=your_s3_bucket_name
AWS_REGION=ap-south-1

3. AWS & MongoDB Prep
AWS: Run aws configure in your terminal to set your Access/Secret keys.

MongoDB: In Atlas, ensure your IP Address is whitelisted in "Network Access" and you have a Database User created.

4. Start the Server
Before running versioning commands, start the backend to establish the DB connection:

PowerShell
node index.js start

Here is the Usage Guide broken down into clear, easy-to-read points for your README. This format is great for users who want to quickly understand how to use your CLI.

📖 Usage Guide
Follow these steps to manage your project versions with VersionLoop:

Initialize a Repository node index.js init

Sets up a new local repository by creating the hidden .versionloopgit directory to track your changes.

Stage a File node index.js add <file>

Prepares a specific file to be included in your next commit. This moves the file from your working directory to the staging area.

Commit Changes node index.js commit <msg>

Takes a snapshot of all currently staged files and saves them locally with a unique ID and a descriptive message.

Push to Cloud node index.js push

Syncs your local work with the cloud. This uploads your file versions to AWS S3 and saves the commit metadata (hashes and timestamps) to MongoDB.

Pull from Cloud node index.js pull

Downloads the latest commit history and file versions from the cloud to your local machine, ensuring your project is up to date.

Revert to a Previous State node index.js revert <id>

"Time travel" back to any previous version. This replaces your current local files with the exact state they were in during the specified Commit ID.

🏗️ Architecture
VersionLoop uses a modular, controller-based architecture for scalability:

index.js: CLI entry point powered by yargs.

controllers/: Contains core logic (hashing, S3 uploads, file restoration).

models/: Mongoose schemas for structured commit data.

config/: AWS SDK v3 and MongoDB connection settings.