var Bleacon = require('bleacon');

var pubnub = require("pubnub")({
    ssl           : true,  
    publish_key   : "xxx",
    subscribe_key : "sub-c-904b9d38-36a3-11e6-ac64-0619f8945a4f"
});

var datenow = new Date();
Bleacon.startScanning("a4950666c5b14b44b5121370f02d74de");

var output = "";
var count = 0;
var vorige=0, laatste = 0;

Bleacon.on('discover', function(bleacon) {
  
  var date = new Date().format();
  count++;
  output = count + " - " + date + " - " + bleacon.uuid + " - " + bleacon.minor + " "+ bleacon.proximity+" "+ bleacon.accuracy+" " + bleacon.measuredPower +" " + bleacon.rssi ;
	console.log(output);

    vorige = laatste;
    laatste = bleacon.minor;
    if(laatste != vorige){
      if(laatste == 1){
          var date = new Date().format();
          var message = { "Timestamp" : date, "Fridge door": "open"};
      }
      else {
          var date = new Date().format();
          var message = { "Timestamp" : date, "Fridge door": "closed"};
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

