const fs = require("fs").promises;

const path = require("path")


const readdir = fs.readdir;
const copyFile = fs.copyFile;

async function  revertReop(commitId) {
   const repoPath = path.resolve(process.cwd(),".AkGit");
   const commitsPath = path.join(repoPath , "commits");
    
   try {
      const commitdir  = path.join(commitsPath , commitId);
      const files = await readdir(commitdir);
      const parentDir = path.resolve(repoPath ,"..");


      for(const file of files){
         await copyFile(path.join(commitdir , file ),path.join(parentDir, file));
      }

      console.log(`Commited ${commitId} revert Successfully`);
      
   } catch (err) {
      console.log("Unlable to revert" , err);
      
   }
   
}
module.exports = {revertReop}