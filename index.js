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
    this.number = (Math.ceil(Math.random() * 100));
    this.fWelcoming = function(req, twiml){
        twiml.message("Welcome. I am thinking of a number between 1 and 100. What do you think it is? ");
        this.fCurstate = this.fGuessing;    
    }
    this.fGuessing = function(req, twiml){
        if(req.body.Body > this.number){
            twiml.message("too high");            
        }else if(req.body.Body == this.number){
            twiml.message("just right. Now I am thinking of another number");
            this.number = (Math.ceil(Math.random() * 100));            
        }else if(req.body.Body < this.number){
            twiml.message("too low");
        }else{
            twiml.message("please enter a valid number");
        }
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
    oPlayers[sFrom].fCurstate(req, twiml);
    var sMessage = twiml.toString();
    res.end(sMessage);
});

var server = app.listen(app.get("port"), function(){
    console.log("Javascript is rocking on port " + app.get("port"));
});