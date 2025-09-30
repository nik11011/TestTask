import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";


export class Player{
    fbxLoader = new FBXLoader();
    public scene: THREE.Scene;
    public model?: THREE.Group;

    public CharacterControl(){

    }
}
