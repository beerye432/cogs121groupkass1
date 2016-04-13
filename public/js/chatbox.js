var socket = io();

// (function($) {
//     "use strict";
//     /* TODO: Start your Javascript code here */

//     // You may use this for updating new message
//     function messageTemplate(template) {
//         var result = '<div class="user">' +
//             '<div class="user-image">' +
//             '<img src="' + template.user.photo + '" alt="">' +
//             '</div>' +
//             '<div class="user-info">' +
//             '<span class="username">' + template.user.username + '</span><br/>' +
//             '<span class="posted">' + template.posted + '</span>' +
//             '</div>' +
//             '</div>' +
//             '<div class="message-content">' +
//             template.message +
//             '</div>';
//         return result;
//     }
// })($);

$(document).ready(function() {
    onSubmit();
    newsfeed();
});

function onSubmit(){
  $('#send_message').submit(function(){
    socket.emit('newsfeed', $('#user_input').val());
    $('#user_input').val('');
    return false;
  });
}

function newsfeed(){
    socket.on('newsfeed', function(data) {
        var parsedData = JSON.parse(data);
        parsedData.posted = new Date(parsedData.posted);

        $('#messages').prepend($('<li>').html(messageTemplate(parsedData)));

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
    });
}
