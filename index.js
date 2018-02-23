var express = require("express");
var bodyParser = require("body-parser");
var twilio = require("twilio");

var app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.set("port", 5100);

var oPlayers = {};

app.get('/', function(req, res){
    res.end("Hello from the chatbot");

});

function fGuessing(req, twiml, oPlayer){
    twiml.message("too high");
}

function fWelcoming(req, twiml, oPlayer){
    twiml.message("Welcome. I am thinking of a number between 1 and 100. What do you think it is?");
    oPlayer.fCurstate = fGuessing;
}

app.post('/', function(req, res){
    var sFrom = req.body.From;
    if(!oPlayers.hasOwnProperty(sFrom)){
        oPlayers[sFrom] = {fCurstate:fWelcoming};
    }
    var twiml = new twilio.twiml.MessagingResponse();
    res.writeHead(200, {'Content-Type': 'text/xml'});
    oPlayers[sFrom].fCurstate(req, twiml, oPlayers[sFrom]);
    var sMessage = twiml.toString();
    res.end(sMessage);
});

var server = app.listen(app.get("port"), function(){
    console.log("Javascript is rocking on port " + app.get("port"));
});