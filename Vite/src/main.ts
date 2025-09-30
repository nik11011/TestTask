import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {Player} from './Player'
import {ImportClass} from "./ImportClass"

//let fbxLoader = new FBXLoader();


const clock = new THREE.Clock();
let ticker = 0;

const canvas: Element = document.querySelector('#c');
const loader = new THREE.TextureLoader();
const bgTexture = loader.load('public/SkyBox.jpg')
const canvasAspect = canvas.clientWidth / canvas.clientHeight;
const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
const aspect = imageAspect / canvasAspect;




/*const playerModel = fbxLoader.load(
    './public/Character.fbx',
    (fbx) => {
        fbx.scale.set(2,2,2)
        scene.add(fbx);
    },
    function(progress){
        console.log(progress.loaded);
    }, function ( error ) {
        console.error(error);
    }
)*/

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
platformForRun.position.y = -0.65;
platformForRun.position.z = -8;
camera.position.z = 1;
const light = new THREE.AmbientLight('#FFFFFF', 5);
scene.add(light);
scene.add(camera);
scene.add(axesHelper);
const importclass = new ImportClass(scene);
const playerModel = await importclass.importModel("public/Character.fbx");
playerModel.rotation.y = Math.PI * 5;
playerModel.scale.set(2,2,2);
playerModel.position.y = -0.15;
scene.add(playerModel);

let coin = await importclass.importModel("public/Coin_Reskin.fbx");
coin.position.x = -0.5;
coin.position.z = -1;
scene.add(coin);
let coin1 = await importclass.importModel("public/Coin_Reskin.fbx");
coin1.position.x = -0.5;
coin1.position.z = -2;
scene.add(coin1);
let coin2 = await importclass.importModel("public/Coin_Reskin.fbx");
coin2.position.x = +0.5;
coin2.position.z = -4;
scene.add(coin2);
let coin3 = await importclass.importModel("public/Coin_Reskin.fbx");
coin3.position.x = -0.5;
coin3.position.z = -5;
scene.add(coin3);
let coin4 = await importclass.importModel("public/Coin_Reskin.fbx");
coin4.position.x = +0.5;
coin4.position.z = -7;
let coin5 = await importclass.importModel("public/Coin_Reskin.fbx");
coin5.position.x = +0.5;
coin5.position.z = -8;
scene.add(coin5);
let coin6 = await importclass.importModel("public/Coin_Reskin.fbx");
coin6.position.x = -0.5;
coin6.position.z = -9;
scene.add(coin6);
let coin7 = await importclass.importModel("public/Coin_Reskin.fbx");
coin7.position.x = -0.5;
coin7.position.z = -11;
scene.add(coin7);
let bomb = await importclass.importModel("public/bomb.fbx");
bomb.position.x = -0.5;
bomb.position.z = -7;
bomb.position.y = -0.1;
scene.add(bomb);
let bomb1 = await importclass.importModel("public/bomb.fbx");
bomb1.position.x = +0.5;
bomb1.position.z = -1;
bomb1.position.y = -0.1;
scene.add(bomb1);
let bomb2 = await importclass.importModel("public/bomb.fbx");
bomb2.position.x = +0.5;
bomb2.position.z = -6;
bomb2.position.y = -0.1;
scene.add(bomb2);
let bomb3 = await importclass.importModel("public/bomb.fbx");
bomb3.position.x = -0.5;
bomb3.position.z = -8;
bomb3.position.y = -0.1;
scene.add(bomb3);

let wrath = await importclass.importModel("public/Wrath.fbx");
wrath.rotation.y = Math.PI * -2.5;
wrath.position.z = -3;
wrath.position.x = -0.5;
wrath.scale.set(1.4,1.4,1.4);
scene.add(wrath);
let wrath1 = await importclass.importModel("public/Wrath.fbx");
wrath1.rotation.y = Math.PI * -2.5;
wrath1.position.z = -3;
wrath1.position.x = 0.5;
wrath1.scale.set(1.4,1.4,1.4);
scene.add(wrath1);
let wrath2 = await importclass.importModel("public/Wrath.fbx");
wrath2.rotation.y = Math.PI * -2.5;
wrath2.position.z = -9.5;
wrath2.position.x = -0.5;
wrath2.scale.set(1.4,1.4,1.4);
scene.add(wrath2);
let wrath3 = await importclass.importModel("public/Wrath.fbx");
wrath3.rotation.y = Math.PI * -2.5;
wrath3.position.z = -9.5;
wrath3.position.x = 0.5;
wrath3.scale.set(1.4,1.4,1.4);
scene.add(wrath3);
let groupBomb = THREE.Group;


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