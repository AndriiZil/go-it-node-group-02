const path = require('path');
const { promises: fsPromises } = require('fs');

async function main() {
    console.log(__dirname);
    const pathToJson = path.join(__dirname, '../example.json');
    console.log(pathToJson);
    const file = await fsPromises.readFile(pathToJson, 'utf-8');
    console.log('File:', file);
}

main();
