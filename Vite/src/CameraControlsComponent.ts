import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three"

export class CameraControlsComponent {
    private controls: OrbitControls;

    private readonly _camera: THREE.Camera;
    private readonly _renderer: THREE.WebGLRenderer;
    constructor(camera: THREE.Camera, renderer:THREE.WebGLRenderer ) {
        this._camera = camera;
        this._renderer = renderer;
    }

    public OnEnableControls(OnEnable:boolean): OrbitControls{
        if(OnEnable) {
            const controls = new OrbitControls(this._camera, this._renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.minDistance = 2;
            controls.maxDistance = 10;
            return this.controls;
        }
        else{
            return this.controls = new OrbitControls(this._camera, this._renderer.domElement);
        }
    }


}

