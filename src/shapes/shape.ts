export abstract class Shape {
    abstract getShape(): string;
    abstract draw(ctx: CanvasRenderingContext2D): void;
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
}