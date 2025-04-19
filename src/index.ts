
const Mode = Object.freeze({
    NONE: 'none',
    DRAW: 'draw',
    ELLIPSE: 'ellipse',
    RECT: 'rect'
});

let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dpi;
let slider;
let radius = 10;

let width = 700;
let height = 350;

function getCanvasWidth(htmlCanvas: HTMLCanvasElement) {
    return htmlCanvas.width;
}

function getCanvasHeight(htmlCanvas: HTMLCanvasElement) {
    return htmlCanvas.height; 
    
}

const handleMouseClick = (e: MouseEvent) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(e.offsetX, e.offsetY, radius, 0, 2 * Math.PI);
    ctx.fill();
}

let currentMode = Mode.DRAW;

let isMouseDown = false;



// let draw = new Path2D();

const handleMouseDown = (event: MouseEvent) => {
    console.log("mouse down");
    isMouseDown = true;
    drawPenStroke(event.offsetX, event.offsetY, radius);
    console.log(event.offsetX + "," + event.offsetY);
}

const handleMouseMove = (e: MouseEvent) => {
    if (isMouseDown) {
        console.log("mouse moving");
        switch (currentMode) {
            case Mode.DRAW: {

                drawPenStroke(e.offsetX, e.offsetY, radius);
            }
        }
        
    }
}

const handleMouseUp = (e: MouseEvent) => {
    console.log("mouse up");
    isMouseDown = false;
}

function drawPenStroke(x: number, y: number, r: number) {
    if (!ctx) return;
    ctx.beginPath()
    ctx.fillStyle = 'red';
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}

// SETUP

function setupSlider()  {
    //Slider Setup
    slider = document.getElementById('slider');
    if (slider !== null) {
        slider.addEventListener('oninput', () => {});
    }
}

function setupCanvas() {
    // Canvas Setup
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    ctx = canvas.getContext('2d')!;
    
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    
    dpi = window.devicePixelRatio;
    
    canvas.width = Math.floor(width * dpi);
    canvas.height = Math.floor(height * dpi);
    ctx.scale(dpi, dpi);
}

const setup = () => {
    console.log("Setting Up");
    setupSlider();
    setupCanvas();

    console.log("window loaded");
            
}

document?.addEventListener('DOMContentLoaded', () => {setup()});


