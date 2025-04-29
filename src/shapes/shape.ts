export abstract class Shape {
    abstract getShape(): string;
    abstract draw(ctx: CanvasRenderingContext2D): void;
}