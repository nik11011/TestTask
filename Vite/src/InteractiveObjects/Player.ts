import {Group, Object3DEventMap} from "three";

export class Player {
    public score: number = 0;
    public playerModel: Group<Object3DEventMap>;
    public playerDeath: boolean = false;
    public playerSpeed: number = 2;
    public win: number = 0;

    constructor(){
    }

    replaceModel(model){
        if (this.playerModel!=null) {
            this.playerModel.clear();
            model.position.z = this.playerModel.position.z;
            model.position.x = this.playerModel.position.x;
        }
        this.playerModel = model;
    }

}
