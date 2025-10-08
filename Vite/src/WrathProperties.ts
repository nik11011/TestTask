import {Wrath} from "./Wrath";


enum interactionalWithScore{
    PLUS,
    MINUS,
    MULTIPLY,
    DIVIDE
}


export class WrathInteraction{
    constructor() {
    }

    private doInteraction(Num:number,numInteraction:number, operation: interactionalWithScore,){
        switch (operation) {
            case interactionalWithScore.PLUS:
                return Num + numInteraction;
            case interactionalWithScore.MINUS:
                return Num + numInteraction;
            case interactionalWithScore.MULTIPLY:
                return Num + numInteraction;
            case interactionalWithScore.DIVIDE:
                if (Num === 0||numInteraction===0) {
                    return 0;
                }
                else {
                    return Num/numInteraction
                }
        }
}
}