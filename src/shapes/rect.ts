import { Point } from "./point.js";
import { Shape } from "./shape.js";

export class Rect extends Shape {
    private leftCorner: Point;
    private width: number;
    private height: number;

    private corner1: Point;
    private corner2: Point;

    constructor(x?: number, y?: number, w?: number, h?: number) {
        super();
        this.leftCorner = x && y ? new Point(x, y) : new Point();
        this.width = w ? w : 0;
        this.height = h ? h : 0;

        this.corner1 = x && y ? new Point(x, y) : new Point();
        this.corner2 = x && y && w && h 
            ? new Point(x + w, y + h) : new Point();
    }

    // Setters
    setProperties (x: number, y: number, w: number, h: number) {
        this.leftCorner = new Point(x, y);
        this.width = w;
        this.height = h;
    }

    setLeftCorner(x: number, y: number) {
        this.leftCorner = new Point(x, y);
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
    getLeftCorner(): Point {
        return this.leftCorner;
    }

    getLeftCornerX(): number {
        return this.leftCorner.getX();
    }

    getLeftCornerY(): number {
        return this.leftCorner.getY();
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }


    // functionality
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        console.log(this.leftCorner.getX() + "," + this.leftCorner.getY() + "," + this.width + "," + this.height);
        ctx.rect(this.leftCorner.getX(), this.leftCorner.getY(), this.width, this.height);
        ctx.stroke();
    }

    setRectFromBoundingBox(isSquare: boolean) {
        const widthDiff = this.corner2.getX() - this.corner1.getX();
        const heightDiff = this.corner2.getY() - this.corner1.getY();

        const widthDiffAbs = Math.abs(widthDiff);
        const heightDiffAbs = Math.abs(heightDiff);

        if (isSquare) {
            const widthPositivity = widthDiff > 0 ? 1 : -1;
            const heightPositivity = heightDiff > 0 ? 1 : -1;
            
            this.corner2.setPoints(
                this.corner1.getX() + (widthPositivity * heightDiffAbs),
                this.corner1.getY() + (heightPositivity * heightDiffAbs)
            )

            this.width = heightDiffAbs;
            this.height = heightDiffAbs;
        } else {
            this.width = widthDiffAbs;
            this.height = heightDiffAbs;
        }

        this.leftCorner.setPoints(
            Math.min(this.corner1.getX(), this.corner2.getX()),
            Math.min(this.corner1.getY(), this.corner2.getY())
        );
    }

    getShape(): string {
        return 'rect';
    }

}