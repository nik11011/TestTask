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
}