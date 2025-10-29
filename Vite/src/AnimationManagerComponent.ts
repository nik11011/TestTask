import {AnimationAction, AnimationMixer, Group, Object3DEventMap} from "three";

export class AnimationManagerComponent {
    public mixer: AnimationMixer;
    private _action: AnimationAction;

    constructor() {
    }
    public changeAnimation(Animation: Group<Object3DEventMap>): void{
        this.mixer = new AnimationMixer(Animation);
        this._action = this.mixer.clipAction(Animation.animations[0]);
    }

    public playAnimation(): void{
        this._action.play();
    }
}