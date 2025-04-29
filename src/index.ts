import { Ellipse } from './shapes/ellipse.js';
import { Rect } from './shapes/rect.js';
import { Shape } from './shapes/shape.js';

let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dpi;
let slider: HTMLInputElement;
let strokeColorElement: HTMLInputElement;
let rect: DOMRect;
let radius = 10;

let width = 700;
let height = 350;

let strokeColor = '#FF0000'


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

let currentMode: String = 'rect';

let isShiftPressed = false;
let isMouseDown = false;

let currentShape: Shape;

const handleMouseDown = (e: MouseEvent) => {
    console.log("mouse down");
    isMouseDown = true;
    ctx.beginPath();
    console.log(getCanvasX(e) + "," + getCanvasY(e));

    const canvasX = getCanvasX(e), canvasY = getCanvasY(e);
    
    switch (currentMode) {
        case 'stroke': {
            ctx.moveTo(canvasX, canvasY);
            // drawPenStroke(event.offsetX, event.offsetY, radius);
        }
        case 'ellipse': {
            currentShape = new Ellipse();
            if (!(currentShape instanceof Ellipse)) {
                return;
            }
            currentShape.setCorner1BoundingBox(canvasX, canvasY);
        }
        case 'rect': {
            currentShape = new Rect();
            if (!(currentShape instanceof Rect)) {
                return;
            }

            currentShape.setCorner1BoundingBox(canvasX, canvasY);
        }
    }
}

const handleMouseMove = (e: MouseEvent) => {
    if (!isMouseDown) {
        return;
    }
    
    const canvasX = getCanvasX(e), canvasY = getCanvasY(e);
    console.log("mouse moving");
    switch (currentMode) {
        case 'stroke': {
            console.log(canvasX + ', ' + canvasY);
            // drawPenStroke(getCanvasX(e), getCanvasY(e), radius);
            ctx.lineTo(canvasX, canvasY);
        }
    }
}

const handleMouseUp = (e: MouseEvent) => {
    console.log("mouse up");
    isMouseDown = false;

    const canvasX = getCanvasX(e), canvasY = getCanvasY(e);
    console.log(canvasX + ',' + canvasY);
    switch (currentMode) {
        case 'ellipse': {
            if (!(currentShape instanceof Ellipse)) {
                return;
            }
            currentShape.setCorner2BoundingBox(canvasX, canvasY);
            currentShape.setEllipseFromBoundingBox(e.shiftKey);
            currentShape.draw(ctx);
        }
        case 'rect': {
            if (!(currentShape instanceof Rect)) {
                return;
            }
            currentShape.setCorner2BoundingBox(canvasX, canvasY);
            currentShape.setRectFromBoundingBox(e.shiftKey);
            currentShape.draw(ctx);
        }
    }
    ctx.stroke();
}

function drawPenStroke(x: number, y: number, r: number) {
    if (!ctx) return;
    ctx.beginPath()
    ctx.fillStyle = 'red';
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}


function clearCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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

function setupStrokeColorElement() {
    strokeColorElement = document.getElementById('stroke-color') as HTMLInputElement;
    strokeColorElement.value = strokeColor;
    ctx.strokeStyle = 'red';
    strokeColorElement?.addEventListener('input', () => {
        ctx.strokeStyle = strokeColorElement.value;
    })
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
    setupCanvas();
    setupSlider();
    setupStrokeColorElement();

    console.log("window loaded");
}

document?.addEventListener('DOMContentLoaded', () => {setup()});
document?.addEventListener('mousedown', handleMouseDown);
document?.addEventListener('mousemove', handleMouseMove);
document?.addEventListener('mouseup', handleMouseUp);
document?.addEventListener('keydown', handleKeyDown);
document?.addEventListener('keyup', handleKeyUp);



