const fs = require("fs").promises;
const path = require("path");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pushrepo() {
    const repopath = path.resolve(process.cwd(), ".versionloopgit");
    const commitspath = path.join(repopath, "commits");

    try {
        const commitDirs = await fs.readdir(commitspath);

        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitspath, commitDir);

            const files = await fs.readdir(commitPath);

            for (const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);

                const command = new PutObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent,
                });

                await s3.send(command);  // ✅ Correct v3 method
            }
        }

        console.log("All commits pushed to S3 successfully!");

    } catch (err) {
        console.error("Error pushing changes:", err);
    }
}

module.exports = { pushrepo };