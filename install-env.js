const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const dirEnv = path.join(process.cwd(), '/.env');
dotenv.config({path: '.env'});
const contentEnv = 'MONGODB_URI=mongodb://localhost:27017/test \nMAILVERIF=Gmail \nURLVERIF=http://example.com/email-verification/${URL} \nMAILACCOUNT= \nMAILPASS= \nCLIENTID= \nACCESSTOKEN= \nREFRESHTOKEN= \nCLIENTSECRET= \nSECRET_TOKEN=social\nSECRET_KEYCAPTCHA= \nEMAIL_VERIFICATION=false';
try {
  fs.statSync(dirEnv).isFile();
} catch (err) {
  if (err.code === 'ENOENT') {
    if (!process.env.MONGODB_URI) {
      console.log('environment file does not exist, please fulfill the information in the dot env file at the root folder');
      fs.writeFileSync(dirEnv, contentEnv, 'utf8');
    }
  }
} finally {
  console.log('end of the procedure of environment creation');
}
