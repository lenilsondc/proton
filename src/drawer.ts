class Coord {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {

        this.x = x;
        this.y = y;
    }

    public diff(coord: Coord): Coord {
        return new Coord(this.x - coord.x, this.y - coord.y);
    }

    public add(coord: Coord): Coord {
        return new Coord(this.x + coord.x, this.y + coord.y);
    }

    public compareTo(coord: Coord): number {
        return this.x - coord.x + this.y - coord.y;
    }
}

abstract class Graphic {

    public position: Coord;
    public anchor: Coord;

    public width: number;
    public height: number;

    constructor(position: Coord = new Coord(), anchor: Coord = new Coord()) {

        this.position = position;
        this.anchor = anchor;
    }

    public moveTo(position: Coord) {
        let offsetCoord = position.diff(this.anchor);

        this.anchor.add(offsetCoord);

        this.position = position;
    }

    public abstract draw(context: CanvasRenderingContext2D): void;
    public abstract intersect(coord: Coord): boolean;
}

class Shape extends Graphic {

    public style: ShapeStyle;
    

    constructor(x: number, y: number, width: number, height: number) {
        super(new Coord(x, y));

        this.width = width;
        this.height = height;
        
        this.style = new ShapeStyle();
    }

    public draw(context: CanvasRenderingContext2D) {


        context.strokeStyle = this.style.strokeStyle;
        context.fillStyle = this.style.fillStyle;
        context.globalAlpha = this.style.opacity;

        context.fillRect(this.position.x, this.position.y, this.width, this.height);
        context.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }

    public intersect(coord: Coord): boolean {
        return coord.x >= this.position.x && coord.x <= this.position.x + this.width &&
            coord.y >= this.position.y && coord.y <= this.position.y + this.height;
    }
}

class Group extends Graphic {

    public graphics: Graphic[];

    constructor(graphics: Graphic[] = []) {
        super();

        this.graphics = graphics;
        this.position = graphics.sort((a, b) => {
            return a.position.compareTo(b.position);
        })[0].position;
    }

    public moveTo(position: Coord) {
        let offsetCoord = position.diff(this.position);

        this.position = position;

        for (let graphic of this.graphics) {
            graphic.moveTo(graphic.position.add(offsetCoord));
        }
    }

    public draw(context: CanvasRenderingContext2D) {

        for (var index = this.graphics.length - 1; index >= 0; index--) {
            var graphic = this.graphics[index];
            graphic.draw(context);
        }
    }

    public intersect(coord: Coord): boolean {

        return false;
    }
}

class Layer {
    public title: string;
    public graphics: Graphic[] = [];

    constructor(title: string) {
        this.title = title;
    }

    public addGraphic(graphic: Graphic) {

        this.graphics.push(graphic);
    }

    public pickGraphicAt(coord: Coord): Graphic {

        for (var index = this.graphics.length - 1; index >= 0; index--) {
            var graphic = this.graphics[index];

            if (graphic.intersect(coord)) {
                return graphic;
            }
        }

        return null;
    }

    public draw(context: CanvasRenderingContext2D) {
        for (var index = this.graphics.length - 1; index >= 0; index--) {
            var graphic = this.graphics[index];
            graphic.draw(context);
        }
    }
}

class ShapeStyle {
    public strokeStyle: string = 'black';
    public fillStyle: string = 'white';
    public opacity: number = 1;
}

class Selection extends Shape {
    public selectedGraphic: Graphic;

    constructor(selectedGraphic: Graphic) {
        super(selectedGraphic.position.x, selectedGraphic.position.y, selectedGraphic.width, selectedGraphic.height);

        this.selectedGraphic = selectedGraphic;
    }

    public draw(context: CanvasRenderingContext2D) {
        super.draw(context);
    }
}

class Palete {

    public layers: Layer[] = [];
    public currentLayer: Layer;
    public currentSelection: Selection;

    constructor() {
        this.currentLayer = this.addLayer();
    }

    public addLayer(): Layer {

        let layer = new Layer("Layer #" + this.layers.length);

        this.layers.push(layer);

        return layer;
    }

    public selectLayer(index: number): Layer {

        this.currentLayer = this.layers[index];

        return this.currentLayer;
    }

    public pickGraphicAt(coord: Coord): Graphic {
        return this.currentLayer.pickGraphicAt(coord);
    }

    public draw(context: CanvasRenderingContext2D) {

        for (var index = this.layers.length - 1; index >= 0; index--) {
            var layer = this.layers[index];
            layer.draw(context);
        }

        if (this.currentSelection != null) {
            this.currentSelection.draw(context);
        }
    }
}

export default class Drawer {
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public palete: Palete;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.palete = new Palete();

        this.palete.currentLayer.addGraphic(new Shape(100, 100, 100, 100));
        this.palete.currentLayer.addGraphic(new Shape(100, 300, 50, 100));
        this.palete.currentLayer.addGraphic(new Shape(300, 100, 200, 100));
        this.invalidate();

        canvas.addEventListener('mousedown', (e) => {
            let mouseCoord = new Coord(e.clientX, e.clientY);

            let selected = this.palete.pickGraphicAt(mouseCoord);
            if (selected !== null) {
                this.palete.currentSelection = new Selection(selected);
            } else {
                this.palete.currentSelection = null;
            }
            this.invalidate();
        }/*this.canvas_OnMouseDown*/);
        canvas.addEventListener('mousemove', this.canvas_OnMouseMove);
        canvas.addEventListener('mouseup', this.canvas_OnMouseUp);
    }

    canvas_OnMouseDown(e: MouseEvent) {

    }
    private canvas_OnMouseMove() { }
    private canvas_OnMouseUp() { }

    public invalidate() {
        this.canvas.width = this.canvas.width;
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.palete.draw(this.context);
    }
}

let drawer = new Drawer(<HTMLCanvasElement>document.getElementById('canvas'));