export abstract class Shape {
    abstract getShape(): string;
    private strokeStyle: string;
    private fillStyle: string;
    private isFill: boolean;

    constructor(strokeStyle?: string, fillStyle?: string, isFill?: boolean) {
        this.strokeStyle = strokeStyle ? strokeStyle : 'none';
        this.fillStyle = fillStyle ? fillStyle : 'red';
        this.isFill = isFill ? isFill: false;
    }
    
    // Getters
    getStrokeStyle() {
        return this.strokeStyle;
    }

    getFillStyle() {
        return this.fillStyle;
    }

    getIsFill() {
        return this.isFill;
    }
    

    draw(ctx: CanvasRenderingContext2D, 
        drawFn?: (ctx: CanvasRenderingContext2D) => void,
        isStroke?: boolean
    ): void {
        console.log("super");
        ctx.save();
        ctx.beginPath();

        if (drawFn) {
            drawFn(ctx);
        } 

        ctx.strokeStyle = this.getStrokeStyle();
        if (this.getIsFill()) {
            ctx.fillStyle = this.getFillStyle();
        }
        ctx.stroke();

        if(isStroke == true) {
            ctx.closePath();
        }
        ctx.restore();
    }
}