import { Shape } from './shapes/shape.js';

export class Commands {
    private shapes: Shape[] = [];
    private commands: string[] = [];
    
    private index = -1;
    private maxIndex = 0;

    addCommand(command: string, shape: Shape) {
        this.index++;

        if (command.length - 1 > this.index) {
            this.commands.push(command);
            this.shapes.push(shape);    
        } else {
            this.commands[this.index] = command;
            this.shapes[this.index] = shape;
        }
        
        this.maxIndex = this.index;
    }

    undoCommand() {
        if (this.maxIndex <= 0 || this.index < 0) return;
        this.index--;
    }

    redoCommand() {
        if (this.index + 1 > this.maxIndex) return;
        this.index++;
    }

    getShapes() {
        return this.shapes;
    }
    
    
}