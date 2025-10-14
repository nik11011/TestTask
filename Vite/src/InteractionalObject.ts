import {Object3D, Scene} from "three";


export class InteractionalObject{
    interactionalZone:number;
    model: Object3D;
    constructor(_scene: Scene, x:number, z:number, _model: Object3D) {
        this.model = _model;
        this.model.position.x = x;
        this.interactionalZone = 0.2;
        this.model.position.z = z;
    }

    OnTrigger(playerModel:Object3D):boolean{
        if(
            (this.model.position.x-this.interactionalZone <= playerModel.position.x) &&
            (this.model.position.x+this.interactionalZone >= playerModel.position.x) &&
            (this.model.position.z+this.interactionalZone >= playerModel.position.z) &&
            (this.model.position.z-this.interactionalZone <= playerModel.position.z)
        ) {
            return true;
        }
        else {
            return false;
        }
    }
}