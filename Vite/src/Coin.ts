import {Object3D, Scene} from "three";
import {InteractionalObject} from "./InteractionalObject";


export class Coin extends InteractionalObject{
    cost:number = 1;
    constructor(_scene: Scene, x:number, z:number, _model: Object3D) {
        super(_scene, x, z, _model);
        this.interactionalZone = 0.2;
        _scene.add(this.model);
    }

    AnimationRotate(_tick){
        this.model.rotation.y += _tick;
    }
}