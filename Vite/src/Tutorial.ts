import * as THREE from "three";
import {TextMesh} from "./Font3D";
import {SceneControl} from "./SceneControl";


export class Tutorial {
    textureLoader = new THREE.TextureLoader;
    fingerPlaneGeometry = new THREE.PlaneGeometry(0.5,0.5)
    fingerMaterial = new THREE.MeshBasicMaterial;
    fingerTutorial: THREE.Mesh;
    arrowMaterial = new THREE.MeshBasicMaterial;
    arrowGeometry = new THREE.PlaneGeometry(1.5,0.5);
    arrow: THREE.Mesh;
    tutorialText: TextMesh;
    sceneController: SceneControl;
    right:boolean = false;
    left:boolean = true;
    constructor(_tutorialText: TextMesh, _sceneController: SceneControl) {
        this.sceneController = _sceneController;
        this.fingerMaterial.map = this.textureLoader.load("fingerIcon.png");
        this.fingerMaterial.transparent = true;
        this.fingerTutorial = new THREE.Mesh(this.fingerPlaneGeometry, this.fingerMaterial);
        this.fingerTutorial.position.z = 0.3
        this.fingerTutorial.position.y = 0.3
        this.tutorialText = _tutorialText;
        this.tutorialText.position.y = 0.6
        this.arrowMaterial.map = this.textureLoader.load("arrow.png");
        this.arrowMaterial.transparent = true;
        this.arrow = new THREE.Mesh(this.arrowGeometry, this.arrowMaterial);
        this.arrow.position.z = 0.2
        this.arrow.position.y = 0.5
        this.sceneController.scene.add(_tutorialText);
        this.sceneController.scene.add(this.fingerTutorial);
        this.sceneController.scene.add(this.arrow);
    }

    MoveToLeftPosition(fixedDelta:number) {
        if (this.fingerTutorial.position.x >= -0.4) {
            this.fingerTutorial.position.x -= fixedDelta;
        } else {
            this.right = false;
            this.left = true;
        }
    }


    MoveToRightPosition(fixedDelta:number) {
        if (this.fingerTutorial.position.x <= 0.4) {
            this.fingerTutorial.position.x += fixedDelta;
        } else {
            this.right = true;
            this.left = false;
        }
    }


    AnimationTutorial(fixedDelta:number) {
        console.log(`AnimationTutorial called, left: ${this.left}, right: ${this.right}`);
        if (this.left == false) {
            this.MoveToLeftPosition(fixedDelta);
        }
        if (this.right == false) {
            this.MoveToRightPosition(fixedDelta);
        }
    }


    Tutorial(firstTouch:boolean, fixedDelta:number) {
        if (firstTouch == false) {
            this.AnimationTutorial(fixedDelta);
        } else {
            this.sceneController.scene.remove(this.arrow);
            this.sceneController.scene.remove(this.fingerTutorial);
            this.sceneController.scene.remove(this.tutorialText);
        }
    }
}