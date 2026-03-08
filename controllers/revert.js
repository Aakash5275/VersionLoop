const fs = require('fs');
const path = require('path');
const { promisify } = require('util');   // Promisify fs functions for async/await

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertrepo(commitID) {
    const repopath = path.resolve(process.cwd(), ".versionloopgit");
    const commitspath = path.join(repopath, "commits");

    try {
        const commitDirs = path.join(commitspath, commitID);
        const files = await readdir(commitDirs);
        const parentDir= path.resolve(repopath, ".."); // Get the parent directory of .versionloopgit

        for (const file of files) { 
            await copyFile(path.join(commitDirs, file), path.join(parentDir, file)); // Copy each file to the parent directory
            console.log(`Reverted: ${file} to commit ${commitID}`);
    }
}
    catch (err) {
        console.error("Error reverting to commit:", err);
    }
    
}

module.exports={ revertrepo};
