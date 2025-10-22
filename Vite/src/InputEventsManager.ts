import * as THREE from "three"
import {Player} from "./Player";

export class InputEventsManager {
    deltaX = 0;
    startX = 0;
    currentX = 0;
    moving:boolean = false;
    sideMoveSpeed = 2500;
    player:Player;
    targerRotate = Math.PI;


    constructor(_player: Player) {
        this.player = _player;
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
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
}