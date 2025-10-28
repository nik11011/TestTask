import * as THREE from "three"
import {Player} from "./InteractiveObjects/Player";
import {updateTextMesh} from "./Font3DComponent";
import {SceneControlComponent} from "./SceneControlComponent";
import {UIManagerComponent} from "./UIManagerComponent";
import {AudioControlComponent} from "./AudioControlComponent";
import {AnimationManagerComponent} from "./AnimationManagerComponent";
import {Raycaster, Vector2} from "three";

export class InputEventsComponent {
    public moving:boolean = false;
    public sideMoveSpeed: number = 2500;
    public firstTouch: boolean = false;

    private _deltaX: number = 0;
    private _startX: number = 0;
    private _currentX: number = 0;
    private readonly _player: Player;
    private readonly _uiManager: UIManagerComponent;
    private readonly _sceneController: SceneControlComponent;
    private readonly _audioController: AudioControlComponent;
    private readonly _playerRun: THREE.Object3D<THREE.Object3DEventMap>;
    private readonly _animationManager: AnimationManagerComponent;

    private readonly _rayTouch: Vector2 = new THREE.Vector2();
    private readonly _raycaster: Raycaster = new THREE.Raycaster();


    constructor(player: Player,
                uiManager: UIManagerComponent,
                sceneController:SceneControlComponent,
                audioController: AudioControlComponent,
                playerRun:THREE.Object3D<THREE.Object3DEventMap>,
                animationManager: AnimationManagerComponent) {
        this._player = player;
        this._uiManager = uiManager;
        this._sceneController = sceneController;
        this._audioController = audioController;
        this._playerRun = playerRun;
        this._animationManager = animationManager;
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onClick = this.onClick.bind(this);
    }


    onTouchStart(event: TouchEvent) {
        this._startX = event.touches[0].clientX;
        this._currentX = this._startX;
        this.moving = true;
    }

    onTouchMove(event: TouchEvent) {
        if (!this.moving) return;
        this._currentX = event.touches[0].clientX;
    }

    onTouchEnd() {
        this.moving = false;
    }

    onMouseDown(event: MouseEvent) {
        this._startX = event.clientX;
        this._currentX = this._startX;
        this.moving = true;
    }

    onMouseMove(event: MouseEvent) {
        if (!this.moving) return;
        this._currentX = event.clientX;
    }


    onMouseUp() {
        this.moving = false;
    }


    moveToSide(firstTouch:boolean, targetRotate:number, fixedDelta: number) {
        if (!firstTouch) return;
        const lerpFactor = 0.1;
        this._deltaX = this._currentX - this._startX;
        this._startX = this._currentX;
        const normalized = this._deltaX / window.innerWidth;
        const targetX = this._player.playerModel.position.x + normalized * this.sideMoveSpeed * fixedDelta;
        this._player.playerModel.position.x = THREE.MathUtils.lerp(this._player.playerModel.position.x, targetX, lerpFactor);

        const targetRotationY = targetRotate - normalized * 2000 * fixedDelta;
        this._player.playerModel.rotation.y = THREE.MathUtils.lerp(this._player.playerModel.rotation.y, targetRotationY, lerpFactor);

        if (this._player.playerModel.position.x > 1) this._player.playerModel.position.x = 1;
        if (this._player.playerModel.position.x < -1) this._player.playerModel.position.x = -1;
    }

    onClick(event) {
        this._rayTouch.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._rayTouch.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this._raycaster.setFromCamera(this._rayTouch, this._sceneController.camera);
        const intersects = this._raycaster.intersectObjects(this._sceneController.scene.children, false);
        if (intersects.length > 0)
        {
            const firstIntersect = intersects[0];
            if (firstIntersect.object == this._uiManager.buttonSound.button){
                if (this._uiManager.buttonSound.button.material.map == this._uiManager.buttonSound.textureOffSound) {
                    this._uiManager.buttonSound.button.material.map = this._uiManager.buttonSound.textureOnSound;
                    this._audioController.volume = true;
                }
                else{
                    this._uiManager.buttonSound.button.material.map = this._uiManager.buttonSound.textureOffSound;
                    this._audioController.volume = false;
                }
            }
            else if(firstIntersect.object == this._uiManager.restartButton.textBox || firstIntersect.object == this._uiManager.restartButton.text){
                location.reload();
            }
            else if(firstIntersect.object != this._uiManager.buttonSound.button && firstIntersect.object != this._uiManager.restartButton.textBox)
                if (this._player.win == 0)
                    if (this.firstTouch == false) {
                        this.firstTouch = true;
                        this._uiManager.scoreText.scale.set(0.1,0.1,0.0001);
                        updateTextMesh(this._uiManager.scoreText, "Score");

                        this._player.replaceModel(this._playerRun);
                        this._sceneController.scene.add(this._player.playerModel);
                        this._animationManager.changeAnimation(this._player.playerModel);
                        this._animationManager.playAnimation();
                    }
        }
    }
}
