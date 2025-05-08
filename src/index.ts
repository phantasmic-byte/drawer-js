import { Ellipse } from './shapes/ellipse.js';
import { Rect } from './shapes/rect.js';
import { Shape } from './shapes/shape.js';
import { Stroke } from './shapes/stroke.js';

import { Commands } from './commands.js';

let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dpi;
let slider: HTMLInputElement;
let strokeColorElement: HTMLInputElement;
let selectedBtn: HTMLDivElement;
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

function getCanvasX(e: PointerEvent) {
    return e.clientX - rect?.x; 
}

function getCanvasY(e: PointerEvent) {
    return e.clientY - rect?.y; 
}

// Handle Mouse Click Events

const handleMouseClick = (e: PointerEvent) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(getCanvasX(e), getCanvasY(e), radius, 0, 2 * Math.PI);
    ctx.fill();
}

let currentMode: String = 'stroke';

let isShiftPressed = false;
let isMouseDown = false;

let currentShape: Shape | null = null;

const commands = new Commands();

const handlePointerDown = (e: PointerEvent) => {
    console.log("mouse down");
    isMouseDown = true;
    console.log(getCanvasX(e) + "," + getCanvasY(e));

    const canvasX = getCanvasX(e), canvasY = getCanvasY(e);
    currentShape = null;
    
    switch (currentMode) {
        case 'stroke': {
            currentShape = new Stroke();
            console.log(currentShape);
            if (!(currentShape instanceof Stroke)) {
                break;
            }
            currentShape.addPoint(canvasX, canvasY);
            break;
        }
        case 'ellipse': {
            currentShape = new Ellipse();
            if (!(currentShape instanceof Ellipse)) {
                break;
            }
            currentShape.setCorner1BoundingBox(canvasX, canvasY);
            break;
        }
        case 'rect': {
            currentShape = new Rect();
            if (!(currentShape instanceof Rect)) {
                break;
            }

            currentShape.setCorner1BoundingBox(canvasX, canvasY);
            break;
        }
    }

    if (currentShape !== null) {
        commands.addCommand('add', currentShape);
    }
}

const handlePointerMove = (e: PointerEvent) => {
    if (!isMouseDown) {
        return;
    }

    removePointerDownUpCallBack();
    
    clearCanvas();
    const canvasX = getCanvasX(e), canvasY = getCanvasY(e);
    console.log("mouse moving");

    console.log(currentShape);
    console.log(currentMode);
    switch (currentMode) {
        case 'stroke': {
    console.log('stroke');
            if (!(currentShape instanceof Stroke)) {
                break;
            }
            currentShape.addPoint(canvasX, canvasY);
            // ctx.save();
            // ctx.fillStyle = 'red';
            // ctx.strokeStyle = 'none';
            // currentShape.draw(ctx);
            // ctx.restore();
            break;
        }
        case 'ellipse': {
    console.log('ellipse');
            if (!(currentShape instanceof Ellipse)) {
                break;
            }
            const ellipse = currentShape as Ellipse;
            ellipse.setCorner2BoundingBox(canvasX, canvasY);
            ellipse.setEllipseFromBoundingBox(e.shiftKey);
            // ellipse.draw(ctx);
            break;
        }
        case 'rect': {
    console.log('rect');
            if (!(currentShape instanceof Rect)) {
                break;
            }

            currentShape.setCorner2BoundingBox(canvasX, canvasY);
            currentShape.setRectFromBoundingBox(e.shiftKey);
            // currentShape.draw(ctx);
            break;
        }
    }
    console.log("after");
    for (var shape of commands.getShapes()) {
        shape.draw(ctx);
    }
    addPointerDownUpCallback();
}

const handlePointerUp = (e: PointerEvent) => {
    console.log("mouse up");
    isMouseDown = false;

    const canvasX = getCanvasX(e), canvasY = getCanvasY(e);
    console.log(canvasX + ',' + canvasY);
    switch (currentMode) {
        case 'stroke': {
            console.log(currentShape);
            if (!(currentShape instanceof Stroke)) {
                return;
            }
            ctx.save();
            ctx.fillStyle = 'red';
            currentShape.addPoint(canvasX, canvasY);
            // currentShape.draw(ctx);
            // ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
            ctx.restore();

        }
        case 'ellipse': {
            if (!(currentShape instanceof Ellipse)) {
                return;
            }
            currentShape.setCorner2BoundingBox(canvasX, canvasY);
            currentShape.setEllipseFromBoundingBox(e.shiftKey);
            // currentShape.draw(ctx);
        }
        case 'rect': {
            if (!(currentShape instanceof Rect)) {
                return;
            }
            currentShape.setCorner2BoundingBox(canvasX, canvasY);
            currentShape.setRectFromBoundingBox(e.shiftKey);
            // currentShape.draw(ctx);
        }
    }
    for (var shape of commands.getShapes()) {
        shape.draw(ctx);
    }
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
    clearCanvas();
    
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    
    dpi = window.devicePixelRatio;
    
    canvas.width = Math.floor(width * dpi);
    canvas.height = Math.floor(height * dpi);
    ctx.scale(dpi, dpi);

    rect = canvas.getBoundingClientRect();
}

function setupButtons() {
    // Button Setup
    var btns = document.getElementsByClassName('btn') as HTMLCollectionOf<HTMLDivElement>;
    for (let btn of btns) {
        if (btn.id == 'stroke') {
            selectedBtn = btn;
        } 
        btn.addEventListener('click', () => {

            function deselect(button: HTMLDivElement) {
                console.log(button);
                button.classList.remove('selected');
                button.classList.add('not-selected');
            }

            function select(button: HTMLDivElement) {
                console.log(button);
                button.classList.remove('not-selected');
                button.classList.add('selected');
            }
            
            deselect(selectedBtn);
            select(btn);
            currentMode = btn.id;
        });
    }
}

function addPointerDownUpCallback() {
    console.log("adding up down callback");
    document?.addEventListener('pointerdown', handlePointerDown);
    document?.addEventListener('pointerup', handlePointerUp);
}
function removePointerDownUpCallBack() {
    console.log("removing up down callback");
    document?.removeEventListener('pointerdown', handlePointerDown);
    document?.removeEventListener('pointerup', handlePointerUp);
}

const setup = () => {
    console.log("Setting Up");
    setupCanvas();
    setupSlider();
    setupStrokeColorElement();
    setupButtons();

    console.log("window loaded");
}

document?.addEventListener('DOMContentLoaded', () => {setup()});
addPointerDownUpCallback();
document?.addEventListener('pointermove', handlePointerMove);



