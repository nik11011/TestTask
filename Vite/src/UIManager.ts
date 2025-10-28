import {Player} from "./Player";
import {SceneControl} from "./SceneControl";
import * as THREE from "three"
import {TextMesh} from "./Font3D";
import {UILayout} from "./UILayout";
import {TextBox3D} from "./TextBox3D";
import {SoundButton} from "./SoundButton";


export class UIManager{
    player:Player;
    sceneController: SceneControl;
    buttonSound = new SoundButton();
    restartButton:TextBox3D;
    installButton:TextBox3D;
    textPlane:THREE.Mesh;
    scoreText: TextMesh;
    uiLayout:UILayout;
    renderer:THREE.WebGLRenderer
    cameraIndent = {
        x:0,
        y:0,
        z:0
    }

    constructor(_player:Player,
                _sceneController:SceneControl,
                _restartButton:TextBox3D,
                _installButton:TextBox3D,
                _textPlane:THREE.Mesh,
                _scoreText: TextMesh,
                _uiLayout:UILayout,
                _renderer: THREE.WebGLRenderer) {
        this.player = _player;
        this.sceneController = _sceneController;
        this.textPlane = _textPlane;
        this.scoreText = _scoreText;
        this.uiLayout = _uiLayout;
        this.installButton = _installButton;
        this.restartButton = _restartButton
        this.renderer = _renderer;
        _sceneController.scene.add(this.buttonSound.button);
        this.sizeOnScreen = this.sizeOnScreen.bind(this);
    }


    UIpositioner(buttonSoundPos: { x: number; y: number; z: number }, scoreTextPos: {x: number; y: number; z: number}) {
        this.scoreTextPosition(scoreTextPos);
        this.buttonSoundPosition(buttonSoundPos);
    }

    private scoreTextPosition(scoreTextPos: { x: number; y: number; z: number }) {
        this.scoreText.position.set(
            this.sceneController.camera.position.x + scoreTextPos.x,
            scoreTextPos.y,
            this.player.playerModel.position.z + scoreTextPos.z
        )
        this.scoreText.lookAt(
            this.sceneController.camera.position
        )
        this.textPlane.position.set(
            this.scoreText.position.x,
            this.scoreText.position.y,
            this.scoreText.position.z
        )
        this.textPlane.lookAt(
            this.sceneController.camera.position
        )
    }

    private buttonSoundPosition(buttonSoundPos: { x: number; y: number; z: number }) {
        this.buttonSound.button.position.set(
            this.sceneController.camera.position.x + buttonSoundPos.x,
            this.sceneController.camera.position.y + buttonSoundPos.y,
            this.sceneController.camera.position.z + buttonSoundPos.z
        )
        this.buttonSound.button.lookAt(
            this.sceneController.camera.position.x + buttonSoundPos.x,
            this.sceneController.camera.position.y,
            this.sceneController.camera.position.z,
        )
    }
    sizeOnScreen() {
        if(window.innerWidth>window.innerHeight){
            this.resizeForWidthScreen();
        }
        else if(window.innerHeight>=window.innerWidth) {
            this.resizeForHeightScreen();
        }
        this.buttonSound.button.scale.set(this.uiLayout.scaleButtonSound, this.uiLayout.scaleButtonSound, 0.1);
        this.UIpositioner(this.uiLayout.buttonSoundPosition, this.uiLayout.scoreTextPosition);
        this.sceneController.camera.aspect = window.innerWidth / window.innerHeight;
        this.sceneController.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    private resizeForWidthScreen() {
        this.uiLayout.scoreTextPosition = {
            x: -(window.innerWidth/1000),
            y: 1.5,
            z: this.player.playerModel.position.z
        }
        this.uiLayout.buttonSoundPosition = {
            x: (window.innerWidth/10000) + 0.1,
            y: -0.1,
            z: -1,
        }
        this.uiLayout.restartButtonPosition = {
            x: -1,
            y: 0.4,
            z: -6
        }
        this.uiLayout.installButtonPosition = {
            x: +1,
            y: 0.4,
            z: -6
        }
        this.sceneController.camera.fov = 30;
        this.sceneController.camera.position.y = 2;
        this.cameraIndent.z = 5;
        this.sceneController.camera.position.z = this.player.playerModel.position.z + this.cameraIndent.z;
        this.sceneController.camera.lookAt(
            this.player.playerModel.position.x,
            this.player.playerModel.position.y,
            this.player.playerModel.position.z - 2);
        this.uiLayout.scaleButtonSound = 0.4;
        this.rePosInstallBtn()
        this.rePosRestartBtn()
    }

    private resizeForHeightScreen() {
        this.uiLayout.scoreTextPosition = {
            x: 0,
            y: 1.7,
            z: this.player.playerModel.position.z
        }
        this.uiLayout.buttonSoundPosition = {
            x: -0.35,
            y: -1.4,
            z: -1.1,
        }
        this.uiLayout.restartButtonPosition = {
            x: 0,
            y: 1,
            z: -3
        }
        this.uiLayout.installButtonPosition = {
            x: 0,
            y: 0.4,
            z: -3
        }
        this.sceneController.camera.fov = 55;
        this.sceneController.camera.position.y = 2;
        this.cameraIndent.z = 3;
        this.sceneController.camera.position.z = this.player.playerModel.position.z + this.cameraIndent.z;
        this.sceneController.camera.lookAt(
            this.player.playerModel.position.x,
            this.player.playerModel.position.y,
            this.player.playerModel.position.z - 1);
        this.uiLayout.scaleButtonSound = 0.8;
        this.rePosInstallBtn()
        this.rePosRestartBtn()
    }

    rePosInstallBtn() {
        this.installButton.text.scale.set(this.uiLayout.scaleButton, this.uiLayout.scaleButton, 0.0001);
        this.installButton.textBox.position.x = this.sceneController.camera.position.x+this.uiLayout.installButtonPosition.x;
        this.installButton.textBox.position.z = this.sceneController.camera.position.z+this.uiLayout.installButtonPosition.z;
        this.installButton.textBox.position.y = this.uiLayout.installButtonPosition.y;
        this.installButton.text.position.x = this.installButton.textBox.position.x;
        this.installButton.text.position.z = this.installButton.textBox.position.z;
        this.installButton.text.position.y = this.installButton.textBox.position.y;
    }

    createInstallButton(){
        this.rePosInstallBtn();
        this.installButton.addToScene(this.sceneController.scene);
    }

    rePosRestartBtn() {
        this.restartButton.text.scale.set(this.uiLayout.scaleButton, this.uiLayout.scaleButton, 0.0001);
        this.restartButton.textBox.position.x = this.sceneController.camera.position.x+this.uiLayout.restartButtonPosition.x;
        this.restartButton.textBox.position.z = this.sceneController.camera.position.z+this.uiLayout.restartButtonPosition.z;
        this.restartButton.textBox.position.y = this.uiLayout.restartButtonPosition.y;
        this.restartButton.text.position.x = this.restartButton.textBox.position.x;
        this.restartButton.text.position.z = this.restartButton.textBox.position.z;
        this.restartButton.text.position.y = this.restartButton.textBox.position.y;
    }

    createRestartButton() {
        this.rePosRestartBtn();
        this.restartButton.addToScene(this.sceneController.scene);
    }
}