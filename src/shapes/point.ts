export class Point {
    private x;
    private y;

    constructor (x?: number, y?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }

    getPoints(): number[] {
        return [this.x, this.y];
    }
    
    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    setPoints(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}