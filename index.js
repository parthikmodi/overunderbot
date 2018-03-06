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

function Player(){
    this.fWelcoming = function(twiml){
        twiml.message("Welcome. I am thinking of a number between 1 and 100. What do you think it is?");
        this.fCurstate = this.fGuessing;    
    }
    this.fGuessing = function(twiml){
        twiml.message("too high");
    }    
    this.fCurstate = this.fWelcoming;
}


app.post('/', function(req, res){
    var sFrom = req.body.From;
    if(!oPlayers.hasOwnProperty(sFrom)){
        oPlayers[sFrom] = new Player();
    }
    var twiml = new twilio.twiml.MessagingResponse();
    res.writeHead(200, {'Content-Type': 'text/xml'});
    oPlayers[sFrom].fCurstate(twiml);
    var sMessage = twiml.toString();
    res.end(sMessage);
});

var server = app.listen(app.get("port"), function(){
    console.log("Javascript is rocking on port " + app.get("port"));
});