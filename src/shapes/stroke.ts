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
        if (this.points.length === 0) {
            return;
        }
        super.draw(
            ctx,
            (ctx: CanvasRenderingContext2D) => {                
                ctx.moveTo(this.points[0].getX(), this.points[0].getY());
                for (var point of this.points) {
                    ctx.lineTo(point.getX(), point.getY());
                }
            }
        ); 

        
    }
}