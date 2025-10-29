import {Object3D, Scene} from "three";
import {InteractionalObjectComponent} from "./InteractionalObjectComponent";
import {WrathInteraction} from "../WrathPropertiesComponent";
import {TextMesh} from "../Font3DComponent";

export class Wrath extends InteractionalObjectComponent{
    private readonly _interactionalZoneWrathX = 0.7;
    private readonly _interactionalZoneWrathZ = 0.2;
    public wrathInteraction: WrathInteraction;
    public activatedWrath: boolean = false;
    public textMesh: TextMesh;
    constructor(scene: Scene, x:number, z:number, model: Object3D, _textMesh:TextMesh) {
        super(scene, x, z, model);
        this.model.rotation.y = Math.PI * -2.5;
        this.model.scale.set(1.4,1,1.2);
        this.model.position.y = -0.3
        this.interactionalZone = 0;
        this.textMesh = _textMesh;
        this.textMesh.position.set(
            this.model.position.x,
            this.model.position.y+=0.5,
            this.model.position.z);
        this.textMesh.scale.z = 0.00001;
        scene.add(this.model);
        scene.add(this.textMesh);
    }


    public onEnterInWrath(Player: Object3D):boolean{
        if (
            Player.position.x<=this.model.position.x+this._interactionalZoneWrathX &&
            Player.position.x>=this.model.position.x-this._interactionalZoneWrathX &&
            Player.position.z>=this.model.position.z-this._interactionalZoneWrathZ &&
            Player.position.z<=this.model.position.z+this._interactionalZoneWrathZ &&
            this.activatedWrath == false
        )
        {
            this.activatedWrath = true;
            return true;
        }
        else {
            return false;
        }
    }
}