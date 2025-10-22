import * as THREE from "three";
import {UIManager} from "./UIManager";
import {TextBox3D} from "./TextBox3D";


export class ResizeScreenManager {
    uiManager: UIManager;
    cameraIndent = {
        x:0,
        y:0,
        z:0
    }
    restartButton:TextBox3D;
    installButton:TextBox3D;
    constructor(_uiManager: UIManager, _restartButton: TextBox3D, _installButton:TextBox3D) {
        this.uiManager = _uiManager;
        this.restartButton = _restartButton;
        this.installButton = _installButton;
        this.sizeOnScreen = this.sizeOnScreen.bind(this);
    }


    sizeOnScreen(buttonSound:THREE.Mesh, renderer:THREE.WebGLRenderer) {
        if(window.innerWidth>window.innerHeight){
            this.resizeForWidthScreen();
        }
        else if(window.innerHeight>=window.innerWidth) {
            this.resizeForHeightScreen();
        }
        buttonSound.scale.set(this.uiManager.uiLayout.scaleButtonSound, this.uiManager.uiLayout.scaleButtonSound, 0.1);
        this.uiManager.UIpositioner(this.uiManager.uiLayout.buttonSoundPosition, this.uiManager.uiLayout.scoreTextPosition);
        this.uiManager.sceneController.camera.aspect = window.innerWidth / window.innerHeight;
        this.uiManager.sceneController.camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    private resizeForWidthScreen() {
        this.uiManager.uiLayout.scoreTextPosition = {
            x: -2,
            y: 1.5,
            z: this.uiManager.player.playerModel.position.z
        }
        this.uiManager.uiLayout.buttonSoundPosition = {
            x: 0.4,
            y: -0.1,
            z: -1,
        }
        this.uiManager.uiLayout.restartButtonPosition = {
            x: -1,
            y: 0.4,
            z: -6
        }
        this.uiManager.uiLayout.installButtonPosition = {
            x: +1,
            y: 0.4,
            z: -6
        }
        this.uiManager.sceneController.camera.fov = 30;
        this.uiManager.sceneController.camera.position.y = 2;
        this.cameraIndent.z = 5;
        this.uiManager.sceneController.camera.position.z = this.uiManager.player.playerModel.position.z + this.cameraIndent.z;
        this.uiManager.sceneController.camera.lookAt(
            this.uiManager.player.playerModel.position.x,
            this.uiManager.player.playerModel.position.y,
            this.uiManager.player.playerModel.position.z - 2);
        this.uiManager.uiLayout.scaleButtonSound = 0.4;
        this.rePosInstallBtn()
        this.rePosRestartBtn()
    }

    private resizeForHeightScreen() {
        this.uiManager.uiLayout.scoreTextPosition = {
            x: 0,
            y: 1.7,
            z: this.uiManager.player.playerModel.position.z
        }
        this.uiManager.uiLayout.buttonSoundPosition = {
            x: -0.35,
            y: -1.4,
            z: -1.1,
        }
        this.uiManager.uiLayout.restartButtonPosition = {
            x: 0,
            y: 1,
            z: -3
        }
        this.uiManager.uiLayout.installButtonPosition = {
            x: 0,
            y: 0.4,
            z: -3
        }
        this.uiManager.sceneController.camera.fov = 55;
        this.uiManager.sceneController.camera.position.y = 2;
        this.cameraIndent.z = 3;
        this.uiManager.sceneController.camera.position.z = this.uiManager.player.playerModel.position.z + this.cameraIndent.z;
        this.uiManager.sceneController.camera.lookAt(
            this.uiManager.player.playerModel.position.x,
            this.uiManager.player.playerModel.position.y,
            this.uiManager.player.playerModel.position.z - 1);
        this.uiManager.uiLayout.scaleButtonSound = 0.8;
        this.rePosInstallBtn()
        this.rePosRestartBtn()
    }

    rePosInstallBtn() {
        this.installButton.text.scale.set(this.uiManager.uiLayout.scaleButton, this.uiManager.uiLayout.scaleButton, 0.0001);
        this.installButton.textBox.position.x = this.uiManager.sceneController.camera.position.x+this.uiManager.uiLayout.installButtonPosition.x;
        this.installButton.textBox.position.z = this.uiManager.sceneController.camera.position.z+this.uiManager.uiLayout.installButtonPosition.z;
        this.installButton.textBox.position.y = this.uiManager.uiLayout.installButtonPosition.y;
        this.installButton.text.position.x = this.installButton.textBox.position.x;
        this.installButton.text.position.z = this.installButton.textBox.position.z;
        this.installButton.text.position.y = this.installButton.textBox.position.y;
    }

    createInstallButton(){
        this.rePosInstallBtn();
        this.installButton.addToScene(this.uiManager.sceneController.scene);
    }

    rePosRestartBtn() {
        this.restartButton.text.scale.set(this.uiManager.uiLayout.scaleButton, this.uiManager.uiLayout.scaleButton, 0.0001);
        this.restartButton.textBox.position.x = this.uiManager.sceneController.camera.position.x+this.uiManager.uiLayout.restartButtonPosition.x;
        this.restartButton.textBox.position.z = this.uiManager.sceneController.camera.position.z+this.uiManager.uiLayout.restartButtonPosition.z;
        this.restartButton.textBox.position.y = this.uiManager.uiLayout.restartButtonPosition.y;
        this.restartButton.text.position.x = this.restartButton.textBox.position.x;
        this.restartButton.text.position.z = this.restartButton.textBox.position.z;
        this.restartButton.text.position.y = this.restartButton.textBox.position.y;
    }

    createRestartButton() {
        this.rePosRestartBtn();
        this.restartButton.addToScene(this.uiManager.sceneController.scene);
    }
}