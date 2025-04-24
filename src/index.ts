import { Mode } from './constants.js';


let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dpi;
let slider: HTMLInputElement;
let rect: DOMRect;
let radius = 10;

let width = 700;
let height = 350;


function getCanvasWidth(htmlCanvas: HTMLCanvasElement) {
    return htmlCanvas.width;
}

function getCanvasHeight(htmlCanvas: HTMLCanvasElement) {
    return htmlCanvas.height; 
    
}

function getCanvasX(e: MouseEvent) {
    return e.clientX - rect?.x; 
}

function getCanvasY(e: MouseEvent) {
    return e.clientY - rect?.y; 
}

// Handle Mouse Click Events

const handleMouseClick = (e: MouseEvent) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(getCanvasX(e), getCanvasY(e), radius, 0, 2 * Math.PI);
    ctx.fill();
}

let currentMode = Mode.STROKE;
let isMouseDown = false;

const handleMouseDown = (e: MouseEvent) => {
    console.log("mouse down");
    isMouseDown = true;
    // drawPenStroke(event.offsetX, event.offsetY, radius);
    ctx.beginPath();
    ctx.moveTo(getCanvasX(e), getCanvasY(e));
    console.log(getCanvasX(e) + "," + getCanvasY(e));
}

const handleMouseMove = (e: MouseEvent) => {
    if (isMouseDown) {
        console.log("mouse moving");
        switch (currentMode) {
            case Mode.STROKE: {
                console.log(getCanvasX(e) + ', ' + getCanvasY(e));
                // drawPenStroke(getCanvasX(e), getCanvasY(e), radius);
                ctx.lineTo(getCanvasX(e), getCanvasY(e));
            }
        }
        
    }
}

const handleMouseUp = (e: MouseEvent) => {
    console.log("mouse up");
    ctx.stroke();
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
    // Slider Setup
    slider = document.getElementById('slider') as HTMLInputElement;
    slider?.addEventListener('input', () => {
        ctx.lineWidth = +slider.value;
        console.log(radius);
    });
}

function setupCanvas() {
    // Canvas Setup
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    ctx = canvas.getContext('2d')!;
    
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    
    dpi = window.devicePixelRatio;
    
    canvas.width = Math.floor(width * dpi);
    canvas.height = Math.floor(height * dpi);
    ctx.scale(dpi, dpi);

    rect = canvas.getBoundingClientRect();

}

const setup = () => {
    console.log("Setting Up");
    setupSlider();
    setupCanvas();

    console.log("window loaded");
}

document?.addEventListener('DOMContentLoaded', () => {setup()});
document?.addEventListener('mousedown', handleMouseDown);
document?.addEventListener('mousemove', handleMouseMove);
document?.addEventListener('mouseup', handleMouseUp);



