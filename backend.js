const { application } = require('express');
const express = require('express');
const app = express();
const port = 5001;

const users = { 
    users_list :
    [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mac',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       }
    ]
 }

app.use(express.json());

//root
app.get('/', (req, res) => {
    res.send("Hello World!");
});

//get user by name
app.get('/users', (req, res) => {
    const name = req.query.name;
    if(name != undefined)
    {
        let result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
    }
    else
    {
        res.send(users);
    }
});

const findUserByName = (name) =>
{
    return users['users_list'].filter( (user) => user['name'] === name);
}

//get user by id
app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if(result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else
    {
        result = {users_list: result};
        res.send(result);
    }
});

function findUserById(id)
{
    return users['users_list'].find( (user) => user['id'] === id);
    //or return users['users_list'].filter((user) => user['id]===id)
}

//add new user 
app.post('/users', (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.status(200).end();
});

function addUser(user)
{
    users['users_list'].push(user);
}

//delete user by id
app.delete('/users', (req, res) => {
    const idToDel = req.body.id;
    delUserByID(idToDel);
    res.status(200).end();
});

function delUserByID(id)
{
    const index = users['users_list'].findIndex((user) => user.id === id);
    if(index!==-1)
        users['users_list'].splice(index,1);
}


app.listen(port, () => {
    console.log('Example listening at http://localhost:${port}');
});