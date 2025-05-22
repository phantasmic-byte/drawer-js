import { Point } from './point.js';
import { Shape } from './shape.js';



export class Stroke extends Shape {
    private points: Point[];

    private numBetween: number = 10;

    constructor(strokeStyle?: string, fillStyle?: string, isFill?: boolean) {
        super(strokeStyle, fillStyle, isFill);
        this.points = [];
    }

    getShape(): string {
        return 'stroke';
    }

    addPoint(x: number, y: number){
        this.points.push(new Point(x, y));
    }

    getPoints() {
        return this.points;
    }

    draw(ctx: CanvasRenderingContext2D) {
        console.log(this.points);
        if (this.points.length === 0) {
            return;
        }

        
        ctx.beginPath();
        ctx.moveTo(this.points[0].getX(), this.points[0].getY());
        // var prev: Point | null = null;
        for (var point of this.points) {
            ctx.lineTo(point.getX(), point.getY());
        }
        ctx.stroke();
        ctx.closePath();

    }
}