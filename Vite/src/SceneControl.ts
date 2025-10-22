import * as THREE from "three"
import {Wrath} from "./Wrath";
import {createTextMesh} from "./Font3D";
import {AssetLoader} from "./AssetLoader";
import {Coin} from "./Coin";
import {Bomb} from "./Bomb";
import {DirectionalLight} from "three";

export class SceneControl{
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight);
    scene = new THREE.Scene();
    importclass = new AssetLoader();

    constructor() {

    }

    createSun() {
        const light = new THREE.DirectionalLight('#ffffff', 7);
        light.castShadow = true;
        light.shadow.mapSize.set(16384, 16384);
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 100;
        light.shadow.camera.left = -50;
        light.shadow.camera.right = 50;
        light.shadow.camera.top = 50;
        light.shadow.camera.bottom = -50;
        light.position.set(5, 10, 5);
        this.scene.add(light)
    }
    async loadWrathArray(wraths:Array<Wrath>) {
        wraths.push(
            new Wrath(this.scene, -0.5, -4,
                await this.importclass.importModel("public/Wrath.fbx"),
                await createTextMesh("x4", 0.5, "#0004ff")),
            new Wrath(this.scene, 0.5, -4,
                await this.importclass.importModel("public/Wrath.fbx"),
                await createTextMesh("-1", 0.5, "#fd0000")),
            new Wrath(this.scene, -0.5, -12,
                await this.importclass.importModel("public/Wrath.fbx"),
                await createTextMesh("+2", 0.5, "#0004ff")),
            new Wrath(this.scene, 0.5, -12,
                await this.importclass.importModel("public/Wrath.fbx"),
                await createTextMesh("/2", 0.5, "#ff0000")),
            new Wrath(this.scene, -0.5, -20,
                await this.importclass.importModel("public/Wrath.fbx"),
                await createTextMesh("/5", 0.5, "#ff0000")),
            new Wrath(this.scene, 0.5, -20,
                await this.importclass.importModel("public/Wrath.fbx"),
                await createTextMesh("*4", 0.5, "#0004ff"))
        );
    }


    async loadCoinArray(coins: Array<Coin>) {
        coins.push(
            new Coin(this.scene, -0.5, -1, await this.importclass.importModel("public/Coin_Reskin.fbx")),
            new Coin(this.scene, -0.5, -3, await this.importclass.importModel("public/Coin_Reskin.fbx")),
            new Coin(this.scene, +0.5, -5, await this.importclass.importModel("public/Coin_Reskin.fbx")),
            new Coin(this.scene, -0.5, -7, await this.importclass.importModel("public/Coin_Reskin.fbx")),
            new Coin(this.scene, +0.5, -9, await this.importclass.importModel("public/Coin_Reskin.fbx")),
            new Coin(this.scene, +0.5, -11, await this.importclass.importModel("public/Coin_Reskin.fbx")),
            new Coin(this.scene, +0.5, -13, await this.importclass.importModel("public/Coin_Reskin.fbx")),
            new Coin(this.scene, +0.5, -16, await this.importclass.importModel("public/Coin_Reskin.fbx")),
            new Coin(this.scene, -0.5, -19, await this.importclass.importModel("public/Coin_Reskin.fbx"))
        );
    }

    async loadBombArray(bombs: Array<Bomb>) {
        bombs.push(
            new Bomb(this.scene, 0.5, -5, await this.importclass.importModel("public/bomb.fbx")),
            new Bomb(this.scene, 0.5, -9, await this.importclass.importModel("public/bomb.fbx")),
            new Bomb(this.scene, -0.5, -10, await this.importclass.importModel("public/bomb.fbx")),
            new Bomb(this.scene, -0.5, -15, await this.importclass.importModel("public/bomb.fbx"))
        );
    }
}