class Entity {
    public update(): void { }
}

class View {
    public render(): void { }
}

abstract class State {
    public name: string = '';      // unique identifier used for transitions
    public context: CanvasRenderingContext2D = null;  // state identity context- determining state transition logic

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    // use for transition effects
    public abstract onEnter(): void;

    // use for transition effects and/or
    // memory management- call a destructor method to clean up object
    // references that the garbage collector might not think are ready, 
    // such as cyclical references between objects and arrays that 
    // contain the objects
    public abstract onLeave(): void;
}

interface Map<T> {
    [K: string]: T;
}

class StateMachine {
    public states: Map<State> = {}; // this will be an array, but avoid arrays on prototypes.
    // as they're shared across all instances!
    public currentState: State; // may or may not be set in constructor

    constructor(/*options*/) {
        /*options = options || {}; // optionally include states or contextual awareness

        this.currentState = null;
        this.states = {};

        if (options.states) {
            this.states = options.states;
        }

        if (options.currentState) {
            this.transition(options.currentState);
        }*/
    };

    public addState(name: string, stateInstance: State): void {
        this.states[name] = stateInstance;
    };

    // This is the most important function—it allows programmatically driven
    // changes in state, such as calling myStateMachine.transition("gameOver")
    public transition(nextStateName: string): void {
        if (this.currentState) {
            // leave the current state—transition out, unload assets, views, so on
            this.currentState.onLeave();
        }
        // change the reference to the desired state
        this.currentState = this.states[nextStateName];
        // enter the new state, swap in views, 
        // setup event handlers, animated transitions
        this.currentState.onEnter();
    }
}

class Engine {

    public static get UPDATE_INTERVAL(): number { return 1000 / 16; }

    public stateMachine: StateMachine;  // state machine that handles state transitions
    public viewStack: View[] = [];     // array collection of view layers, 
    // perhaps including sub-view classes
    public entities: Entity[] = [];      // array collection of active entities within the system
    // characters, 
    constructor() {
        this.viewStack = []; // don't forget that arrays shouldn't be prototype 
        // properties as they're copied by reference
        this.entities = [];

        // set up your state machine here, along with the current state
        // this will be expanded upon in the next section

        // start rendering your views
        this.render();
        // start updating any entities that may exist
        setInterval(this.update.bind(this), Engine.UPDATE_INTERVAL);
    }

    private requestAnimFrame(callback: Function, element: HTMLBaseElement = null): void {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback: Function, /* DOMElement */ element: HTMLBaseElement) {
                window.setTimeout(callback, 1000 / 60);
            };
    }

    public render() {
        this.requestAnimFrame(this.render.bind(this));
        for (var i = 0, len = this.viewStack.length; i < len; i++) {
            // delegate rendering logic to each view layer
            (this.viewStack[i]).render();
        }
    }

    public update() {
        for (var i = 0, len = this.entities.length; i < len; i++) {
            // delegate update logic to each entity
            (this.entities[i]).update();
        }
    }
}

let engine: Engine = new Engine();
engine.