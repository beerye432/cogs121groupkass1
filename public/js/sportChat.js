var socket = io();
$(document).ready(function() {
    const sportName = getParameterByName("id");
    if(sportName == "ultimate_frisbee"){
        $("#sport").html("frisbee");
    } else {
        $("#sport").html(sportName);
    }
	getChatHistory();
    getFacilities();
    onSubmit();
    newsfeed();
});

function onSubmit(){
  $('#send_message').submit(function(){

    var url = window.location.href;

    console.log($('#user_input').val().length);

    if($('#user_input').val().length == 0 || $('#user_input').val().length > 140){
        alert("Please make your message between 0 and 140 characters");

        window.location.href = url;
    }
    else{
      	console.log(getParameterByName("id"));
        socket.emit(getParameterByName("id"), $('#user_input').val());
    }

    var height = 0;

    $('#messages li').each(function(i, value){
        height += parseInt($(this).height());
    });

    height += '';

    $('#messages').animate({scrollTop: height});

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

function getFacilities(){
    $.get( "/getFacilities?id="+getParameterByName("id"), function(results) {
        for(var i=0; i<results["facilities"].length; i++){ //id and facility array should be same size
            $('#facilities').append($('<li>').html(facilityTemplate(results, i)));
        }
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

function facilityTemplate(result, index){
    var template =  '<div class = "facButton">'+
        '<a class = "facButtonAnchor" href = "/fac?id='+result["ids"][index]+'" class="facLink">'+
        '<img src="'+result["facilities"][index].pic+'" height="120" width="85%"" class = "img">' +
        '<p class="facName">'+result["facilities"][index].name+'</p>'+
        '</a>'+
        '</div>';
    return template;
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