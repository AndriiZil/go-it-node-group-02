const obj = { name: 'Bogdan', age: 35 };

const json = JSON.stringify(obj, null, 2);

const simpleObj = JSON.parse(json);

console.log(json);
console.log(simpleObj);