import {Wrath} from "./InteractiveObjects/Wrath";
import {createTextMesh} from "./Font3DComponent";
import {AssetLoaderComponent} from "./AssetLoaderComponent";
import {Coin} from "./InteractiveObjects/Coin";
import {Bomb} from "./InteractiveObjects/Bomb";
import {DirectionalLight, PerspectiveCamera, Scene} from "three";
import {DoubleWraths} from "./DoubleWraths";
import {InteractionalScoreComponent, WrathInteraction} from "./WrathPropertiesComponent";

export class SceneControlComponent {
    public camera: PerspectiveCamera = new PerspectiveCamera(65, window.innerWidth / window.innerHeight);
    public scene: Scene = new Scene();
    private readonly _importclass: AssetLoaderComponent = new AssetLoaderComponent();

    constructor() {

    }

    createSun() {
        const light = new DirectionalLight('#ffffff', 5);
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
                await this._importclass.importModel("Wrath.fbx"),
                await createTextMesh("x4", 0.5, "#0004ff")),
            new Wrath(this.scene, 0.5, -4,
                await this._importclass.importModel("Wrath.fbx"),
                await createTextMesh("-1", 0.5, "#fd0000")),
            new Wrath(this.scene, -0.5, -12,
                await this._importclass.importModel("Wrath.fbx"),
                await createTextMesh("+2", 0.5, "#0004ff")),
            new Wrath(this.scene, 0.5, -12,
                await this._importclass.importModel("Wrath.fbx"),
                await createTextMesh("/2", 0.5, "#ff0000")),
            new Wrath(this.scene, -0.5, -20,
                await this._importclass.importModel("Wrath.fbx"),
                await createTextMesh("/5", 0.5, "#ff0000")),
            new Wrath(this.scene, 0.5, -20,
                await this._importclass.importModel("Wrath.fbx"),
                await createTextMesh("*4", 0.5, "#0004ff"))
        );
    }

    fillDoubleWrathsInteraction(wraths: Wrath[]) {
        const doubleWrathsArray = new Array<DoubleWraths>(
            new DoubleWraths(wraths[0], wraths[1]),
            new DoubleWraths(wraths[2], wraths[3]),
            new DoubleWraths(wraths[4], wraths[5])
        );
        return doubleWrathsArray;
    }
    addingGateInteraction(wraths: Wrath[]) {
        wraths[0].wrathInteraction = new WrathInteraction(InteractionalScoreComponent.MULTIPLY, 4);
        wraths[1].wrathInteraction = new WrathInteraction(InteractionalScoreComponent.MINUS, 1);
        wraths[2].wrathInteraction = new WrathInteraction(InteractionalScoreComponent.PLUS, 2);
        wraths[3].wrathInteraction = new WrathInteraction(InteractionalScoreComponent.DIVIDE, 2);
        wraths[4].wrathInteraction = new WrathInteraction(InteractionalScoreComponent.DIVIDE, 5);
        wraths[5].wrathInteraction = new WrathInteraction(InteractionalScoreComponent.MULTIPLY, 4);
    }


    async loadCoinArray(coins: Array<Coin>) {
        coins.push(
            new Coin(this.scene, -0.5, -1, await this._importclass.importModel("Coin_Reskin.fbx")),
            new Coin(this.scene, -0.5, -3, await this._importclass.importModel("Coin_Reskin.fbx")),
            new Coin(this.scene, +0.5, -5, await this._importclass.importModel("Coin_Reskin.fbx")),
            new Coin(this.scene, -0.5, -7, await this._importclass.importModel("Coin_Reskin.fbx")),
            new Coin(this.scene, +0.5, -9, await this._importclass.importModel("Coin_Reskin.fbx")),
            new Coin(this.scene, +0.5, -11, await this._importclass.importModel("Coin_Reskin.fbx")),
            new Coin(this.scene, +0.5, -13, await this._importclass.importModel("Coin_Reskin.fbx")),
            new Coin(this.scene, +0.5, -16, await this._importclass.importModel("Coin_Reskin.fbx")),
            new Coin(this.scene, -0.5, -19, await this._importclass.importModel("Coin_Reskin.fbx"))
        );
    }

    async loadBombArray(bombs: Array<Bomb>) {
        bombs.push(
            new Bomb(this.scene, 0.5, -5, await this._importclass.importModel("bomb.fbx")),
            new Bomb(this.scene, 0.5, -9, await this._importclass.importModel("bomb.fbx")),
            new Bomb(this.scene, -0.5, -10, await this._importclass.importModel("bomb.fbx")),
            new Bomb(this.scene, -0.5, -15, await this._importclass.importModel("bomb.fbx"))
        );
    }
}