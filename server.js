const fs = require('fs');
const express = require('express');
const path = require('path');
const http = require('http');
const { URLSearchParams } = require('url');
const socketIO = require('socket.io');
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// let users;
let onlineID = [];
let online = [];
let n = 0;
let id = 0;

app.use(express.static(__dirname));

// To get form data
app.use(express.urlencoded({ extended: true }));

// Use session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

// Handling sign-up form
app.post('/new-user', (req, res) => {
    console.log(req.body);
    const user_info = req.body;
    user_info.loggedIn = true;
    delete user_info.confirm;
    online[n] = user_info.username;
    n++;
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
            req.session.username = user_info.username; // Set session username
            res.redirect(`/user?username=${encodeURIComponent(user_info.username)}`);
            res.end();
        });
    });
});

// Handling login request
app.post('/login', (req, res) => {
    const info = req.body;
    const userDirectory = path.join(__dirname, 'users.json');
    fs.readFile(userDirectory, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
        const Users = JSON.parse(data);
        let found = false;
        for (let i = 0; i < Users.length; i++) {
            if (Users[i].username == info.uname) {
                if (Users[i].password == info.pass) {
                    online[n] = info.uname;
                    n++;
                    req.session.username = info.uname; // Set session username
                    found = true;
                    return res.redirect(`/user?username=${encodeURIComponent(info.uname)}`);
                } else {
                    return res.redirect('/incorrect');
                }
            }
        }
        if (!found) return res.redirect('/not-found');
    });
});

// Middleware to check if user is logged in
function checkAuthenticated(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.redirect('/Login_SignUp');
    }
}

app.get('/incorrect', (req, res) => {
    const resFile = path.join(__dirname, '/html/IncorrectPass.html');
    res.setHeader('Content-Type', 'text/html');
    fs.readFile(resFile, (err, data) => {
        if (err) console.log(err);
        else res.end(data);
    });
});

app.get('/not-found', (req, res) => {
    const resFile = path.join(__dirname, '/html/userNotfound.html');
    res.setHeader('Content-Type', 'text/html');
    fs.readFile(resFile, (err, data) => {
        if (err) console.log(err);
        else res.end(data);
    });
});

// Serving the home page
app.get('/', (req, res) => {
    const signUpPage = path.join(__dirname, '/html/home.html');
    console.log(req.url);
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

// Serving the chat page (authenticated)
app.get('/user', checkAuthenticated, (req, res) => {
    const chatPage = path.join(__dirname, '/html/chat.html');
    console.log(req.url);
    console.log(req.session.username); // Use session username
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

// Redirect to login page
app.get('/Login_SignUp', (req, res) => {
    const signUpPage = path.join(__dirname, '/html/Login_Sign_Up.html');
    console.log(req.url);
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
    // io.emit('given', online[n]);
    // // online[n] = users;
    onlineID[id] = socket.id;
    id++;

    for (var i = 0; i<n; i++) {
        console.log("Online: ", online[i]);
        io.emit('online', online[i]);
    }


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
