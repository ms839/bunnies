let rabbits = []; //array for the rabbits
let initPop = 10; //initial population
let season = 1;
let advance, clear;
let territory = 50; //distance to mate and survey

function setup() {
  createCanvas(1000, 600);
  //create the rabbits
  for (let i = 0; i < initPop; i++) {
    let l = createVector(random(0, width), random(0, height));
    rabbits.push(new Rabbit(l));
  }

  noLoop();
  advance = createButton("next season");
  advance.position(windowWidth - 110, 20);
  advance.mousePressed(advanceSeason);
  clear = createButton("reset");
  clear.position(windowWidth - 210, 20);
  clear.mousePressed(remake);
}

function draw() {
  background(161, 255, 138);
  //draw each rabbit and check for mates 
  for (let r of rabbits) {
    r.display();
    let mateFound = r.checkForMates(rabbits); //null if no mate found
    //print(litterLocation);
    if (mateFound) {
      //mate found, make babies
      //liter size 3 to 8
      var litterSize = floor(random(3, 9));
      for(let i = 0; i < litterSize; i++){
        let l = createVector(random(r.location.x-territory/2, r.location.x+territory/2), random(r.location.y-territory/2, r.location.y+territory/2));
        rabbits.push(new Rabbit(l)); 
      }
    }
  }

  fill(255);
  rect(0, 0, 120, 70);
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(12);
  text("season: " + season, 20, 20);
  text("population: " + rabbits.length, 20, 40);
}

function advanceSeason() {
  season++;
  reset(); //reset rabbits 
  redraw();
}

//rabbit, consructor
function Rabbit(loc) {
  this.sex = Math.random() < 0.5 ? "f" : "m";
  this.size = 20; //start size
  this.location = loc; //start loc 
  this.canMate = false; //false when born,
  this.age = 0;

  this.display();
}

Rabbit.prototype.display = function() {
  textSize(this.size);
  noStroke();
  this.sex == "m" ? fill("cornflowerblue") : fill("pink");
  circle(this.location.x, this.location.y, this.size);
  textAlign(CENTER, CENTER);
  text("🐰", this.location.x, this.location.y);
}

Rabbit.prototype.checkForMates = function(mates) {
    //loop through mates, see if distance is less than mating proximity
    if (this.canMate) { //make sure you can mate
      for (let m of mates) {
        if (m != this && m.canMate) { //don't check your self, and m can mate 
          let distance = p5.Vector.dist(this.location, m.location);
          let match = this.sex != m.sex; //boys can do girls
          if (distance <= territory && match) {
            print("mate found");
            print(this);
            print(m);
            if (this.sex == "f") this.canMate = false;
            if (m.sex == "f") m.canMate = false;
            return true;
          }
        }
      }
    }

    return false;
  }

//sets up a new season
function reset() {
  //loop through rabbits
  //place rabbits randomly in canvas
  //set all randoms to mate = true;
  for (let r of rabbits) {
    r.location = createVector(random(0, width), random(0, height));
    r.age++;
    r.canMate = true;
    r.size = 40;
  }
   
  //kill the old rabbits
  /*
  for(let i = rabbits.length-1; i >= 0; i--){
    if(rabbits[i].age > 10){
      //rabbit ha
      rabbits.splice(i, 1);
    }
  }
  */
}

//starts over
function remake() {
  rabbits = [];
  season = 1;
  for (let i = 0; i < initPop; i++) {
    let l = createVector(random(0, width), random(0, height));
    rabbits.push(new Rabbit(l));
  }
  redraw();
}
