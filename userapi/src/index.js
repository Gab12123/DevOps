const express = require('express')
const userRouter = require('./routes/user')
const bodyParser = require('body-parser')
const async = require('async')
const app = express()
const port = process.env.PORT || 3000

const client = require('./dbClient')
client.on("error", (err) => {
  console.error(err)
})
const user = {
  username: 'gabKz',
  firstname: 'Gabrielle',
  lastname: 'Korkmaz'
}

var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.get('/allUsers', (req, res) => {
  client.keys('*',(err, keysUsers)=>{
    if(keysUsers){
      const allUsers = []
      async.map(keysUsers, function(user,callB){
        client.get(user, function(err, result){
          if(err) return console.log(err)
          var userInfo = {}
          userInfo['username'] = user
          userInfo['firstname'] = JSON.parse(result).firstname
          userInfo['lastname'] = JSON.parse(result).lastname
          callB(null, userInfo)
        })
      }, function(error, finalResults){
        if(error) return console.log(error)
        const users= finalResults
        res.render('userslist', {users: users})
      })
    }else{
      res.send('No users')
    }
  })
})

app.post('/addUser', (req, res) => {
  const {username, firstname, lastname} = req.body
  client.set(username, JSON.stringify({
    username : username,
    firstname : firstname,
    lastname: lastname,
  }))
}) 

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/hello.html")
})

app.get('/healthcheck', (req, res) => {
  res.status(200).send('Ok');
});

app.use('/user', userRouter)

const server = app.listen(port, (err) => {
  if (err) throw err
  console.log("Server listening the port " + port)
})

module.exports = server
