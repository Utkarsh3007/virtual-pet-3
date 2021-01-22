var dog, dogy1, dogy2;
var database;
var foodS;
var foodStock;
var feed, addFoo;
var feedtime, lastFed;
var foodObj;

var gameState;
var readState;

var washroomImg;
var gardenImg;
var bedroomImg;

function preload() {
  dogy1 = loadImage("dog1.png");
  dogy2 = loadImage("dog2.png");
 washroomImg=loadImage("Wash Room.png")
 gardenImg=loadImage("Garden.png")
 bedroomImg=loadImage("Bed Room.png")
}

function setup() {
  createCanvas(1000, 500);

  database = firebase.database();

  foodObj = new Food();

  foodStock=database.ref('Food')
  foodStock.on("value",readStock)

  dog = createSprite(800, 220, 150, 150)
  dog.addImage(dogy1);
  dog.scale = 0.15

  feed = createButton("FEED DRAGO")
  feed.position(700, 95)
  feed.mousePressed(feedDog)

  addFoo = createButton("ADD FOOD")
  addFoo.position(800, 95)
  addFoo.mousePressed(addFood)
  
  fedTime = database.ref('fedTime')
  fedTime.on("value", function (data) {
  lastFed = data.val();
  })
readState=database.ref('gameState')
readState.on("value",function (data){
  
})
  
}


function draw() {
  background(46, 139, 87)
   currentTime=hour(); if(currentTime==(lastFed+1)){ update("Playing"); foodObj.garden(); }else if(currentTime==(lastFed+2)){ update("Sleeping"); foodObj.bedroom(); }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){ update("Bathing"); foodObj.washroom(); }else{ update("Hungry"); foodObj.display(); } if(gameState!="Hungry"){ feed.hide(); //addFood.hide();
     dog.remove(); }else{ feed.show(); addFood.show(); dog.addImage(sadDog); }

  fill(255)
  textSize(20);

  if(lastFed>=12){
   text("Last Feed : "+ lastFed%12 + " PM", 350,30); }else if(lastFed==0){ text("Last Feed : 12 AM",350,30); }else{ text("Last Feed : "+ lastFed + " AM", 350,30); }


  foodObj.display();
  drawSprites();
}

function readStock(data) {
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog (){
  dog.addImage(dogy2)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    fedTime:hour()
  })
}
function addFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
database.ref('/').update({
  gameState:state
})
}