import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {AudioLoader, Mesh, Object3D} from "three";

export class AssetLoaderComponent {
    private readonly _fbxLoader: FBXLoader = new FBXLoader();
    private readonly _fontLoader: FontLoader = new FontLoader();
    private readonly _audioLoader: AudioLoader = new AudioLoader();
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
    public async importModel(url: string): Promise<Object3D> {
        const model = await this._fbxLoader.loadAsync(url);

        // Настройка теней и материалов
        model.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

            }
        });
        return model;
    }

    public async loadAnimation() {
        const playerDance = await this.importModel("Dance.fbx");
        playerDance.rotation.y = Math.PI * 0.5;
        playerDance.position.y = -0.15;
        playerDance.scale.set(0.004, 0.004, 0.004);
        playerDance.castShadow = true;
        const playerRun = await this.importModel("Running.fbx");
        playerRun.rotation.y = Math.PI/1;
        playerRun.position.y = -0.15;
        playerRun.scale.set(0.004, 0.004, 0.004);
        playerRun.castShadow = true;
        const playerIdle = await this.importModel("Idle.fbx");
        playerIdle.rotation.y = Math.PI/1;
        playerIdle.position.y = -0.15;
        playerIdle.scale.set(0.004, 0.004, 0.004);
        playerIdle.castShadow = true;
        return {playerDance: playerDance, playerRun: playerRun, playerIdle};
    }
}