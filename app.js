var express = require("express");
var bodyParser = require("body-parser");
var twilio = require("twilio");

var app = express();


app.use(bodyParser.urlencoded({extended:true}));

app.set("port", 5100);

var oPlayers = {};

app.use(express.static('www'));

function Player(){
    this.ncount = 0;
    this.botNumber = 0;
    this.guesses=1;
    this.sum = 0;
    
    this.fWelcoming = function(req, twiml){
        twiml.message("Welcome to 'Race To 100'. Enter digit between 1 to 10.\nSum = "+ this.sum );
        this.fCurstate = this.fGuessing;    
    }
    this.fGuessing = function(req, twiml){
    
        if(req.body.Body > 10){
            twiml.message("Too high. Please enter digit between 1 to 10.\nSum = "+ this.sum );
        }
        else if(req.body.Body < 0){
            twiml.message("Too Low. Please enter digit between 1 to 10.\nSum = "+ this.sum );
        }
        else if(req.body.Body > 0 && req.body.Body < 11){
                this.guesses++;
                this.sum = parseInt(this.sum,10) + parseInt(req.body.Body,10) ;
                    if(this.sum >= 100)
                    {

                        twiml.message("Congratulatitions!! You won . you reach to "+ this.sum );
                        this.sum = 0;
                        return;
                    }
                    else
                    {
                        twiml.message("You entered "+ req.body.Body +". Sum = "+ this.sum );
                        this.botNumber = 11;
                        if(this.guesses>5)
                        {
                            this.ncount = 9;
                            while(this.botNumber>10)
                            {
                                this.botNumber = this.ncount*10 + this.ncount+1 - this.sum;
                                if(this.botNumber == 0 || this.botNumber < 0)
                                {
                                    while(this.botNumber < 1 || this.botNumber > 10)
                                        {
                                            this.botNumber = (Math.ceil(Math.random() * 10));
                                        }
                                        break;
                                }
                                this.ncount--;                       
                            }
                        }
                        else
                        {
                            while(this.botNumber < 1 || this.botNumber > 10)
                                {
                                    this.botNumber = (Math.ceil(Math.random() * 10));
                                }
                        }
                        this.sum += this.botNumber ;
                        twiml.message("  Bot entered "+ this.botNumber +".  Sum = "+ this.sum );
                        if(this.sum>=100)
                        {
                            this.sum = 0 ;
                            twiml.message("Bot won!! You missed this time,better luck next time" );
                            return;
                        }
                        
                        twiml.message("  Enter digit between 1 to 10" );
                    }
            
        }else{
            twiml.message("please enter a valid number");  
        }
    }    
    this.fCurstate = this.fWelcoming;
}


app.post('/sms', function(req, res){
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