const fs = require('fs').promises;  // Use the promises API of fs for async/await
const path = require('path');      // Path module for handling file paths

async function initRepo(){
  const repopath = path.resolve(process.cwd(), '.versionloopgit');  
  const commitspath = path.join(repopath, 'commits');

    try {

    await fs.mkdir(repopath, { recursive: true });  // folder for .versionloopgit
    await fs.mkdir(commitspath,{ recursive: true }); // folder for commits, it is inside versionloopgit
    await fs.writeFile(
        path.join(repopath, 'config.json'),
        JSON.stringify({bucket: process.env.S3_BUCKET}));  // config file for S3 bucket name
    console.log("Repository initialized successfully.");

    } catch (err) {
        console.error("Error initializing repository:", err);  // Handle errors (e.g., permission issues, existing repository, etc.)
    }
}

module.exports={initRepo};