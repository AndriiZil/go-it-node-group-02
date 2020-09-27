const [operator, ...numbers] = process.argv.slice(2);

switch(operator) {
    case 'sum':
        console.log(numbers.reduce((acc, cur) => acc + parseFloat(cur), 0));
        break;
    case 'sub':
        console.log(numbers.reduce((acc, cur) => parseInt(acc) - parceFloat(cur)));
        break;
    default:
        throw new Error('Error!');
}