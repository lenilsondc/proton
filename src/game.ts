abstract class Card {
    constructor(
        public name: string
    ) {

    }
}

class MonsterCard extends Card {
    constructor(
        name: string,
        public atack: number) {
        super(name);
    }
}

class Deck {
    constructor(
        public cards: Card[] = []
    ) {

    }
}

enum ActionTypeEnum {
    ATACK,
    SUMMON,
}

class Action {
    public card: Card;
    public type: ActionTypeEnum;
}

class Player {

    public field: Field;

    constructor(
        public lifePoints: number,
        public deck: Deck,
        public hand: Card[]
    ) {

        this.field = new Field(this, [], 5);
    }
}

class Slot {
    public card: Card;
}

class Field {

    public monsterSlots: Slot[];

    constructor(
        public player: Player,
        public cemetery: Card[],
        slotNumbers: number
    ) {
        new Array(slotNumbers).map(() => {
            this.monsterSlots.push(new Slot());
        });
    }
}

class Game {
    public activePlayer: Player;
    public enemyPlayer: Player;

    constructor() {
        let deck1 = new Deck();

        new Array(10).map((value: any, index: number) => {            
            deck1.cards.push(new MonsterCard(`Monster #${index}`, 100 + index*10));
        });

        this.activePlayer = new Player(4000, deck1, []);
        this.activePlayer.hand.push(this.activePlayer.deck.cards.pop());
        this.activePlayer.hand.push(this.activePlayer.deck.cards.pop());

        let deck2 = new Deck();

        new Array(10).map((value: any, index: number) => {            
            deck2.cards.push(new MonsterCard(`Monster #${index}`, 200 + index*5));
        });

        this.enemyPlayer = new Player(4000, deck2, []);
        this.enemyPlayer.hand.push(this.enemyPlayer.deck.cards.pop());
        this.enemyPlayer.hand.push(this.enemyPlayer.deck.cards.pop());
    }
}