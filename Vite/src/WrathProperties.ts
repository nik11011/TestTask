
export enum interactionalWithScore{
    PLUS,
    MINUS,
    MULTIPLY,
    DIVIDE
}


export class WrathInteraction{
    private readonly numInteraction:number;
    private readonly operation:interactionalWithScore;
    constructor(_operation:interactionalWithScore, _numInteraction:number) {
        this.operation = _operation;
        this.numInteraction = _numInteraction;
    }
    public doInteraction(Num:number){
        switch (this.operation) {
            case interactionalWithScore.PLUS:
                return Num + this.numInteraction;
            case interactionalWithScore.MINUS:
                return Num - this.numInteraction;
            case interactionalWithScore.MULTIPLY:
                return Num * this.numInteraction;
            case interactionalWithScore.DIVIDE:
                if (Num == 0|| this.numInteraction == 0) {
                    return 0;
                }
                else {
                    return Num/this.numInteraction;
                }
        }
    }
}