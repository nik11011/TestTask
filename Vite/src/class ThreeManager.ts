import * as THREE from 'three'

class ThreeManager{

    static MakeObject(_width: number, _height: number, _depth: number) : THREE.BoxGeometry{
        return new THREE.BoxGeometry(_width, _height, _depth);
    }
    static MakeObject(address: string){
        return new THREE.ObjectLoader();
    }
    static LoadTexture(address:string){
        return
    }
}