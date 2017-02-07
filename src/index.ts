class Transition<TSymbol> {

	public symbol: TSymbol;
	public origin: MachineState<TSymbol>;
	public destination: MachineState<TSymbol>;

	constructor(symbol: TSymbol, origin: MachineState<TSymbol>, destination: MachineState<TSymbol>) {
		this.symbol = symbol;
		this.origin = origin;
		this.destination = destination;
	}
}

class MachineState<TSymbol> {

	public isInitialState: boolean;
	public isFinalState: boolean;
	public transitions: Transition<TSymbol>[] = [];

	constructor(isInitialState: boolean = false) {		
		this.isInitialState = isInitialState;
	}

	public addTransition(symbol: TSymbol, destination: MachineState<TSymbol>): void {

		this.transitions.push(new Transition<TSymbol>(symbol, this, destination));
	}
}

export default class Automato<TSymbol> {

	public initialState: MachineState<TSymbol>;

	constructor(initialState: MachineState<TSymbol>) {

		this.initialState = initialState;
	}

	public resolve(input: TSymbol[] = []) {

		if (this.initialState === null || input === null || input.length === 0) {

			return false;
		}

		return this.resolveInputForState(input, this.initialState);
	}

	private resolveInputForState(input: TSymbol[], state: MachineState<TSymbol>): boolean {

		let currentSymbol = input[0];
		input = input.splice(1);

		for (let transition of state.transitions) {

			if (currentSymbol === transition.symbol) {

				if (input.length > 0) {
					return this.resolveInputForState(input, transition.destination);
				}

				return transition.destination.isFinalState;
			}
		}

		return false;
	}
}

let automato = new Automato<string>(new MachineState<string>(true));

let state1 = new MachineState<string>();

automato.initialState.addTransition('a', state1);
let state2 = new MachineState<string>();

state1.addTransition('b', state2);
let state3 = new MachineState<string>();

state2.addTransition('c', state3);

let finalState = new MachineState<string>();
finalState.isFinalState = true;

state3.addTransition('d', finalState);
finalState.addTransition('e', finalState);

let input = 'abcdeeee'.split('');

alert(automato.resolve(input));