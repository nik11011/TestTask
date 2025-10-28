import {AnimationAction, AnimationMixer, Group, Object3DEventMap} from "three";

export class AnimationManagerComponent {
    public mixer: AnimationMixer;
    private _action: AnimationAction;

    constructor() {
    }
    changeAnimation(Animation: Group<Object3DEventMap>){
        this.mixer = new AnimationMixer(Animation);
        this._action = this.mixer.clipAction(Animation.animations[0]);
    }

    playAnimation(){
        this._action.play();
    }
}