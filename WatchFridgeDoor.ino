int sensorPin = A0; // photosensor connects between A0 and VCC, resistor of 10k connects between A0 and ground
int sensorValue = 0; 
int open = false;
int lastOpen = false;
    
void setup() {
  // put your setup code here, to run once:
  //Serial.begin(57600);  
  Bean.enableConfigSave(false);
  //Bean.enableWakeOnConnect(true);
  //Bean.setAdvertisingInterval(100);
}

void loop() {

  sensorValue = analogRead(sensorPin);
  if(sensorValue > 100) { // Door opened
    open = true;
    if(lastOpen != open){
      Bean.setBeaconParameters(0x0666,0x0001,0x0001);
      //Serial.println("open");
    }
    
  }
  else { // Door closed
    open = false;
    if(lastOpen != open){
      Bean.setBeaconParameters(0x0666,0x0000,0x0000);
      //Serial.println("closed");
    }
  }
  lastOpen = open;
  //Serial.println(sensorValue);
  Bean.sleep(500);
}
