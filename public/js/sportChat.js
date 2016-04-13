var socket = io();
$(document).ready(function() {
	getChatHistory();
    onSubmit();
    newsfeed();
});

function onSubmit(){
  $('#send_message').submit(function(){
  	console.log(getParameterByName("id"));
    socket.emit(getParameterByName("id"), $('#user_input').val());
    $('#user_input').val('');
    return false;
  });
}

function newsfeed(){
	console.log("newsfeed: "+getParameterByName("id"));
    socket.on(getParameterByName("id"), function(data) {
        var parsedData = JSON.parse(data);
        parsedData.posted = new Date(parsedData.posted);

        $('#messages').append($('<li>').html(messageTemplate(parsedData)));
    });
}

function getChatHistory(){
	$.get( "/getChat?id="+getParameterByName("id"), function(results) {
		results.forEach(function(result){
			$('#messages').append($('<li>').html(messageTemplate(result)));
		});
	});
}

function messageTemplate(template) {
  var result = '<div class="user">' +
    '<div class="user-image">' +
    '<img src="' + template.user.photo + '" alt="">' +
    '</div>' +
    '<div class="user-info">' +
    '<span class="username">' + template.user.displayName + '</span><br/>' +
    '<span class="posted">' + template.posted + '</span>' +
    '</div>' +
    '</div>' +
    '<div class="message-content">' +
    template.message +
    '</div>';
  return result;
}


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}