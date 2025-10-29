import {Object3D, Scene} from "three";
import {InteractionalObjectComponent} from "./InteractionalObjectComponent";


export class Coin extends InteractionalObjectComponent{
    cost:number = 1;
    constructor(_scene: Scene, x:number, z:number, _model: Object3D) {
        super(_scene, x, z, _model);
        this.interactionalZone = 0.2;
        _scene.add(this.model);
    }

    public animationRotate(_tick): void{
        this.model.rotation.y += _tick;
    }
}