const fs = require("fs").promises;
 const path = require("path");
 const {s3 , S3_Bucket} = require("../config/aws-config")


async function  pushReop() {

   const repoPath = path.resolve(process.cwd(), ".AkGit")
   const commitsPath = path.join(repoPath , "commits")
  try {
   const commitDirs = await fs.readdir(commitsPath);
   for(const commitDir of commitDirs){
      const commitPath = path.join(commitsPath , commitDir);
      const files = await fs.readdir(commitPath) ;

       for(const file of files ){
         const  filePath = path.join(commitPath , file);
         const fileContent = await fs.readFile(filePath);

         const parems = {
            Bucket :S3_Bucket,
            Key : `commits/${commitDir}/${file}`,
            Body:fileContent,
         }
           await s3.upload(parems).promise();
       }
   }
     console.log("All Commit Push to S3.");
     
  } catch (err) {
   console.log("Error pushing To S3" ,err);
   
  }
}
module.exports = {pushReop}