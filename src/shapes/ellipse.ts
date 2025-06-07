import { Point } from "./point.js";
import { Shape } from "./shape.js";

export class Ellipse extends Shape {
    private center: Point;
    private width: number;
    private height: number;

    private corner1: Point;
    private corner2: Point;

    constructor(x?: number, y?: number, w?: number, h?: number, strokeStyle?: string, fillStyle?: string, isFill?: boolean) {
        super(strokeStyle, fillStyle, isFill);
        this.center = x && y ? new Point(x, y) : new Point();
        this.width = w ? w : 0;
        this.height = h ? h : 0;

        this.corner1 = new Point();
        this.corner2 = new Point();
    }

    // Setters
    setProperties (x: number, y: number, w: number, h: number) {
        this.center = new Point(x, y);
        this.width = w;
        this.height = h;
    }

    setCenter(x: number, y: number) {
        this.center = new Point(x, y);
    }

    setWidth(w: number) {
        this.width = w;
    }

    setHeight(h: number) {
        this.height = h; 
    }

    setCorner1BoundingBox(x: number, y: number) {
        this.corner1 = new Point(x, y);
    }

    setCorner2BoundingBox(x: number, y: number) {
        this.corner2 = new Point(x, y);
    }

    //Getters
    getCenter(): Point {
        return this.center;
    }

    getCenterX(): number {
        return this.center.getX();
    }

    getCenterY(): number {
        return this.center.getY();
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }


    // functionality
    draw(ctx: CanvasRenderingContext2D) {
        super.draw(
            ctx,
            (ctx: CanvasRenderingContext2D) => {                
                ctx.ellipse(this.center.getX(), this.center.getY(), this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
            }
        ); 
    }

    setEllipseFromBoundingBox(isCircle: boolean) {
        const widthDiff = this.corner2.getX() - this.corner1.getX();
        const heightDiff = this.corner2.getY() - this.corner1.getY();

        const widthDiffAbs = Math.abs(widthDiff);
        const heightDiffAbs = Math.abs(heightDiff);

        if (isCircle) {
            const widthPositivity = widthDiff > 0 ? 1 : -1;
            const heightPositivity = heightDiff > 0 ? 1 : -1; 
            this.center.setPoints(
                this.corner1.getX() + (widthPositivity * heightDiffAbs)/2,
                this.corner1.getY() + (heightPositivity * heightDiffAbs)/2
            );
            
            this.width = heightDiffAbs;
            this.height = heightDiffAbs;
        } else {
            this.center.setPoints(
                (this.corner1.getX() + this.corner2.getX()) / 2,
                (this.corner1.getY() + this.corner2.getY()) / 2,
            );
        
            this.width = widthDiffAbs;
            this.height = heightDiffAbs;
        }
    }

    getShape(): string {
        return 'ellipse';
    }

}