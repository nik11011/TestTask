
export enum InteractionalScoreComponent{
    PLUS,
    MINUS,
    MULTIPLY,
    DIVIDE
}


export class WrathInteraction{
    private readonly _numInteraction: number;
    private readonly _operation: InteractionalScoreComponent;
    constructor(operation: InteractionalScoreComponent,
                numInteraction: number) {
        this._operation = operation;
        this._numInteraction = numInteraction;
    }
    public doInteraction(Num:number){
        switch (this._operation) {
            case InteractionalScoreComponent.PLUS:
                return Num + this._numInteraction;
            case InteractionalScoreComponent.MINUS:
                return Num - this._numInteraction;
            case InteractionalScoreComponent.MULTIPLY:
                return Num * this._numInteraction;
            case InteractionalScoreComponent.DIVIDE:
                if (Num == 0|| this._numInteraction == 0) {
                    return 0;
                }
                else {
                    return Num/this._numInteraction;
                }
        }
    }
}