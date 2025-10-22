import * as THREE from "three"
export class Player {
    public score: number = 0;
    public playerModel: THREE.Group<THREE.Object3DEventMap>;

    constructor(){
    }

    replaceModel(model:THREE.Group<THREE.Object3DEventMap>){
        if(this.playerModel!=null) {
            this.playerModel.clear();
            model.position.z = this.playerModel.position.z;
            model.position.x = this.playerModel.position.x;
        }
        this.playerModel = model;
    }

}
