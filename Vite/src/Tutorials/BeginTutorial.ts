import {TextMesh} from "../Font3DComponent";
import {SceneControlComponent} from "../SceneControlComponent";
import TWEEN from '@tweenjs/tween.js';
import {Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader} from "three";


export class BeginTutorial {
    private right: boolean = false;
    private left: boolean = true;
    private readonly _textureLoader: TextureLoader = new TextureLoader;
    private readonly _fingerPlaneGeometry: PlaneGeometry = new PlaneGeometry(0.5,0.5)
    private readonly _fingerMaterial: MeshBasicMaterial = new MeshBasicMaterial;
    private readonly _fingerTutorial: Mesh;
    private readonly _arrowMaterial: MeshBasicMaterial = new MeshBasicMaterial;
    private readonly _arrowGeometry: PlaneGeometry = new PlaneGeometry(1.5,0.5);
    private readonly _arrow: Mesh;
    private readonly _tutorialText: TextMesh;
    private readonly _sceneController: SceneControlComponent;

    constructor(_tutorialText: TextMesh, _sceneController: SceneControlComponent) {
        this._sceneController = _sceneController;
        this._fingerMaterial.map = this._textureLoader.load("fingerIcon.png");
        this._fingerMaterial.transparent = true;
        this._fingerMaterial.alphaTest = 0.1;
        this._fingerTutorial = new Mesh(this._fingerPlaneGeometry, this._fingerMaterial);
        this._fingerTutorial.position.z = 0.3
        this._fingerTutorial.position.y = 0.3
        this._tutorialText = _tutorialText;
        this._tutorialText.position.y = 0.6
        this._arrowMaterial.map = this._textureLoader.load("arrow.png");
        this._arrowMaterial.transparent = true;
        this._arrow = new Mesh(this._arrowGeometry, this._arrowMaterial);
        this._arrow.position.z = 0.2
        this._arrow.position.y = 0.5
        this._sceneController.scene.add(_tutorialText);
        this._sceneController.scene.add(this._fingerTutorial);
        this._sceneController.scene.add(this._arrow);
    }

    MoveToLeftPosition(fixedDelta:number) {
        if (this._fingerTutorial.position.x >= -0.5+0.1) {
            new TWEEN.Tween({x: this._fingerTutorial.position.x})
                .to({ x: -0.5 }, 1000)
                .onUpdate((cords) => {
                    this._fingerTutorial.position.x = cords.x;
                })
                .start();
        } else {
            this.right = false;
            this.left = true;
        }
    }


    MoveToRightPosition(fixedDelta:number) {
        if (this._fingerTutorial.position.x <= 0.5-0.1){
            new TWEEN.Tween({x: this._fingerTutorial.position.x})
                .to({ x: 0.5}, 1000)
                .onUpdate((cords) => {
                    this._fingerTutorial.position.x = cords.x;
                })
                .start();
        } else {
            this.right = true;
            this.left = false;
        }
    }


    AnimationTutorial(fixedDelta:number) {
        if (this.left && !this.right) this.MoveToRightPosition(fixedDelta);
        else if (this.right && !this.left) this.MoveToLeftPosition(fixedDelta);
    }


    Tutorial(firstTouch:boolean, fixedDelta:number) {
        if (firstTouch == false) {
            this.AnimationTutorial(fixedDelta);
        } else {
            this._sceneController.scene.remove(this._arrow);
            this._sceneController.scene.remove(this._fingerTutorial);
            this._sceneController.scene.remove(this._tutorialText);
        }
    }
}