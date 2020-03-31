const fs = require("fs-extra");
const nbgv = require("nerdbank-gitversioning");
const path = require("path");
const {exec} = require("child_process");


// Non binary needed files from output.
const nonDllFiles = ["CensorCheck.exe", "CensorCheck.runtimeconfig.json", "CensorCheck.deps.json"];

const outDir = path.join(__dirname, "out");
const censorcheckDir = path.join(outDir, "CensorCheck");
const buildDirectory = path.normalize(path.join(__dirname, "..", "bin", "Release"));
const netcoreDir = path.join(buildDirectory, "netcoreapp3.1");
const netcoreFiles = fs.readdirSync(netcoreDir);

// Ensure directories.
fs.ensureDirSync(outDir);
fs.ensureDir(censorcheckDir);

// Loop to copy binaries.
for(let file of netcoreFiles){
    if(file.endsWith("dll") || file.endsWith("pdb") || nonDllFiles.includes(file)){
       fs.copySync(path.join(netcoreDir, file), path.join(censorcheckDir, file));
    }
}

// Copy package.json
fs.copySync(path.join(__dirname,"package.json"), path.join(outDir, "package.json"));
// Set Version
nbgv.setPackageVersion(outDir, ".").then(() => {
// Pack the solution
const packProcess = exec("npm pack ./out");
packProcess.on("exit", ()=>{
    var currentDirFiles = fs.readdirSync(__dirname);
    var tgzFile = currentDirFiles.find(x=> x.endsWith(".tgz"));
    
    if(tgzFile){
        const tgzFilePath = path.join(__dirname, tgzFile);
        const destination = path.join(outDir, tgzFile);
        fs.copySync(tgzFilePath, destination)
        fs.unlinkSync(tgzFilePath);
    }
});
});