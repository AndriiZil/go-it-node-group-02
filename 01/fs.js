const fs = require('fs');
const { promises: fsPromises } = fs;

// fs.writeFile('dir/test.txt', 'Test example', (err) => {
//     if (err) {
//         console.log(err);
//     }
// });


// fs.appendFile('dir/test.txt', ' Another text', (err) => {
//     if (err) {
//         console.log(err);
//     }
// });

// fs.readFile('dir/test.txt', 'utf-8', (err, data) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log('DATA:', data);
// });

async function main() {
    try {
        await fsPromises.writeFile('dir/example.txt', 'Simple Example');
        const file = await fsPromises.readFile('dir/example.txt', 'utf-8');
        console.log(file);
    } catch(err) {  
        console.log(err);
    }
}

main();