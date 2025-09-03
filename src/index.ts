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

let rInputRange: HTMLInputElement, gInputRange: HTMLInputElement, bInputRange: HTMLInputElement;
let rInput: HTMLInputElement, gInput: HTMLInputElement, bInput: HTMLInputElement;

let hInputRange: HTMLInputElement, sInputRange: HTMLInputElement, vInputRange: HTMLInputElement;
let hInput: HTMLInputElement, sInput: HTMLInputElement, vInput: HTMLInputElement;

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
    isMouseDown = true;
    const canvasX = getCanvasX(e), canvasY = getCanvasY(e);
    currentShape = null;
    
    switch (currentMode) {
        case 'stroke': {
            currentShape = new Stroke();
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

    switch (currentMode) {
        case 'stroke': {
            if (!(currentShape instanceof Stroke)) {
                break;
            }
            currentShape.addPoint(canvasX, canvasY);
            break;
        }
        case 'ellipse': {
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
            if (!(currentShape instanceof Rect)) {
                break;
            }

            currentShape.setCorner2BoundingBox(canvasX, canvasY);
            currentShape.setRectFromBoundingBox(e.shiftKey);
            // currentShape.draw(ctx);
            break;
        }
    }
    currentShape?.draw(ctxTemp);
    addPointerDownUpCallback();
}

const handlePointerUp = (e: PointerEvent) => {
    isMouseDown = false;

    const canvasX = getCanvasX(e), canvasY = getCanvasY(e);
    switch (currentMode) {
        case 'stroke': {
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
            if (!(currentShape instanceof Ellipse)) {
                return;
            }
            currentShape.setCorner2BoundingBox(canvasX, canvasY);
            currentShape.setEllipseFromBoundingBox(e.shiftKey);
            break;
        }
        case 'rect': {
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
                button.classList.remove('selected');
                button.classList.add('not-selected');
            }

            function select(button: HTMLDivElement) {
                button.classList.remove('not-selected');
                button.classList.add('selected');
            }
            
            deselect(selectedBtn);
            select(btn);
            selectedBtn = btn;
            currentMode = btn.id;
        });
    }
}

function addPointerDownUpCallback() {
    document?.addEventListener('pointerdown', handlePointerDown);
    document?.addEventListener('pointerup', handlePointerUp);
}
function removePointerDownUpCallBack() {
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

function setGradientPickerBackground() {
    console.log(hue);
    console.log(saturation);
    console.log(lightness);
    gradientPicker.style.background = 'hsl(' + Math.round(hue) + 'deg,' 
        + Math.round(saturation) + '%,' + Math.round(lightness) + '%)';
    console.log(gradientPicker.style.background);
}

function setSaturationLightnessFromGradientBox(top: number, left: number) {
    const value = 1 - percent(top, gradientSquare.offsetTop, gradientSquare.offsetTop + gradientSquare.offsetHeight);
    const hsvSaturation = percent(left, gradientSquare.offsetLeft, gradientSquare.offsetLeft + gradientSquare.offsetWidth);
    setSaturationLightness(value, hsvSaturation);
}

function setSaturationLightness(value: number, hsvSaturation: number) {
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
    setGradientPickerLocationColor(e.clientX, e.clientY);
};


function setGradientPickerFromInput() {
    const xPos = (+sInput.value * gradientSquare.offsetWidth / 100) + gradientSquare.offsetLeft;
    const yPos = (+vInput.value * gradientSquare.offsetHeight / 100) + gradientSquare.offsetTop;
    setGradientPicker(xPos, yPos);
}

function setGradientPicker(xPos: number, yPos:number) {
    placeDiv(
        yPos, gradientPicker.offsetHeight / 2,
        xPos, gradientPicker.offsetWidth / 2, 
        gradientPicker,
        gradientSquare
    );
    setSaturationLightnessFromGradientBox(yPos, xPos);
    setGradientPickerBackground(); 
    ctx.strokeStyle = gradientPicker.style.background;
}


function setGradientPickerLocationColor(xPos: number, yPos: number) {
    setGradientPicker(xPos, yPos);
    
    const newSaturation = (xPos - gradientSquare.offsetLeft) / gradientSquare.offsetWidth;
    const newValue = ((yPos - gradientSquare.offsetTop)) / gradientSquare.offsetHeight; 
    setSaturationInputs(Math.round(newSaturation * 100) + "");
    setValueInputs(Math.round((1 - newValue) * 100) + "");
    
    setRGBSlidersFromHSV(hue, 
        newSaturation,
        newValue);
}

function setSaturationInputs(saturationString: string) {
    sInput.value = saturationString;
    sInputRange.value = sInput.value;
}

function setValueInputs(valueString: string) {
    vInput.value = valueString;
    vInputRange.value = vInput.value;
}

function handleHueRectPointerMove(e: PointerEvent) {
    setHuePickerLocationColor(e.clientY);
}


function setHuePickerLocationColor(yPos: number) {
    placeDiv(
        yPos,
        huePicker.offsetHeight / 2,
        hueRect.offsetLeft,
        (huePicker.offsetWidth - huePicker.clientWidth) / 2,
        huePicker,
        hueRect
    );

    hue = percent(yPos, hueRect.offsetTop, hueRect.offsetTop + hueRect.offsetHeight) * 360;

    const hueStyle = 'hsl(' + Math.round(hue) + ', 100%, 50%)';

    huePicker.style.background = hueStyle;
    setGradientPickerBackground();
    gradientSquare.style.background = 
        'linear-gradient(transparent 0%, hsl(0deg, 0%, 0%) 100%),' + 
        'linear-gradient(to left, transparent 0%, hsl(0deg, 0%, 100%) 100%),' +
        hueStyle;

    ctx.strokeStyle = gradientPicker.style.background;
    setRGBSlidersFromHSV(hue, (+sInput.value) / 100, (+vInput.value) / 100); 
    hInput.value = Math.round(hue) + "";
    hInputRange.value = Math.round(hue) + "";
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
        setGradientPickerLocationColor(e.clientX, e.clientY);
    });
    
    gradientSquare.addEventListener('pointerup', (e: PointerEvent) => {
        gradientSquare.removeEventListener('pointermove', handleGradientSquarePointerMove); 
        setGradientPickerLocationColor(e.clientX, e.clientY);
    });
    
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
        setHuePickerLocationColor(e.clientY);
    });

    hueRect.addEventListener('pointerup', (e: PointerEvent) => {
        hueRect.removeEventListener('pointermove', handleHueRectPointerMove);
        setHuePickerLocationColor(e.clientY);
    });
    
    
}

function setRGB () {
    const rgb = [+rInputRange.value, +gInputRange.value, +bInputRange.value];

    const maxIndex = rgb.reduce((max, x, i, a) => x > a[max] ? i : max, 0);
    
    const rgbPrimeMax = rgb[maxIndex];
    const rgbPrimeMin = Math.min(rgb[0], Math.min(rgb[1], rgb[2]));
   
    const delta = (rgbPrimeMax - rgbPrimeMin);

    switch (delta == 0 ? -1 : maxIndex) {
        case -1: {
            hue = 0;
            break;
        }
        case 0: {
            console.log("case 0");
            var mod = ((rgb[1] - rgb[2]) / delta) % 6;
            if (mod < 0) {
                mod +=6;
                mod %=6;
            }
            hue = 60 * mod;
            break;
        } case 1: { 
            console.log("case 1");
            hue = 60 * (((rgb[2] - rgb[0]) / delta) + 2);
            break;
        } case 2: {
            console.log("case 2");
            hue = 60 * (((rgb[0] - rgb[1]) / delta) + 4);
            break;
        } default: {
            break;
        }
    }
    
    saturation = rgbPrimeMax == 0 ? 0 : 
        delta / rgbPrimeMax;
    console.log(saturation);
    const value = rgbPrimeMax / 255;
    
    // Set hue placement
    placeDiv(
        hueRect.offsetTop + Math.abs(hue) / 360  * hueRect.offsetHeight,
        huePicker.offsetHeight / 2,
        hueRect.offsetLeft,
        (huePicker.offsetWidth - huePicker.clientWidth) / 2,
        huePicker,
        hueRect
    );
    
    const hueStyle = 'hsl(' + Math.round(hue) + ', 100%, 50%)';

    huePicker.style.background = hueStyle;
    gradientSquare.style.background = 
        'linear-gradient(transparent 0%, hsl(0deg, 0%, 0%) 100%),' + 
        'linear-gradient(to left, transparent 0%, hsl(0deg, 0%, 100%) 100%),' +
        hueStyle;
    gradientPicker.style.background = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';

    // Set saturation and value placement
    placeDiv(
        gradientSquare.offsetTop + (1 - value) * gradientSquare.offsetHeight, 
        gradientPicker.offsetHeight / 2, 
        gradientSquare.offsetLeft + (saturation) * gradientSquare.offsetWidth,
        gradientPicker.offsetWidth / 2, 
        gradientPicker,
        gradientSquare
    );
    setHSVSliders(
        Math.round(Math.abs(hue)), 
        Math.round(saturation * 100), 
        Math.round((1 - value) * 100));

    setSaturationLightnessFromGradientBox(gradientPicker.offsetTop, gradientPicker.offsetLeft);
}

function setRGBSlidersFromHSV(h: number, s: number, v: number) {
    const chroma = s * v;
    const x = chroma * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - chroma;
    let rgb: number[] = [0, 0, 0];

    switch(Math.floor(h / 60)) {
        case 0 : {
            rgb = [chroma, x, 0];
            break;
        } case 1 : {
            rgb = [x, chroma, 0];
            break;
        } case 2 : {
            rgb = [0, chroma, x];
            break;
        } case 3 : {
            rgb = [0, x, chroma];
            break;
        } case 4 : {
            rgb = [x, 0, chroma];
            break;
        } case 5 : {
            rgb = [chroma, 0, x];
            break;
        }
    }

    rgb = rgb.map(x => (x + m) * 255);
    
    rInput.value = Math.round(rgb[0]) + "";
    rInputRange.value =  Math.round(rgb[0]) + "";
    gInput.value = Math.round(rgb[1]) + "";
    gInputRange.value =  Math.round(rgb[1]) + "";
    bInput.value = Math.round(rgb[2]) + "";
    bInputRange.value =  Math.round(rgb[2]) + "";
}

function setHSVSliders(h: number, s: number, v:number) {
    hInput.value = Math.round(h) + "";
    sInput.value = Math.round(s) + "";
    vInput.value = Math.round(v) + "";
    
    hInputRange.value = Math.round(h) + "";
    sInputRange.value = Math.round(s) + "";
    vInputRange.value = Math.round(v) + "";

}

function setupColorSliders() {
    rInput = document?.getElementById('r-input') as HTMLInputElement;
    gInput = document?.getElementById('g-input') as HTMLInputElement;
    bInput = document?.getElementById('b-input') as HTMLInputElement;
    hInput = document?.getElementById('h-input') as HTMLInputElement;
    sInput = document?.getElementById('s-input') as HTMLInputElement;
    vInput = document?.getElementById('v-input') as HTMLInputElement;
    
    rInputRange = document?.getElementById('r-input-range') as HTMLInputElement;
    gInputRange = document?.getElementById('g-input-range') as HTMLInputElement;
    bInputRange = document?.getElementById('b-input-range') as HTMLInputElement;
    hInputRange = document?.getElementById('h-input-range') as HTMLInputElement;
    sInputRange = document?.getElementById('s-input-range') as HTMLInputElement;
    vInputRange = document?.getElementById('v-input-range') as HTMLInputElement;

    rInput.value = '255';
    gInput.value = '0';
    bInput.value = '0';
    hInput.value = '0';
    sInput.value = '100';
    vInput.value = '100';
    
    rInputRange.value = '255';
    gInputRange.value = '0';
    bInputRange.value = '0';
    hInputRange.value = '0';
    sInputRange.value = '100';
    vInputRange.value = '100';
    
    // Setup RGB Range and Text Input
    rInputRange.addEventListener('change', () => {
        rInput.value = rInputRange.value;
        setRGB();    
        console.log(saturation);
    });
    gInputRange.addEventListener('change', () => {
        gInput.value = gInputRange.value;
        setRGB();    
    });
    bInputRange.addEventListener('change', () => {
        bInput.value = bInputRange.value;
        setRGB();    
    });
    
    rInput.addEventListener('change', () => {
        rInputRange.value = rInput.value;
        setRGB();    
    });
    gInput.addEventListener('change', () => {
        gInputRange.value = gInput.value;
        setRGB();    
    });
    bInput.addEventListener('change', () => {
        bInputRange.value = bInput.value;
        setRGB();    
    });
    
    // Setup HSV Range and Text Input
    hInputRange.addEventListener('change', () => {
        hInput.value = hInputRange.value;
        setHuePickerLocationColor(
            (+hInput.value * hueRect.offsetHeight / 360) + hueRect.offsetTop);    
    });
    sInputRange.addEventListener('change', () => {
        sInput.value = sInputRange.value;
        setGradientPickerFromInput();  
        setRGBSlidersFromHSV(hue, +sInput.value / 100, +vInput.value / 100);
    });
    vInputRange.addEventListener('change', () => {
        vInput.value = vInputRange.value;
        setGradientPickerFromInput();
        setRGBSlidersFromHSV(hue, +sInput.value / 100, +vInput.value / 100);
    });
    
    hInput.addEventListener('change', () => {
        hInputRange.value = hInput.value;
        setHuePickerLocationColor(
            (+hInput.value * hueRect.offsetHeight / 360) + hueRect.offsetTop);    
    });
    sInput.addEventListener('change', () => {
        sInputRange.value = sInput.value;
        setGradientPickerFromInput();    
        setRGBSlidersFromHSV(hue, +sInput.value / 100, +vInput.value / 100);
    });
    vInput.addEventListener('change', () => {
        vInputRange.value = vInput.value;
        setGradientPickerFromInput(); 
        setRGBSlidersFromHSV(hue, +sInput.value / 100, +vInput.value / 100);
    });
 
}

const setup = () => {
    setupCanvas();
    setupSlider();
    setupButtons();
    setupColorPicker();
    setupColorSliders();

    ctx.strokeStyle = 'hsl(0deg, 100%, 50%)';
}



window?.addEventListener('resize', (event) => {console.log(event)});
document?.addEventListener('DOMContentLoaded', () => {setup()});
addPointerDownUpCallback();
document?.addEventListener('pointermove', handlePointerMove);



