import {Object3D, Scene} from "three";
import {InteractionalObject} from "./InteractionalObject";


export class Bomb extends InteractionalObject{
    constructor(_scene: Scene, x:number, z:number, _model: Object3D) {
        super(_scene, x, z, _model);
        this.model.position.y = -0.1;
        _scene.add(this.model);
    }

    AnimationRotate(_tick){
        this.model.rotation.y += _tick;
    }
}