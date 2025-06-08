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

let canvasTemp: HTMLCanvasElement, ctxTemp: CanvasRenderingContext2D, dpiTemp;

let radius = 10;

let gradientSquare: HTMLDivElement, hueRect: HTMLDivElement;

let gradientPicker: HTMLDivElement, huePicker: HTMLDivElement;

let hue: number, saturation: number, lightness: number;

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
    
    clearTempCanvas();
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
    currentShape?.draw(ctxTemp);
    addPointerDownUpCallback();
}

const handlePointerUp = (e: PointerEvent) => {
    console.log("mouse up");
    isMouseDown = false;

    const canvasX = getCanvasX(e), canvasY = getCanvasY(e);
    console.log(canvasX + ',' + canvasY);
    console.log(currentMode);
    switch (currentMode) {
        case 'stroke': {
            console.log('stroke');
            console.log(currentShape);
            if (!(currentShape instanceof Stroke)) {
                return;
            }
            ctx.save();
            ctx.fillStyle = 'red';
            currentShape.addPoint(canvasX, canvasY);
            ctx.restore();
            break;

        }
        case 'ellipse': {
            console.log('ellipse x');
            console.log(currentShape);
            if (!(currentShape instanceof Ellipse)) {
                return;
            }
            currentShape.setCorner2BoundingBox(canvasX, canvasY);
            currentShape.setEllipseFromBoundingBox(e.shiftKey);
            break;
        }
        case 'rect': {
            console.log('rect');
            console.log(currentShape);
            if (!(currentShape instanceof Rect)) {
                return;
            }
            currentShape.setCorner2BoundingBox(canvasX, canvasY);
            currentShape.setRectFromBoundingBox(e.shiftKey);
            break;
        }
    }
    clearTempCanvas();
    currentShape?.draw(ctx);
}

function drawPenStroke(x: number, y: number, r: number) {
    if (!ctx) return;
    ctx.beginPath()
    ctx.fillStyle = 'red';
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}


function clearTempCanvas() {
    ctxTemp.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
    
    // Temp Canvas Setup
    canvasTemp = document.getElementById('canvas-temp') as HTMLCanvasElement;
    if (!canvasTemp) return;
    ctxTemp = canvasTemp.getContext('2d')!;
    clearTempCanvas();
    
    canvasTemp.style.width = width + "px";
    canvasTemp.style.height = height + "px";
    
    dpiTemp = window.devicePixelRatio;
    
    canvasTemp.width = Math.floor(width * dpiTemp);
    canvasTemp.height = Math.floor(height * dpiTemp);
    ctxTemp.scale(dpiTemp, dpiTemp);

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

function placeWithinRange(x: number, min: number, max: number): number {
    if (x < min) { 
        return min;
    } else if (x > max) {
        return max;
    } else {
        return x;
    }
}

function placeDiv(top: number, topOffset: number, left: number, leftOffset: number, 
        div: HTMLDivElement, parent: HTMLDivElement) {
    div.style.top = (placeWithinRange(top, parent.offsetTop, parent.offsetTop + parent.offsetHeight) 
        - topOffset) + 'px';
    div.style.left = (placeWithinRange(left, parent.offsetLeft, parent.offsetLeft + parent.offsetWidth) 
        - leftOffset) + 'px';
}

function percent(t: number, v0: number, v1: number): number {
    if ( t - v0 < 0) {
        return 0;
    } else if ( t - v0 > v1 - v0) {
        return 1;
    } else {
        return (t - v0) / (v1 - v0);
    }
}
function setSaturationLightness(top: number, left: number) {
    const value = 1 - percent(top, gradientSquare.offsetTop, gradientSquare.offsetTop + gradientSquare.offsetHeight);
    const hsvSaturation = percent(left, gradientSquare.offsetLeft, gradientSquare.offsetLeft + gradientSquare.offsetWidth);

    lightness = value * (1 - (hsvSaturation / 2));

    if (lightness == 0 || lightness == 100) {
        saturation = 0;
    } else {
        saturation = (value - lightness) / Math.min(lightness, 1 - lightness);
    }
    
    lightness *= 100;
    saturation *= 100;
}

const handleGradientSquarePointerMove = (e: PointerEvent) => {
    setGradientPickerLocationColor(e);
};


function setGradientPickerLocationColor(e: PointerEvent) {
    placeDiv(
        e.clientY, gradientPicker.offsetHeight / 2,
        e.clientX, gradientPicker.offsetWidth / 2, 
        gradientPicker,
        gradientSquare
    );
    setSaturationLightness(e.clientY, e.clientX);
    gradientPicker.style.background = 'hsl(' + Math.round(hue) + 'deg,' 
        + Math.round(saturation) + '%,' + Math.round(lightness) + '%)';
    
    ctx.strokeStyle = gradientPicker.style.background;
}

function handleHueRectPointerMove(e: PointerEvent) {
    setHuePickerLocationColor(e);
}

function setHuePickerLocationColor(e: PointerEvent) {
    placeDiv(
        e.clientY,
        huePicker.offsetHeight / 2,
        hueRect.offsetLeft,
        (huePicker.offsetWidth - huePicker.clientWidth) / 2,
        huePicker,
        hueRect
    );

    hue = percent(e.clientY, hueRect.offsetTop, hueRect.offsetTop + hueRect.offsetHeight) * 360;

    const hueStyle = 'hsl(' + Math.round(hue) + ', 100%, 50%)';

    huePicker.style.background = hueStyle;
    gradientPicker.style.background = 'hsl(' + Math.round(hue) + 'deg,' 
        + Math.round(saturation) + '%,' + Math.round(lightness) + '%)';
    gradientSquare.style.background = 
        'linear-gradient(transparent 0%, hsl(0deg, 0%, 0%) 100%),' + 
        'linear-gradient(to left, transparent 0%, hsl(0deg, 0%, 100%) 100%),' +
        hueStyle;

    ctx.strokeStyle = gradientPicker.style.background;
}

function setupColorPicker() {
    // Set up color
    hue = 0;
    saturation = 100;
    lightness = 50;

    // Set up gradient square
    gradientSquare = document.getElementById('gradient-square') as HTMLDivElement;
    gradientPicker = document.getElementById('gradient-picker') as HTMLDivElement;

    gradientSquare.addEventListener('pointerdown', (e: PointerEvent) => {
        gradientSquare.addEventListener('pointermove', handleGradientSquarePointerMove);         
        setGradientPickerLocationColor(e);        
    });
    
    gradientSquare.addEventListener('pointerup', (e: PointerEvent) => {
        gradientSquare.removeEventListener('pointermove', handleGradientSquarePointerMove); 
        setGradientPickerLocationColor(e);
    })
    
    placeDiv(
        gradientSquare.offsetTop,
        gradientPicker.offsetHeight / 2, 
        gradientSquare.offsetLeft + gradientSquare.clientWidth,
        gradientPicker.offsetWidth / 2, 
        gradientPicker,
        gradientSquare
    );

    // Set up hue rectangle
    hueRect = document.getElementById('hue-rect') as HTMLDivElement;
    huePicker = document.getElementById('hue-picker') as HTMLDivElement;
    
    placeDiv(
        hueRect.offsetTop,
        huePicker.offsetHeight / 2,
        hueRect.offsetLeft,
        (huePicker.offsetWidth - huePicker.clientWidth) / 2,
        huePicker,
        hueRect
    );
    
    hueRect.addEventListener('pointerdown', (e: PointerEvent) => {
        hueRect.addEventListener('pointermove', handleHueRectPointerMove);
        setHuePickerLocationColor(e);
    });

    hueRect.addEventListener('pointerup', (e: PointerEvent) => {
        hueRect.removeEventListener('pointermove', handleHueRectPointerMove);
        setHuePickerLocationColor(e);
    });
}

const setup = () => {
    console.log("Setting Up");
    setupCanvas();
    setupSlider();
    setupStrokeColorElement();
    setupButtons();
    setupColorPicker();

    console.log("window loaded");
}

document?.addEventListener('DOMContentLoaded', () => {setup()});
addPointerDownUpCallback();
document?.addEventListener('pointermove', handlePointerMove);



