import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {AudioLoader} from "three";

export class AssetLoader {
    private readonly _fbxLoader = new FBXLoader();
    private readonly _fontLoader = new FontLoader();
    private readonly _audioLoader = new AudioLoader();
    constructor() {
    }


    get fbxLoader(): FBXLoader {
        return this._fbxLoader;
    }

    public async importText(url: any){
        return await this._fontLoader.loadAsync(url);
    }
    public async importAudio(url: any){
        return await this._audioLoader.loadAsync(url);
    }
    public async importModel(url: any) {
        return await this._fbxLoader.loadAsync(url);
    }

    async loadAnimation() {
        const playerDance = await this.importModel("public/Dance.fbx");
        playerDance.rotation.y = Math.PI * 0.5;
        playerDance.position.y = -0.15;
        playerDance.scale.set(0.004, 0.004, 0.004);
        const playerRun = await this.importModel("public/Running.fbx");
        playerRun.rotation.y = Math.PI/1;
        playerRun.position.y = -0.15;
        playerRun.scale.set(0.004, 0.004, 0.004);
        const playerIdle = await this.importModel("public/Idle.fbx");
        playerIdle.rotation.y = Math.PI/1;
        playerIdle.position.y = -0.15;
        playerIdle.scale.set(0.004, 0.004, 0.004);
        return {playerDance, playerRun: playerRun, playerIdle};
    }
}