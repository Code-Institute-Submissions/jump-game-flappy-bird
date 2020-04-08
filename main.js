// code for selecting the canvas
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");
// game varibles and const
let frames = 0;
const DEGREES = Math.PI/180;
// this code is to load the images for the game
const sprite = new Image();
sprite.src = "img/sprite.png"
// game state
const state = {
    current : 0,
    getReady : 0,
    play : 1,
    gameOver : 2
}
// code to control the start of the game 
cvs.addEventListener("click", function(event){
    switch(state.current){
        case state.getReady:
        state.current = state.play;
        break;
        case state.play:
        Bird.flap();
        break;
        case state.gameOver:
        state.current = state.getReady;
        break;
    }
});


// code for the background
const bg = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height -226,
    dx : 1,

    draw : function draw(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    // this code will allow for the  background to move 
    update : function(){
        if(state.current == state.play){
            this.x = (this.x - this.dx)%(this.w/2)
        }
    }
}
// this code is for showing the floor ground
const fg = {
    sX : 276,
    sY : 0,
    w : 224,
    h : 112,
    x : 0,
    y : cvs.height -112,
    dx : 2,

    draw : function draw(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        
    },
    // this fumction will allow for the floor to move and keep repeating him self over and over so we get the moving effect
    update : function(){
        if(state.current == state.play){
            this.x = (this.x - this.dx)%(this.w/4)
        }
    }
}
// this code id for creating the bird
const Bird = {
    animation : [
        {sX :276 , sY :112 },
        {sX :276 , sY :139 },
        {sX :276 , sY :164 },
        {sX :276 , sY :139 }
    ],
    x : 50,
    y : 150,
    w : 34,
    h : 26,

    frame : 0,
    // this code will allow for the bird to move 
    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation : 0,

    draw : function draw(){
        let bird = this.animation[this.frame];
        ctx.save();
        ctx.translate(this.x, this.y );
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h,  - this.w/2, - this.h/2, this.w, this.h);
        ctx.restore();
    },
    
    flap : function(){
        this.speed =- this.jump;
    },
    update : function(){
        // this code will allow for the bird to flap slowly when teh game state is ready
        this.period = state.current == state.getReady ? 10 : 5 ;
        // this code will icrement the frames by 1 each period
        this.frame += frames%this.period == 0 ? 1 : 0;
        // this code will allow fro the fram to go back to 0 once it reaches 4
        this.frame = this.frame%this.animation.length;
        // this code will check and see if the state is corrent then allow the bird to move 
        if(state.current == state.getReady){
             this.y = 150; //this will reset the possition of the bird after game over 
             this.rotation = 0*DEGREES;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            // this code will allow for the bird to not go pass the floor and stop as soon as it touches it
            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                if(state.current == state.play){
                    state.current = state.gameOver;
                }
            }
            // if code will allow for the bird to fall down when the speed is greater than the jump
            if(this.speed >= this.jump){
                this.rotation = 90*DEGREES;
                this.frame = 1;
                // this code will allow for the illusion that the bird is going up
            }else{
              this.rotation = -25*DEGREES;  
            }
        }
    }
}
// this code is for the get ready measege 
const getReady = {
    sX : 0,
    sY : 280,
    w : 173,
    h : 152,
    x : cvs.width/2 - 173/2,
    y : 80,

    draw : function draw(){
        if(state.current == state.getReady){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
        
    }
}
// this code is for the game over message
const gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : 90,

    draw : function draw(){
        if(state.current == state.gameOver){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
        
    }
}
// this code will be for the pipes
const pipes = {
    position : [],

    top : {
        sX : 553,
        sY : 0,
    },
    bottom : {
        sX : 502,
        sY : 0,
    },
    w : 53,
    h : 400,
    gap : 85,
    maxYPos : -150,
    dx : 2,

    // this code is to draw the pipes 
    draw : function(){
        for(let i = 0; i < this.position.length; ++i){
            let p = this.position[i];
            let topYpos = p.y;
            let bottomYpos = p.y + this.h + this.gap;
        }
    }
}
// function that will allow for the function do draw
function draw(){
    // code to clear the canvas
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    fg.draw();
    Bird.draw();
    getReady.draw();
    gameOver.draw();

};
// code for the function to update
function update(){
    Bird.update();
    fg.update();
    bg.update();
};
// code for the function to loop
function loop(){
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
};
loop();