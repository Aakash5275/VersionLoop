VersionLoop 🔄
A custom Version Control System (VCS) built with Node.js and AWS S3.

VersionLoop allows you to track file changes locally and sync them with the cloud, featuring a CLI interface similar to Git.

🚀 Features
Local Tracking: Initialize a repository and stage files.

Commits: Save snapshots of your project locally.

Cloud Sync: Push and Pull commits to/from AWS S3.

Time Travel: Revert your local workspace to any previous commit ID.

🛠️ Prerequisites
Node.js (v18 or higher recommended)

AWS Account with an S3 Bucket created.

AWS CLI installed and configured.

⚙️ Setup & Installation
Clone the repository:

Bash
git clone https://github.com/your-username/VersionLoop.git
cd VersionLoop/backend
Install dependencies:

Bash
npm install
Configure AWS Credentials:
Run the following command and enter your AWS Access Key, Secret Key, and Region (ap-south-1 or eu-north-1):

Bash
aws configure
Environment Variables:
Create a .env file in the backend folder:

Code snippet
S3_BUCKET=your-bucket-name
AWS_REGION=your-region
📖 Usage Guide
1. Initialize a Repository
Start tracking your project. This creates a hidden .versionloopgit folder.

Bash
node index.js init
2. Add Files
Stage a specific file for the next commit.

Bash
node index.js add <filename>
3. Commit Changes
Save a snapshot of staged files locally with a message.

Bash
node index.js commit "Initial commit"
4. Push to Cloud
Upload all local commits to your AWS S3 bucket.

Bash
node index.js push
5. Pull from Cloud
Download all commits from S3 to your local machine.

Bash
node index.js pull
6. Revert to a Commit
Restore your project files to the state of a specific Commit ID.

Bash
node index.js revert <commit-id>
🏗️ Architecture
The project uses a controller-based architecture:

index.js: The CLI entry point using yargs.

controllers/: Logic for each command (push, pull, revert, etc.).

config/: AWS SDK v3 configuration.