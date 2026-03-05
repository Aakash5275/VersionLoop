const fs = require("fs").promises;  // Use the promises API of fs for async/await
const path = require("path");
const {v4: uuidv4} = require("uuid");  // Import the uuid library to generate unique commit IDs


async function commitrepo(message){
    const repopath = path.resolve(process.cwd(), '.versionloopgit');
    const stagingpath = path.join(repopath, 'staging');
    const commitspath = path.join(repopath, 'commits');

    try {
        const commitId = uuidv4();  // Generate a unique commit ID using UUID
        const commitDir = path.join(commitspath, commitId);
        await fs.mkdir(commitDir, { recursive: true });  // Create a directory for the new commit

        const files = await fs.readdir(stagingpath);  // Read all files from the staging area
        for (const file of files) {
            await fs.copyFile(path.join(stagingpath, file), path.join(commitDir, file));  // Copy each staged file to the commit directory
        }
        await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify({ message , date: new Date().toISOString() }));  // Create a commit.json file with the commit message and timestamp

        console.log(`Commit ${commitId} created with message: ${message}`);

    } catch (err) {
        console.error("Error committing changes:", err);  // Handle errors (e.g., permission issues, missing staging area, etc.)
    }
}

module.exports={commitrepo};