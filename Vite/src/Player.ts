import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {Object3D} from "three";
import {AssetLoader} from "./AssetLoader"


export class Player{
    public score: number = 0;
    private readonly importclass = new AssetLoader();
    public playerRun:Object3D;
    public playerDance:Object3D;
    public playerIdle:Object3D
    private touch = {x: 0};
    constructor(){
    }



    public CharacterControl(){

    }
}
