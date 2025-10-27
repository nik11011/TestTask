import * as THREE from "three"
import {SceneControl} from "./SceneControl";
import {UIManager} from "./UIManager";
import {TextMesh, updateTextMesh} from "./Font3D";
import {Player} from "./Player";
import TWEEN from "@tweenjs/tween.js";

export class EndGame{
    sceneController: SceneControl;
    uiManager: UIManager;
    finger: THREE.Mesh;
    scoreText: TextMesh;
    textPlane: THREE.Mesh;
    player: Player;
    constructor(_sceneController: SceneControl, _uiManager: UIManager, _finger: THREE.Mesh, _scoreText: TextMesh, _textPlane: THREE.Mesh, _player: Player) {
        this.sceneController=_sceneController;
        this.uiManager = _uiManager;
        this.finger = _finger;
        this.scoreText = _scoreText;
        this.textPlane = _textPlane;
        this.player = _player;
    }

    realise(){
        this.sceneController.camera.position.z = -60;
        this.uiManager.createInstallButton();
        this.uiManager.createRestartButton();
        this.finger.position.z = this.uiManager.installButton.textBox.position.z + 0.2;
        this.finger.position.y = this.uiManager.installButton.textBox.position.y - 0.1;
        this.sceneController.scene.add(this.finger);
        this.scoreText.position.z = this.sceneController.camera.position.z - this.uiManager.cameraIndent.z;
        this.textPlane.position.z = this.scoreText.position.z;
        this.scoreText.position.x = this.sceneController.camera.position.x;
        this.textPlane.position.x = this.scoreText.position.x;
        updateTextMesh(this.scoreText, "You score: " + this.player.score)
        this.scoreText.scale.set(0.075,0.075,0.0001);
        this.scoreText.lookAt(this.sceneController.camera.position);
        this.textPlane.lookAt(this.sceneController.camera.position);
    }

    tutorial(){
        if (this.finger.position.x >= this.uiManager.installButton.textBox.position.x+0.1) {
            new TWEEN.Tween({x: this.finger.position.x})
                .to({ x: this.uiManager.installButton.textBox.position.x }, 1000)
                .onUpdate((cords) => {
                    this.finger.position.x = cords.x;
                })
                .start();
        }
        else{
            this.finger.position.x = this.uiManager.installButton.textBox.position.x+0.4;
        }
    }
}