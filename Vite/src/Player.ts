import * as THREE from 'three';


class Player{
    geometryPlayer:THREE.BoxGeometry;
    meshPlayer:THREE.MeshBasicMaterial;
    constructor(geometry: THREE.BoxGeometry, mesh: THREE.MeshBasicMaterial) {
        this.geometryPlayer = geometry;
        this.meshPlayer = mesh;
    }

    MoveLeft(){
    }

    MoveRight(){

    }
}
