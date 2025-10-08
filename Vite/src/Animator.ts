import * as THREE from "three"
import {ImportClass} from "./ImportClass";

export class Animator{

    private scene:THREE.Scene;
    private importclass;
    public libraryAnimations = new Array<THREE.Object3D>();
    public currentAnimation: THREE.Object3D;
    public animationMixer:THREE.AnimationMixer;

    constructor(_scene: THREE.Scene) {
        this.scene = _scene;
        this.importclass = new ImportClass(this.scene)
        this.fillAnimationsArray();
        let normalizeFBX:number = 0.003;
        for(let animationFBX of this.libraryAnimations){
            animationFBX.scale.set(normalizeFBX,normalizeFBX,normalizeFBX);
            animationFBX.rotation.y = Math.PI + 0.5;
        }
        this.currentAnimation = this.libraryAnimations[0];
        this.animationMixer = new THREE.AnimationMixer(this.currentAnimation);
        console.error(this.libraryAnimations[0]);
    }

    async fillAnimationsArray(){
        this.libraryAnimations.push(
            await this.importclass.importModel("public/Idle.fbx"),
            await this.importclass.importModel("public/Running.fbx"),
            await this.importclass.importModel("public/Dance.fbx")
        )
    }

    public chooseAnimaton(numberAnimation:number): THREE.AnimationMixer{
        this.currentAnimation = this.libraryAnimations[numberAnimation];
        return new THREE.AnimationMixer(this.currentAnimation);
    }
}