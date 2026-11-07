const fs = require("fs").promises;
const path = require("path");
const { s3, S3_Bucket } = require("../config/aws-config");

async function pullReop() {
  const repoPath = path.resolve(process.cwd(), ".AkGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await s3
      .listObjectsV2({
        Bucket: S3_Bucket,
        Prefix: "commits/",
      })
      .promise();

   const objects = data.Contents;

console.log("S3 Object Keys:", objects.map(obj => obj.Key));

  for (const object of objects) {
  const key = object.Key;

  const parms = {
    Bucket: S3_Bucket,
    Key: key,
  };

  const fileContent = await s3.getObject(parms).promise();

  // Correct local file path
  const filePath = path.join(repoPath, key);

  // Create the parent directory
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Save the file
  await fs.writeFile(filePath, fileContent.Body);

  console.log("File downloaded:", filePath);
}

console.log("Pull successful!");

  } catch (err) {
    console.log("Enable To Pull:", err);
  }
}

module.exports = { pullReop };