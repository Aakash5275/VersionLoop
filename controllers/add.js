const fs = require('fs').promises;  // Use the promises API of fs for async/await
const path = require("path");      // Path module for handling file paths


async function addrepo(filePath){
    const repopath = path.resolve(process.cwd(), '.versionloopgit');
    const stagingPath = path.join(repopath, 'staging');  // staging area for added files

    try {

        await fs.mkdir(stagingPath, { recursive: true });  // Ensure staging directory exists
        const fileName = path.basename(filePath);  // Get the file name from the provided path

        await fs.copyFile(filePath, path.join(stagingPath, fileName));  // Copy the file to the staging area

        console.log(`File ${fileName} added to staging area successfully.`);

    } catch (err) {
        console.error("Error adding file:", err);  // Handle errors 
        
    }

}

module.exports={addrepo};