import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";


let fbxLoader = new FBXLoader();


const clock = new THREE.Clock();
let ticker = 0;

const canvas: Element = document.querySelector('#c');
const loader = new THREE.TextureLoader();
const bgTexture = loader.load('public/SkyBox.jpg')
const canvasAspect = canvas.clientWidth / canvas.clientHeight;
const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
const aspect = imageAspect / canvasAspect;





const playerModel = fbxLoader.load(
    './public/Character.fbx',
    (fbx) => {
        fbx.scale.set(2,2,2)
        scene.add(fbx);
    },
    function(progress){
        console.log(progress.loaded);
    }, function ( error ) {
        console.error( error );
    }
)

NormalizeBGTexture();

const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
    });

renderer.setSize(window.innerWidth, window.innerHeight);

const axesHelper = new THREE.AxesHelper(3);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);



const controls = CameraControls();


const scene = new THREE.Scene();
scene.background = bgTexture;


const platformForRun = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 20),
    new THREE.MeshBasicMaterial(
        {color: '#ffffff',}
    ));
scene.add(platformForRun);
platformForRun.position.y = -1;
platformForRun.position.z = -8;
camera.position.z = 1;
const light = new THREE.AmbientLight('#FFFFFF', 5);
scene.add(light);
scene.add(camera);
scene.add(axesHelper);




update();

function NormalizeBGTexture() {
    bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
    bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;

    bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
    bgTexture.repeat.y = aspect > 1 ? 1 : aspect;
}

function CameraControls() {
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    return controls;
}



function update(){
    controls.update();
    ticker += clock.getElapsedTime();
    console.log('frame');
    window.requestAnimationFrame(update);
    renderer.render(scene, camera);
}