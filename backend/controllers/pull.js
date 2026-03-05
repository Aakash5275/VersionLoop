const fs = require('fs').promises;
const path = require('path');
// Import the commands needed for v3
const { ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullrepo() {
    const repopath = path.resolve(process.cwd(), ".versionloopgit");

    try {
        // 1. Create the command
        const listCommand = new ListObjectsV2Command({ 
            Bucket: S3_BUCKET, 
            Prefix: 'commits/' 
        });

        // 2. Use s3.send() instead of .listObjectsV2().promise()
        const data = await s3.send(listCommand);

        if (!data.Contents || data.Contents.length === 0) {
            console.log("No commits found in S3.");
            return;
        }

        for (const obj of data.Contents) {
            const key = obj.Key; // Fixed: was 'object.Key'
            
            // Define the local file path
            const localFilePath = path.join(repopath, key);
            
            // Ensure the directory exists locally
            await fs.mkdir(path.dirname(localFilePath), { recursive: true });

            // 3. Create the GetObject command
            const getCommand = new GetObjectCommand({ 
                Bucket: S3_BUCKET, 
                Key: key 
            });

            const response = await s3.send(getCommand);
            
            // 4. In v3, the Body is a stream. We need to convert it to a Buffer/String
            const bodyContents = await response.Body.transformToByteArray();

            await fs.writeFile(localFilePath, bodyContents);
            console.log(`Pulled: ${key}`);
        }
        
        console.log(`All commits pulled from S3 successfully!`);

    } catch (err) {
        console.error("Unable to pull:", err);
    }
}

module.exports = { pullrepo };