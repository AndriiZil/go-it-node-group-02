const yargs = require('yargs');

const users = [
    { id: 1, name: 'Jane', surname: 'j' },
    { id: 2, name: 'Mike' , surname: 'm' }
];

const arg = yargs
    .number('id')
    .string('name')
    .string('surname')
    .alias('name', 'n')
    .alias('surname', 's').argv

console.log('ARG', arg)

function checkField(fieldName, user) {
    return !(arg[fieldName] && arg[fieldName] !== user[fieldName])
}

const foundUser = users.filter(user => {
    return (
        checkField('id', user) &&
        checkField('name', user) &&
        checkField('surname', user)
    )
});

console.log(foundUser);
