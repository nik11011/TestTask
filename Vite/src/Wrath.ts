import {Object3D, Scene} from "three";
import {InteractionalObject} from "./InteractionalObject";
import {WrathInteraction} from "./WrathProperties";

export class Wrath extends InteractionalObject{

    interactionalZoneWrathX = 0.7;
    private interaction = new WrathInteraction();
    constructor(_scene: Scene, x:number, z:number, _model: Object3D) {
        super(_scene, x, z, _model);
        this.model.rotation.y = Math.PI * -2.5;
        this.model.scale.set(1.4,1.4,1.4);
        this.interactionalZone = 0;
        _scene.add(this.model);
    }


    OnEnterInWrath(Player:Object3D):boolean{
        if(
            Player.position.x<=this.model.position.x+this.interactionalZoneWrathX &&
            Player.position.x>=this.model.position.x-this.interactionalZoneWrathX
        ){
            return true;
        }
        else{
            return false;
        }
    }
    AnimationRotate(_tick){
        this.model.rotation.y += _tick;
    }
}