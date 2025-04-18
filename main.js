let canvas, ctx, canvasContainer, dpi = null;
let radius = 20;

let width = 700;
let height = 350;


document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    canvas.addEventListener('click', handleMouseClick);
    ctx = canvas.getContext('2d');

    canvasContainer = document.getElementById("canvas-container");

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    // canvasContainer.style.width = width + "px";
    // canvasContainter.style.height = height + "px";

    let dpi = window.devicePixelRatio;
    canvas.width = Math.floor(width * dpi);
    canvas.height = Math.floor(height * dpi);
    ctx.scale(dpi, dpi);

    /* for (let i = 0; i <= width; i +=50) {
        for(let j = 0; j <= height; j +=50) {
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.arc(i , j , radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fillText(i + ", " + j, i, j);
  
        }
    } */

    console.log("window loaded");
});

function getCanvasWidth(htmlCanvas) {
    return htmlCanvas.getCanvasWidth;
}

function getCanvasHeight(htmlCanvas) {
    return htmlCanvas.getCanvasHeight; 
    
}

handleMouseClick = (event) => {
    console.log("client x: " + event.clientX + ", client y:" + event.clientY);
    console.log("page x: " + event.pageX + ", page y:" + event.pageY);
    console.log("offset x: " + event.offsetX + ",  y:" + event.offsetY); //use
    console.log("screen x: " + event.screenX + ", screen y:" + event.screenY);
    
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(event.offsetX, event.offsetY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    // ctx.fillText("offset x: " + event.offsetX + ",  y:" + event.offsetY, event.offsetX, event.offsetY);
}


