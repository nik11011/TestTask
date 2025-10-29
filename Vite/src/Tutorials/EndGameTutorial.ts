import {SceneControlComponent} from "../SceneControlComponent";
import {UIManagerComponent} from "../UIManagerComponent";
import {TextMesh, updateTextMesh} from "../Font3DComponent";
import {Player} from "../InteractiveObjects/Player";
import TWEEN from "@tweenjs/tween.js";
import {Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader} from "three";

export class EndGameTutorial {
    private readonly _textureLoader: TextureLoader = new TextureLoader;
    private readonly _sceneController: SceneControlComponent;
    private readonly _uiManager: UIManagerComponent;
    private readonly _scoreText: TextMesh;
    private readonly _textPlane: Mesh;
    private readonly _player: Player;
    private readonly _fingerPlaneGeometry: PlaneGeometry = new PlaneGeometry(0.3,0.3)
    private readonly _fingerMaterial: MeshBasicMaterial = new MeshBasicMaterial;
    private readonly _finger: Mesh;

    constructor(sceneController: SceneControlComponent,
                uiManager: UIManagerComponent,
                scoreText: TextMesh,
                textPlane: Mesh,
                player: Player) {
        this._fingerMaterial.map = this._textureLoader.load("fingerIcon.png");
        this._fingerMaterial.transparent = true;
        this._fingerMaterial.alphaTest = 0.1;
        this._finger= new Mesh(this._fingerPlaneGeometry, this._fingerMaterial);
        this._sceneController=sceneController;
        this._uiManager = uiManager;
        this._scoreText = scoreText;
        this._textPlane = textPlane;
        this._player = player;
    }

    realise(){
        this._sceneController.camera.position.z = -60;
        this._uiManager.createInstallButton();
        this._uiManager.createRestartButton();
        this._finger.position.z = this._uiManager.installButton.textBox.position.z + 0.2;
        this._finger.position.y = this._uiManager.installButton.textBox.position.y - 0.1;
        this._sceneController.scene.add(this._finger);
        this._scoreText.position.z = this._sceneController.camera.position.z - this._uiManager.cameraIndent.z;
        this._textPlane.position.z = this._scoreText.position.z;
        this._scoreText.position.x = this._sceneController.camera.position.x;
        this._textPlane.position.x = this._scoreText.position.x;
        updateTextMesh(this._scoreText, "You score: " + this._player.score)
        this._scoreText.scale.set(0.075,0.075,0.0001);
        this._scoreText.lookAt(this._sceneController.camera.position);
        this._textPlane.lookAt(this._sceneController.camera.position);
    }

    tutorial(){
        if (this._finger.position.x >= this._uiManager.installButton.textBox.position.x+0.1) {
            new TWEEN.Tween({x: this._finger.position.x, alpha: 0})
                .to({ x: this._uiManager.installButton.textBox.position.x , alpha: 1.1}, 1000)
                .onUpdate((cords) => {
                    this._finger.position.x = cords.x;
                })
                .start();
        }
        else {
            this._finger.position.x = this._uiManager.installButton.textBox.position.x+0.4;
        }
    }
}