var stompClint=null;
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(){
    let sock=new SockJS("/server1");
    stompClint=Stomp.over(sock);
    // it is not sending to server for first time connection
    // stompClint.send("/message.addUser",{},JSON.stringify({name:"test",content:"test",type:"CHAT"}));
    stompClint.connect({},onConnected,onerror);
    var message=document.querySelector("#conectMessage");
    message.classList.add("d-none");
}
//create a function to handle errors
function onerror(error){
    console.log(error);
    var message=document.querySelector("#conectMessage");
    message.classList.remove("d-none");
    message.classList.add("alert-danger");
    message.innerHTML="Error occured while connecting to server";
}
function onConnected() {
    $("#name-form").addClass('d-none');
    $("#chat-room").removeClass('d-none');
    stompClint.subscribe("/topic/return-to", onMessageRecived);
    var joinMessage = {
        name: localStorage.getItem("name"),
        type: 'JOIN'
    }
    stompClint.send("/app/message", {}, JSON.stringify(joinMessage));
}

    function sendMessage(){
    let jsonOb = {
        name:localStorage.getItem("name"),
        content:$("#message-value").val(),
        type:'CHAT'
    }
    stompClint.send("/app/message",{},JSON.stringify(jsonOb));
    var message=document.querySelector("#message-value");
    message.value='';
}
function onMessageRecived(payload) {
    var message = JSON.parse(payload.body);
    var messageElement = document.createElement('li');
    console.log("Received message with type:", message);

    if(message.type === 'JOIN') {
        message.content = message.name + ' joined!';
    } else if (message.type === 'LEAVE') {
        message.content = message.name + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.name[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.name);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.name);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);
    messageElement.appendChild(textElement);
    var messageArea = document.querySelector('#messageArea');
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

    function getAvatarColor(messageSender) {
        var hash = 0;
        for (var i = 0; i < messageSender.length; i++) {
            hash = 31 * hash + messageSender.charCodeAt(i);
        }
        var index = Math.abs(hash % colors.length);
        return colors[index];
    }
$(document).ready(e=>{
    $("#login").click(()=>{
        let name = $("#name-value").val();
        localStorage.setItem("name",name);
        $("#card-header").html(`Welcome,<br/><b>${name}</b>`);
        connect();
    })
    $("#send-btn").click(()=>{
        sendMessage();
    })
})