import {Player} from "./InteractiveObjects/Player";
import {SceneControlComponent} from "./SceneControlComponent";
import * as THREE from "three"
import {TextMesh} from "./Font3DComponent";
import {UILayoutComponent} from "./UILayoutComponent";
import {TextBox3DComponent} from "./TextBox3DComponent";
import {SoundButtonComponent} from "./SoundButtonComponent";


export class UIManagerComponent {
    public readonly buttonSound = new SoundButtonComponent();
    public readonly restartButton:TextBox3DComponent;
    public readonly installButton:TextBox3DComponent;
    public readonly scoreText: TextMesh;
    public readonly uiLayout:UILayoutComponent;

    private readonly _player:Player;
    private readonly _sceneController: SceneControlComponent;
    private readonly _textPlane:THREE.Mesh;
    private readonly _renderer:THREE.WebGLRenderer
    cameraIndent = {
        x:0,
        y:0,
        z:0
    }

    constructor(player:Player,
                sceneController:SceneControlComponent,
                restartButton:TextBox3DComponent,
                installButton:TextBox3DComponent,
                textPlane:THREE.Mesh,
                scoreText: TextMesh,
                uiLayout:UILayoutComponent,
                renderer: THREE.WebGLRenderer) {
        this._player = player;
        this._sceneController = sceneController;
        this._textPlane = textPlane;
        this.scoreText = scoreText;
        this.uiLayout = uiLayout;
        this.installButton = installButton;
        this.restartButton = restartButton
        this._renderer = renderer;
        sceneController.scene.add(this.buttonSound.button);
        this.sizeOnScreen = this.sizeOnScreen.bind(this);
    }


    UIpositioner(buttonSoundPos: { x: number; y: number; z: number }, scoreTextPos: {x: number; y: number; z: number}) {
        this._scoreTextPosition(scoreTextPos);
        this._buttonSoundPosition(buttonSoundPos);
    }

    private _scoreTextPosition(scoreTextPos: { x: number; y: number; z: number }) {
        this.scoreText.position.set(
            this._sceneController.camera.position.x + scoreTextPos.x,
            scoreTextPos.y,
            this._player.playerModel.position.z
        )
        this.scoreText.lookAt(
            this._sceneController.camera.position
        )
        this._textPlane.position.set(
            this.scoreText.position.x,
            this.scoreText.position.y,
            this.scoreText.position.z
        )
        this._textPlane.lookAt(
            this._sceneController.camera.position
        )
    }

    private _buttonSoundPosition(buttonSoundPos: { x: number; y: number; z: number }): void {
        this.buttonSound.button.position.set(
            this._sceneController.camera.position.x + buttonSoundPos.x,
            this._sceneController.camera.position.y + buttonSoundPos.y,
            this._sceneController.camera.position.z + buttonSoundPos.z
        )
        this.buttonSound.button.lookAt(
            this._sceneController.camera.position.x + buttonSoundPos.x,
            this._sceneController.camera.position.y,
            this._sceneController.camera.position.z,
        )
    }
    public sizeOnScreen(): void {
        if(window.innerWidth>window.innerHeight){
            this._resizeForWidthScreen();
        }
        else if(window.innerHeight>=window.innerWidth) {
            this._resizeForHeightScreen();
        }
        this.buttonSound.button.scale.set(this.uiLayout.scaleButtonSound, this.uiLayout.scaleButtonSound, 0.1);
        this.UIpositioner(this.uiLayout.buttonSoundPosition, this.uiLayout.scoreTextPosition);
        this._sceneController.camera.aspect = window.innerWidth / window.innerHeight;
        this._sceneController.camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight)
    }

    private _resizeForWidthScreen(): void {
        this.uiLayout.scoreTextPosition = {
            x: -(window.innerWidth/1000)+0.4,
            y: 1.5,
            z: this._player.playerModel.position.z
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
        this._sceneController.camera.fov = 30;
        this._sceneController.camera.position.y = 2;
        this.cameraIndent.z = 5;
        this._sceneController.camera.position.z = this._player.playerModel.position.z + this.cameraIndent.z;
        this._sceneController.camera.lookAt(
            this._player.playerModel.position.x,
            this._player.playerModel.position.y,
            this._player.playerModel.position.z - 2);
        this.uiLayout.scaleButtonSound = 0.4;
        this.rePosInstallBtn()
        this.rePosRestartBtn()
    }

    private _resizeForHeightScreen() {
        this.uiLayout.scoreTextPosition = {
            x: 0,
            y: 1.7,
            z: this._player.playerModel.position.z
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
        this._sceneController.camera.fov = 55;
        this._sceneController.camera.position.y = 2;
        this.cameraIndent.z = 3;
        this._sceneController.camera.position.z = this._player.playerModel.position.z + this.cameraIndent.z;
        this._sceneController.camera.lookAt(
            this._player.playerModel.position.x,
            this._player.playerModel.position.y,
            this._player.playerModel.position.z - 1);
        this.uiLayout.scaleButtonSound = 0.8;
        this.rePosInstallBtn()
        this.rePosRestartBtn()
    }

    public rePosInstallBtn(): void {
        this.installButton.text.scale.set(this.uiLayout.scaleButton, this.uiLayout.scaleButton, 0.0001);
        this.installButton.textBox.position.x = this._sceneController.camera.position.x+this.uiLayout.installButtonPosition.x;
        this.installButton.textBox.position.z = this._sceneController.camera.position.z+this.uiLayout.installButtonPosition.z;
        this.installButton.textBox.position.y = this.uiLayout.installButtonPosition.y;
        this.installButton.text.position.x = this.installButton.textBox.position.x;
        this.installButton.text.position.z = this.installButton.textBox.position.z;
        this.installButton.text.position.y = this.installButton.textBox.position.y;
    }

    public createInstallButton(): void{
        this.rePosInstallBtn();
        this.installButton.addToScene(this._sceneController.scene);
    }

    public rePosRestartBtn(): void {
        this.restartButton.text.scale.set(this.uiLayout.scaleButton, this.uiLayout.scaleButton, 0.0001);
        this.restartButton.textBox.position.x = this._sceneController.camera.position.x+this.uiLayout.restartButtonPosition.x;
        this.restartButton.textBox.position.z = this._sceneController.camera.position.z+this.uiLayout.restartButtonPosition.z;
        this.restartButton.textBox.position.y = this.uiLayout.restartButtonPosition.y;
        this.restartButton.text.position.x = this.restartButton.textBox.position.x;
        this.restartButton.text.position.z = this.restartButton.textBox.position.z;
        this.restartButton.text.position.y = this.restartButton.textBox.position.y;
    }

    public createRestartButton(): void {
        this.rePosRestartBtn();
        this.restartButton.addToScene(this._sceneController.scene);
    }
}