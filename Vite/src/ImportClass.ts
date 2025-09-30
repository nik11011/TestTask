import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {Scene} from "three";



export class ImportClass{
    private _fbxLoader = new FBXLoader();
    private _scene = THREE.Scene;
    constructor(_scene) {
        this._scene = _scene;
    }


    get fbxLoader(): FBXLoader {
        return this._fbxLoader;
    }

    set fbxLoader(value: FBXLoader) {
        this._fbxLoader = value;
    }

    get scene(): Scene {
        return this._scene;
    }

    set scene(value: Scene) {
        this._scene = value;
    }

    public async importModel(url: any) {
        return await this._fbxLoader.loadAsync(url);
    }
}