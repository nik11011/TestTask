import * as THREE from "three"
import {Player} from "./Player";
import {updateTextMesh} from "./Font3D";
import {SceneControl} from "./SceneControl";
import {UIManager} from "./UIManager";
import {AudioControl} from "./AudioControl";
import {AnimationManager} from "./AnimationManager";

export class InputEventsManager {
    deltaX = 0;
    startX = 0;
    currentX = 0;
    moving:boolean = false;
    sideMoveSpeed = 2500;
    player:Player;
    targerRotate = Math.PI;
    firstTouch = false;

    uiManager: UIManager;
    sceneController: SceneControl;
    audioController: AudioControl;
    playerRun: THREE.Object3D<THREE.Object3DEventMap>;
    animationManager: AnimationManager;

    private rayTouch = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();


    constructor(_player: Player,
                _uiManager: UIManager,
                _sceneController:SceneControl,
                _audioController: AudioControl,
                _playerRun:THREE.Object3D<THREE.Object3DEventMap>,
                _animationManager: AnimationManager) {
        this.player = _player;
        this.uiManager = _uiManager;
        this.sceneController = _sceneController;
        this.audioController = _audioController;
        this.playerRun = _playerRun;
        this.animationManager = _animationManager;
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onTouchStart(event: TouchEvent) {
        this.startX = event.touches[0].clientX;
        this.currentX = this.startX;
        this.moving = true;
    }

    onTouchMove(event: TouchEvent) {
        if (!this.moving) return;
        this.currentX = event.touches[0].clientX;
    }

    onTouchEnd() {
        this.moving = false;
    }

    onMouseDown(event: MouseEvent) {
        this.startX = event.clientX;
        this.currentX = this.startX;
        this.moving = true;
    }

    onMouseMove(event: MouseEvent) {
        if (!this.moving) return;
        this.currentX = event.clientX;
    }


    onMouseUp() {
        this.moving = false;
    }


    moveToSide(firstTouch:boolean, targetRotate:number, fixedDelta: number) {
        if (!firstTouch) return;
        const lerpFactor = 0.1;
        this.deltaX = this.currentX - this.startX;
        this.startX = this.currentX;
        const normalized = this.deltaX / window.innerWidth;
        const targetX = this.player.playerModel.position.x + normalized * this.sideMoveSpeed * fixedDelta;
        this.player.playerModel.position.x = THREE.MathUtils.lerp(this.player.playerModel.position.x, targetX, lerpFactor);

        const targetRotationY = targetRotate - normalized * 2000 * fixedDelta;
        this.player.playerModel.rotation.y = THREE.MathUtils.lerp(this.player.playerModel.rotation.y, targetRotationY, lerpFactor);

        if (this.player.playerModel.position.x > 1) this.player.playerModel.position.x = 1;
        if (this.player.playerModel.position.x < -1) this.player.playerModel.position.x = -1;
    }

    onClick(event) {
        this.rayTouch.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.rayTouch.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.rayTouch, this.sceneController.camera);
        const intersects = this.raycaster.intersectObjects(this.sceneController.scene.children, false);
        if (intersects.length > 0)
        {
            const firstIntersect = intersects[0];
            if (firstIntersect.object == this.uiManager.buttonSound.button){
                if (this.uiManager.buttonSound.button.material.map == this.uiManager.buttonSound.textureOffSound) {
                    this.uiManager.buttonSound.button.material.map = this.uiManager.buttonSound.textureOnSound;
                    this.audioController.volume = true;
                }
                else{
                    this.uiManager.buttonSound.button.material.map = this.uiManager.buttonSound.textureOffSound;
                    this.audioController.volume = false;
                }
            }
            else if(firstIntersect.object == this.uiManager.restartButton.textBox || firstIntersect.object == this.uiManager.restartButton.text){
                location.reload();
            }
            else if(firstIntersect.object != this.uiManager.buttonSound.button && firstIntersect.object != this.uiManager.restartButton.textBox)
                if (this.player.win == 0)
                    if (this.firstTouch == false) {
                        this.firstTouch = true;
                        this.uiManager.scoreText.scale.set(0.1,0.1,0.0001);
                        updateTextMesh(this.uiManager.scoreText, "Score");

                        this.player.replaceModel(this.playerRun);
                        this.sceneController.scene.add(this.player.playerModel);
                        this.animationManager.changeAnimation(this.player.playerModel);
                        this.animationManager.playAnimation();
                    }
        }
    }
}
