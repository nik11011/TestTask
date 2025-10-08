import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {Object3D} from "three";
import {ImportClass} from "./ImportClass"


export class Player{
    public score: number = 0;
    private readonly importclass = new ImportClass();
    public playerRun:Object3D;
    public playerDance:Object3D;
    public playerIdle:Object3D
    private touch = {x: 0};
    constructor(){
    }



    public CharacterControl(){

    }
}
