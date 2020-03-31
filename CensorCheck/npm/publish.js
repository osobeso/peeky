const {exec} = require("child_process");
const fs = require("fs-extra");
const path = require("path");

const outDir = path.join(__dirname, "out");
const outFiles = fs.readdirSync(outDir);
const tgzFile = outFiles.find(x=> x.endsWith(".tgz"));
if(tgzFile){
    const destination = path.join(outDir, tgzFile);
    exec('npm publish ' + destination);
}