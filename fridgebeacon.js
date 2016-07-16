var Bleacon = require('bleacon');

var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "pub-c-3df44b26-e4ee-4453-a1c6-7cebfff635da",
    subscribe_key : "sub-c-904b9d38-36a3-11e6-ac64-0619f8945a4f"
});

var Client = require('node-rest-client').Client;
var client = new Client();

//var fs = require('fs');
var datenow = new Date();
//var wstream = fs.createWriteStream('myOutput'+datenow+'.txt'); 

// a4950001c5b14b44b5121370f02d74de
//Bleacon.startScanning("a4950003c5b14b44b5121370f02d74de");
Bleacon.startScanning("a4950666c5b14b44b5121370f02d74de");
//Bleacon.startScanning();
var output = "";
var count = 0;
var vorige=0, laatste = 0;

Bleacon.on('discover', function(bleacon) {
  
  var date = new Date().format();
  count++;
  output = count + " - " + date + " - " + bleacon.uuid + " - " + bleacon.major + " - " + bleacon.minor + " "+ bleacon.proximity+" "+ bleacon.accuracy+" " + bleacon.measuredPower +" " + bleacon.rssi ;
	console.log(output);
  //wstream.write(date + " - " + bleacon.minor + " "+ bleacon.proximity+" "+ bleacon.accuracy+" " + bleacon.measuredPower +" " + bleacon.rssi +"\n");
  
  //if(bleacon.uuid=="a4950002c5b14b44b5121370f02d74de"){
    vorige = laatste;
    laatste = bleacon.minor;
    if(laatste != vorige){
      if(laatste == 1){
          var date = new Date().format();
          var message = { "Timestamp" : date, "Battery" : bleacon.major/100, "Status": "Open","Fridge door": 1};
      }
      else {
          var date = new Date().format();
          var message = { "Timestamp" : date, "Battery" : bleacon.major/100, "Status": "Closed","Fridge door": 0};
      }
          console.log("About to publish to PubNub:",message);
          pubnub.publish({
            channel   : "fridge",
            message   : message,
            callback  : function(e) { 
              console.log( "SUCCESS!", e );
            },
            error     : function(e) { 
              console.log( "FAILED! RETRY PUBLISH!", e );
            }
          });
    }
  //}


});

Date.prototype.format = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); 
   var dd  = this.getDate().toString();
   var hrs = this.getHours().toString();
   var mins = this.getMinutes().toString();
   var secs = this.getSeconds().toString();
   var msecs = this.getMilliseconds().toString();

   //return (dd[1]?dd:"0"+dd[0])+"/"+(mm[1]?mm:"0"+mm[0])+"/"+yyyy+" "+(hrs[1]?hrs:"0"+hrs[0])+":"+(mins[1]?mins:"0"+mins[0])+" ("+secs+","+msecs+")";
   return (dd[1]?dd:"0"+dd[0])+"/"+(mm[1]?mm:"0"+mm[0])+"/"+yyyy+" "+(hrs[1]?hrs:"0"+hrs[0])+":"+(mins[1]?mins:"0"+mins[0]);
  };

