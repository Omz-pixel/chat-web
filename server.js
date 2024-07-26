const fs = require('fs');
const express = require('express');
const path = require('path');
const http = require('http');
const { URLSearchParams } = require('url');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let users;
let onlineID = [];
let online = [];
let n = 0;

app.use(express.static(__dirname));

// To get form data
app.use(express.urlencoded({ extended: true }));

// Handling sign-up form
app.post('/new-user', (req, res) => {
    console.log(req.body);
    const user_info = req.body;
    user_info.loggedIn = true;
    users = user_info.username;
    const filePath = path.join(__dirname, 'users.json');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log("Found something strange: ", err);
            return res.status(500).json({ message: 'Failed to read file' });
        }
        const users = JSON.parse(data);
        users.push(user_info);
        fs.writeFile(filePath, JSON.stringify(users, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to write file' });
            }
            console.log('User created successfully');
            const urlUser = user_info.username;
            res.redirect(`/user?username=${encodeURIComponent(user_info.username)}`);
        });
    });
});

// Serving the sign-up page
app.get('/', (req, res) => {
    const signUpPage = path.join(__dirname, '/html/home.html');
    console.log(req.url)
    res.setHeader('Content-Type', 'text/html');
    fs.readFile(signUpPage, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server error');
        } else {
            res.end(data);
        }
    });
});

// Serving the chat page
app.get('/user', (req, res) => {
    // const parameter = new URLSearchParams(req.url);
    // const user = parameter.get('username');
    const chatPage = path.join(__dirname, '/html/chat.html');
    // users = user;
    console.log(req.url)
    console.log(users);
    res.setHeader('Content-Type', 'text/html');

    fs.readFile(chatPage, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server error');
        } else {
            console.log("done");
            res.end(data);
        }
    });
});

app.get('/Login_SignUp', (req, res) => {
    const signUpPage = path.join(__dirname, '/html/Login_Sign_Up.html');
    console.log(req.url)
    res.setHeader('Content-Type', 'text/html');
    fs.readFile(signUpPage, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server error');
        } else {
            res.end(data);
        }
    });
});

// For messaging
io.on('connection', (socket) => {
    io.emit('given', users);
    online[n] = users;
    onlineID[n] = socket.id;

    for (var i = 0; i <= n; i++) {
        console.log("Online: ", online[i]);
        io.emit('online', online[i]);
    }

    n++;

    console.log("A new user connected!!  ", socket.id);

    socket.on('send_mssg', (data) => {
        const { sender, receiver, mssg } = data;
        io.emit('new_mssg', data);
        console.log("Message: ", mssg);
        console.log("Sent to: ", receiver);
        console.log("From: ", sender);
    });

    socket.on('disconnect', () => {
        console.log("The user decided to leave! :(", socket.id);
        var many = 0;
        for (var x = 0; x <= n; x++) {
            if (onlineID[x] == socket.id) {
                io.emit("bye", online[x]);
                console.log("Deleted: ", online[x]);
                delete online[x];
                delete onlineID[x];
                many++;
            }
        }
        n -= many;
    });
});

server.listen(9000, '0.0.0.0', () => {
    console.log("Server running on http://localhost:9000");
    console.log("\nListening for new clients...\n");
});
