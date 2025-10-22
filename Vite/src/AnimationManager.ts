import * as THREE from "three"
import {AnimationAction} from "three";

export class AnimationManager{
    mixer: THREE.AnimationMixer;
    action: AnimationAction;

    constructor() {
    }
    changeAnimation(Animation: THREE.Group<THREE.Object3DEventMap>){
        this.mixer = new THREE.AnimationMixer(Animation);
        this.action = this.mixer.clipAction(Animation.animations[0]);
    }

    playAnimation(){
        this.action.play();
    }
}