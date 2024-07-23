const socket = io('http://localhost:9000');
    let display = document.getElementById("display");

    socket.on('connect', () => {
        console.log("Successfully connected to the server.");
    });

    socket.on('messg', (data) => {
        console.log("Message received.", data);
        display.innerHTML += `<b> ${data} </b><br><br>`;
    });
    
    function send(){
        let mssg = document.getElementById("mssg").value;
        console.log("It works: ", mssg);
        socket.emit('messg', mssg);
        mssg = '';
        event.preventDefault();
    }