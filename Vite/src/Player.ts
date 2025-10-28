import * as THREE from "three"
export class Player {
    public score: number = 0;
    public playerModel: THREE.Group<THREE.Object3DEventMap>;
    playerDeath = false;
    playerSpeed = 2;
    win:number = 0;

    constructor(){
    }

    replaceModel(model){
        if(this.playerModel!=null) {
            this.playerModel.clear();
            model.position.z = this.playerModel.position.z;
            model.position.x = this.playerModel.position.x;
        }
        this.playerModel = model;
    }

}
