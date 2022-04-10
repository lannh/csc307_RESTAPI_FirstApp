const { application } = require('express');
const express = require('express');
const app = express();
const port = 5001;
const cors = require('cors');

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

 const lengthID = 6;

app.use(cors());

app.use(express.json());

function idGenerator()
{
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    let n = chars.length;
    let newId = "";
    let i;

    for(i=0; i<Math.floor(lengthID/2); ++i)
    {
        newId += chars.charAt(Math.floor(Math.random() * n));
    }

    n = digits.length;
    for(i; i<lengthID; ++i)
    {
        newId += digits.charAt(Math.floor(Math.random() * n));
    }
    
    return newId;
}


//root
app.get('/', (req, res) => {
    res.send("Hello World!");
});

//get user by name or name && job
app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    if(name != undefined)
    {
        let result;

        if(job != undefined)
            result = findUserByNameNJob(name, job);
        else
            result = findUserByName(name);

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

const findUserByNameNJob = (name, job) =>
{
    return users['users_list'].filter( (user) => user['name'] === name && 
            user['job'] === job);
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
    //or return users['users_list'].filter((user) => user['id']===id)
}

//add new user 
app.post('/users', (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.status(201).send(userToAdd).end();
});

function addUser(user)
{
    let result;

    //generate id until found a unique id
    do {
        user.id = idGenerator()  
        result = findUserById(user.id);
    } while(result !== undefined && result.length !== 0);

    users['users_list'].push(user);
}

//delete user by id
app.delete('/users/:id', (req, res) => {
    const idToDel = req.params.id;
    let foundIndex = delUserByID(idToDel);

    if(foundIndex === -1)
        res.status(404).send('resource not found').end();
    else
        res.status(204).end();
});

function delUserByID(id)
{
    const index = users['users_list'].findIndex((user) => user['id'] === id);
    if(index!==-1)
        users['users_list'].splice(index,1);
    return index;
}

app.listen(port, () => {
    console.log('Example listening at http://localhost:${port}');
});

