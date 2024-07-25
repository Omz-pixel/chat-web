const fs = require('fs');
const express = require('express');
const path = require('path')
const app = express();
const { get } = require('http');
const { URLSearchParams } = require('url');

let users;
let onlineID = [];
let online = [];
let n = 0;


// Handling responses from various requests
const server = require('http').createServer((req, res) => {
    console.log("Request: ", req.url)
  
    let urlcheck = req.url.includes("/user");
    if(urlcheck){
        
        const parameter = new URLSearchParams(req.url);
        const user = parameter.get('/user');
        users = user;
        console.log(users, user, parameter)
        res.setHeader('Content-Type', 'text/html' );

        fs.readFile('./chat.html', (err, data) => {
            if(err){
                console.log(err);
            }
            else{
                console.log("done")
                res.write(data);
                
                res.end();
            }
        })
    }
    else if(req.url == "/"){
        res.setHeader('Content-Type', 'text/html' );
        const signUpPage = path.join(__dirname, 'Login_Sign_ip.html')
        fs.readFile(signUpPage, (err, data) => {
            if(err){
                console.log(err);
            }
            else{
                res.write(data);
                res.end();
            }
        })
    }
    else if(req.url.includes("/pics"));
    else{
        res.write("Temporary error. Comeback later.");
    }
});


// To get form data
app.use(express.urlencoded({ extended: true }));

app.post('/new-user', (req,res) => {
    console.log(req.body);
    const user_info = req.body;
    const filePath = path.join(__dirname, 'users.json');
    fs.readFile(filePath, (err, data) => {
        if(err){
            console.log("Found something strange: ", err);
            return;
        }
        const users = JSON.parse('data');
        users.push(user_info);
        fs.writeFile(filePath, JSON.stringify(users, null, 4), (err) => {
            if(err){
                return res.status(500).json({ message: 'Failed to write file' });
            }
        });

    })
})

app.listen(9000, '0.0.0.0', () => {
    // console.log("Listening for new users on http://192.168.100.206:9000");
    console.log("Listening for new users on http://localhost:9000");
})




// For messaging
const io = require('socket.io')(server);

io.on('connection', (socket) => {

    io.emit('given', users);
        online[n] = users;
        onlineID[n] = socket.id;
        
        for(var i=0; i<=n; i++){
            console.log("Online: ",online[i]);
            io.emit('online', online[i]);
        }
          
        n++;
        

    

    console.log("A new user connected!!  ", socket.id)
    

    socket.on('send_mssg', (data) => {
        const { sender, receiver, mssg } = data;
        io.emit('new_mssg', data);
        console.log("Message: ", mssg);
        console.log("Sent to: ", receiver);
        console.log("From: ", sender);
    })


    socket.on('disconnect', () => {
        console.log("The user decided to leave! :(", socket.id);
        var many = 0;
        for(var x=0; x<=n; x++){
            if(onlineID[x] == socket.id){
                io.emit("bye", online[x]);
                console.log("Deleted: ", online[x])
                delete online[x];
                delete onlineID[x];
                many++;
            }
        }
        n -= many;
    })
});

server.listen(9000, '0.0.0.0', () => {
    // console.log("Server running on http://192.168.100.206:9000");
    console.log("Server running on http://localhost:9000");
    console.log("\nListening for new clients...\n");
});