/************************************* INITIALISE THINGS WE ARE GOING TO NEED **************************************************/

//Canvas is where all objects are drawn, we need to set its width and height and get its context to draw on it
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var W = canvas.width;
var H = canvas.height;
var ctx = canvas.getContext("2d");

//Add touch and click event listener to the canvas for user interaction
canvas.addEventListener("touchstart", doTouchStart, false);
canvas.addEventListener('touchmove', doTouchMove, false);
canvas.addEventListener("touchend", doTouchEnd, false);
canvas.addEventListener("mousedown", doClickDown, false);
canvas.addEventListener("mousemove", doClickMove, false);
canvas.addEventListener("mouseup", doClickUp, false);

// Array to hold all the information about the particles
var particles = [];

// Array to hold all the information about the attractors
var attractor = [];

// Constants that are involved in calculating the motion of the particles
var CON = 40.0;
var dt = 0.01;
var wall_co = 0.5;
var g = parseFloat($("#gravity-strength").val());
var m = parseFloat($("#particle-mass").val());
var matr = parseFloat($("#attractor-mass").val());


//Add event listeners to the buttons and inputs, now switching to JQuery for demonstration purposes
$("#tab").on("click", toggleMenu);
$("#particle-number").on("change", updateParticles);
$("#particle-mass").on("change", updateParticleMass);
$("#attractor-mass").on("change", updateAttractorMass);
$("#gravity-strength").on("change", updateGravity);
$("button").on("click", startProgram);


/*********************************************************************** MAIN PROGRAM ******************************************************/

// Create some particles
for (var i = 0; i < 200; i++) {

    particles.push(new create_particle(m));

}


//Initially draws particles onto the canvas and then only starts to move them once the spash screen OK button has been pressed
draw();


function main() {

    //Draws particles onto canvas
    draw();

    // Move the particles based on an attractive force between themselves and an attracting souce, which is created when the user clicks or touches the screen
    move()

    //Change colour of the particles depending on their speed
    colour()

    //only loops when the browser is ready to display the next frame, on mobile this saves battery life.
    requestAnimationFrame(main);

}




/******************************************************** FUNCTIONS FOR USER INTERACTION *****************************************************************************/

//Starts the main program
function startProgram() {
    $("#splash").toggle();
    requestAnimationFrame(main);

}

//Define the touch and click functions to extract the coordinates of the event
function doTouchStart(event) {

    event.preventDefault();
    var canvas_x = event.targetTouches[0].pageX;
    var canvas_y = event.targetTouches[0].pageY;
    attractor.push(new create_attractor(canvas_x, canvas_y, matr));

}

function doTouchMove(event) {

    var canvas_x = event.changedTouches[0].pageX;
    var canvas_y = event.changedTouches[0].pageY;
    attractor[0].x = canvas_x;
    attractor[0].y = canvas_y;
    e.preventDefault();
}



function doTouchEnd(event) {


    attractor.pop();

}

function doClickDown(event) {

    var canvas_x = event.pageX;
    var canvas_y = event.pageY;

    attractor.push(new create_attractor(canvas_x, canvas_y, matr));

}

function doClickMove(event) {

    var canvas_x = event.pageX;
    var canvas_y = event.pageY;

    attractor[0].x = canvas_x;
    attractor[0].y = canvas_y;

}


function doClickUp(event) {

    attractor.pop();

}




function toggleMenu() {
    $("#tab").toggleClass("open");
    $("#menu").toggleClass("open");
    $("#tab").find("img").toggle();
}



function updateParticles() {

    var extra = parseFloat($("#particle-number").val()) - particles.length;

    //Removes excess partices
    if (extra < 0) {

        particles.splice(extra, Math.abs(extra));

    }

    //Adds more particles
    else if (extra > 0) {

        for (var i = 0; i < extra; i++) {

            particles.push(new create_particle(m));
        }

    }


}


function updateParticleMass() {

    m = parseFloat($("#particle-mass").val());

    for (var j = 0; j < particles.length; j++) {
        particles[j].mass = m;
    }

}

function updateAttractorMass() {

    matr = parseFloat($("#attractor-mass").val())

        for (var j=0; j<attractor.length; j++){
    attractor[j].mass = matr;}

}

function updateGravity() {

    g = parseFloat($("#gravity-strength").val());

}



/**************************************************** FUNCTIONS FOR OBJECT CREATION AND DESTRUCCTION ****************************************************/





function create_particle(m) {


    //Random position
    this.x = Math.random() * W;
    this.y = Math.random() * H;

    //Random velocity
    this.vx = Math.random() * 20;
    this.vy = Math.random() * 20;

    //Random colors.  
    var r = Math.random() * 255 >>> 0;
    var g = Math.random() * 255 >>> 0;
    var b = Math.random() * 255 >>> 0;
    this.color = "rgba(" + r + ", " + g + ", " + b + ", 1)";

    this.radius = 4.0;
    this.mass = m;


}



function create_attractor(x_pos, y_pos, m) {
    this.x = x_pos;
    this.y = y_pos;
    this.color = "rgba(255,255,255,1)";
    this.mass = m;

}






/**************************************************************** FUNCTIONS FOR DISPLAYING THE OBJECTS *********************************************/

function draw() {
   
    ctx.globalCompositeOperation = "source-over";

    // The first thing is to draw a big black rectangle, i.e the background of the canvas.  
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, W, H);
    
    //This blends the colours together when particles collide
    ctx.globalCompositeOperation = "lighter";


    //Now draw the particles
    for (var j = 0; j < particles.length; j++) {
        var p = particles[j];

        ctx.beginPath();

        //Colouring each particle and drawing it
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, Math.PI * 2, false);
        ctx.fill();



    }

}


//Faster particles get a more red colour, slower get a more blue colour
function colour() {
    for (var j = 0; j < particles.length; j++) {

        var v2 = particles[j].vx * particles[j].vx + particles[j].vy * particles[j].vy;

        var hot = Math.abs(1 - v2 / 10000) * 240 >>> 0;
        particles[j].color = "hsl(" + hot + ",100%,50%)";
    }


}



/************************************************************************* FUNCTIONS FOR MOVING THE PARTICLES *************************************************/

function move() {

    for (var k = 0; k < 10; k++) {

        for (var t = 0; t < particles.length; t++) {
            var p = particles[t];

            //Boundary conditions
            if ((p.x < p.radius && p.vx < 0.0) || (p.x > (W - p.radius) && p.vx > 0.0)) p.vx = -wall_co * p.vx;
            if ((p.y < p.radius && p.vy < 0.0) || (p.y > (H - p.radius) && p.vy > 0.0)) p.vy = -wall_co * p.vy;

            //Leap frog scheme for particle position and velocity
            var Ax = 0.0;
            var Ay = 0.0;
            var Rtemp2;

            // Kick
            /* Attractor */
            for (var j = 0; j < attractor.length; j++) {
                atr = attractor[j];
                Rtemp2 = (atr.x - p.x) * (atr.x - p.x) + (atr.y - p.y) * (atr.y - p.y);
                Ax += CON * (atr.mass) / Rtemp2 * (atr.x - p.x);
                Ay += CON * (atr.mass) / Rtemp2 * (atr.y - p.y);
            }

            /* Self-gravity */
            if (m > 0) {
                for (var j = 0; j < particles.length && j != t; j++) {
                    part = particles[j];
                    Rtemp2 = (part.x - p.x) * (part.x - p.x) + (part.y - p.y) * (part.y - p.y);
                    Ax += CON * (part.mass) / Rtemp2 * (part.x - p.x);
                    Ay += CON * (part.mass) / Rtemp2 * (part.y - p.y);
                }
            }

            /* Gravity */
            Ay += g;


            p.vx += dt * 0.5 * Ax;
            p.vy += dt * 0.5 * Ay;


            // Push
            p.x += dt * p.vx;
            p.y += dt * p.vy;




            Ax = 0.0;
            Ay = 0.0;

            // Kick
            /* Attractor */
            for (var j = 0; j < attractor.length; j++) {
                atr = attractor[j];
                Rtemp2 = (atr.x - p.x) * (atr.x - p.x) + (atr.y - p.y) * (atr.y - p.y);
                Ax += CON * (atr.mass) / Rtemp2 * (atr.x - p.x);
                Ay += CON * (atr.mass) / Rtemp2 * (atr.y - p.y);
            }

            /* Self-gravity */
            if (m > 0) {
                for (var j = 0; j < particles.length && j != t; j++) {
                    part = particles[j];
                    Rtemp2 = (part.x - p.x) * (part.x - p.x) + (part.y - p.y) * (part.y - p.y);
                    Ax += CON * (part.mass) / Rtemp2 * (part.x - p.x);
                    Ay += CON * (part.mass) / Rtemp2 * (part.y - p.y);
                }
            }

            /* Gravity */
            Ay += g;


            p.vx += dt * 0.5 * Ax;
            p.vy += dt * 0.5 * Ay;


        }
    }
}