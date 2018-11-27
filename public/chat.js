///////////////////// Make connection ///////////////////
// var socket = io.connect('http://localhost:4000');
var socket = io.connect();


////////////////////// Query DOM ////////////////////////
// message
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    send = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    onlineUsersCount = document.getElementById('onlineUsersCount');



///////////////////// Functions /////////////////////////
function amPmClock(date) {
    let hour = date.getHours();
    let minute = date.getMinutes();
    let amPm = hour > 12 ? 'pm' : 'am';
    hour = hour % 12; // convert hour (1 % 12 = 1; 13 % 12 = 1; 12 % 12 = 0)
    hour = hour ? hour : 12; // if hour = 0 (when it is originally 12), reassign the value of 12
    minute = minute < 10 ? '0' + minute : minute;
    return `${hour}:${minute} ${amPm}`;
}

function events(message) {
    feedback.innerHTML += `<p><em>${message}</em></p>`;
}



////////////////////// socket.emit ////////////////////////
// Emit events  
// Send the data to server
socket.emit("onlineUsers", () => {
    users: "Get the number of online users from server";
});

send.addEventListener('click', function () {
    // Handle input data ....
    // Handle empty input errors 
    if (handle.value === "") {
        return handle.setAttribute("placeholder", "Please write your name!");
    }
    if (message.value === "") {
        return message.setAttribute("placeholder", "Message cannot be empty!");
    }
    socket.emit('name', handle.value);
    socket.emit('chat', {
        message: message.value,
        handle: handle.value,
    }); // send message to server
    //hide handle after submit the message
    // handle.style.display = 'none';

    message.setAttribute("placeholder", "Message");
    handle.setAttribute("disabled", true);
    message.value = "";
});

message.addEventListener('keypress', function () {
    socket.emit('typing', handle.value);
})



//////////////////////// socket.on //////////////////////
// Listen for events
socket.on('user.events', (message) => {
    output.innerHTML += `<p><em>${message}</em></p>`;
})
socket.on('name', (name) => {
    output.innerHTML += `<p><em>${name} says Hello!</em></p>`;
})
socket.on('onlineUsersCount', function (data) {
    onlineUsersCount.innerHTML = data;
})
// listen to the 'chat' coming back from the server
socket.on('chat', function (data) {
    let date = amPmClock(new Date());
    feedback.innerHTML = "";
    output.innerHTML += `<p><strong>${data.handle}: </strong>${data.message}<span class="time">${date}</span></p>`;
})

socket.on('typing', function (data) {
    feedback.innerHTML = `<p><em>${data} is typing ...</em></p>`;
})

