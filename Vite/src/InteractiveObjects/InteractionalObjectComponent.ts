import {Object3D, Scene} from "three";


export class InteractionalObjectComponent {
    public interactionalZone: number;
    public readonly model: Object3D;
    constructor(scene: Scene, x:number, z:number, _model: Object3D) {
        this.model = _model;
        this.model.position.x = x;
        this.interactionalZone = 0.2;
        this.model.position.z = z;
        this.model.castShadow = true;
        this.model.receiveShadow = true;
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