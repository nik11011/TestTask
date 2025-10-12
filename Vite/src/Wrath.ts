import {Object3D, Scene} from "three";
import {InteractionalObject} from "./InteractionalObject";
import {WrathInteraction} from "./WrathProperties";

export class Wrath extends InteractionalObject{
    private readonly interactionalZoneWrathX = 0.7;
    private readonly interactionalZoneWrathZ = 0.2;
    public wrathInteraction: WrathInteraction;
    private activatedWrath:boolean = false;
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
            Player.position.x>=this.model.position.x-this.interactionalZoneWrathX &&
            Player.position.z>=this.model.position.z-this.interactionalZoneWrathZ &&
            Player.position.z<=this.model.position.z+this.interactionalZoneWrathZ &&
            this.activatedWrath == false
        ){
            this.activatedWrath = true;
            return true;
        }
        else{
            return false;
        }
    }
}