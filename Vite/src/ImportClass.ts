import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {AnimationLoader, Scene} from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";


export class ImportClass{
    private _fbxLoader = new FBXLoader();
    private _fontLoader = new FontLoader();
    constructor() {
    }



    get fbxLoader(): FBXLoader {
        return this._fbxLoader;
    }

    set fbxLoader(value: FBXLoader) {
        this._fbxLoader = value;
    }

    public async importText(url: any){
        return await this._fontLoader.loadAsync(url);
    }
    public async importModel(url: any) {
        return await this._fbxLoader.loadAsync(url);
    }
}