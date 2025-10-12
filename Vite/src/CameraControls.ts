import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three"

export class CameraControls{
    private readonly camera: THREE.Camera;
    private readonly renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    constructor(_camera: THREE.Camera, _renderer:THREE.WebGLRenderer ) {
        this.camera = _camera;
        this.renderer = _renderer;
    }

    OnEnableControls(OnEnable:boolean){
        if(OnEnable) {
            const controls = new OrbitControls(this.camera, this.renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.minDistance = 2;
            controls.maxDistance = 10;
            return this.controls;
        }
        else{
            return this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        }
    }


}

