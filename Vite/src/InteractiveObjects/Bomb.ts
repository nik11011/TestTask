import {Object3D, Scene} from "three";
import {InteractionalObjectComponent} from "./InteractionalObjectComponent";


export class Bomb extends InteractionalObjectComponent{
    constructor(_scene: Scene, x:number, z:number, _model: Object3D) {
        super(_scene, x, z, _model);
        this.model.position.y = -0.1;
        _scene.add(this.model);
    }

    public AnimationRotate(_tick){
        this.model.rotation.y += _tick;
    }
}