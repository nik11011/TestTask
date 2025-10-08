import * as THREE from 'three';
import {Player} from './Player';
import {ImportClass} from "./ImportClass";
import {CameraControls} from "./CameraControls";
import {Coin} from "./Coin";
import {Bomb} from "./Bomb";
import {Wrath} from "./Wrath";
import {WrathInteraction} from "./WrathProperties"
import {Object3DEventMap} from "three";

//let fbxLoader = new FBXLoader();


const clock = new THREE.Clock();
let ticker = 0;
const canvas: Element = document.querySelector('#c');
const loader = new THREE.TextureLoader();
const bgTexture = loader.load('public/SkyBox.jpg')
let canvasAspect = canvas.clientWidth / canvas.clientHeight
const player = new Player();
let touch = {
    x: 0,
}
let firstTouch = false;

NormalizeBGTexture(canvasAspect);

const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
    });

renderer.setSize(window.innerWidth, window.innerHeight);

const axesHelper = new THREE.AxesHelper(3);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);




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
camera.rotation.y = -0.055;
camera.position.y = 0.5;
const light = new THREE.AmbientLight('#FFFFFF', 5);
scene.add(light);
scene.add(camera);
scene.add(axesHelper);

const importclass = new ImportClass();
let coins = new Array<Coin>();
coins.push(
    new Coin(scene, -0.5, -1, await importclass.importModel("public/Coin_Reskin.fbx")),
    new Coin(scene, -0.5, -2, await importclass.importModel("public/Coin_Reskin.fbx")),
    new Coin(scene, +0.5, -4, await importclass.importModel("public/Coin_Reskin.fbx")),
    new Coin(scene, -0.5, -5, await importclass.importModel("public/Coin_Reskin.fbx")),
    new Coin(scene, +0.5, -7, await importclass.importModel("public/Coin_Reskin.fbx")),
    new Coin(scene, +0.5, -8, await importclass.importModel("public/Coin_Reskin.fbx")),
    new Coin(scene, -0.5, -9, await importclass.importModel("public/Coin_Reskin.fbx")),
    new Coin(scene, -0.5, -11, await importclass.importModel("public/Coin_Reskin.fbx"))
);



let bombs = new Array<Bomb>();
bombs.push(
    new Bomb(scene, 0.5, -2, await importclass.importModel("public/bomb.fbx")),
    new Bomb(scene, 0.5, -6, await importclass.importModel("public/bomb.fbx")),
    new Bomb(scene, -0.5, -7, await importclass.importModel("public/bomb.fbx")),
    new Bomb(scene, -0.5, -8, await importclass.importModel("public/bomb.fbx"))
);

let wraths = new Array<Wrath>();
wraths.push(
    new Wrath(scene, -0.5,-3,await importclass.importModel("public/Wrath.fbx")),
    new Wrath(scene, 0.5,-3,await importclass.importModel("public/Wrath.fbx")),
    new Wrath(scene, -0.5,-9.5,await importclass.importModel("public/Wrath.fbx")),
    new Wrath(scene, 0.5,-9.5,await importclass.importModel("public/Wrath.fbx"))
);

wraths[0].wrathInteraction = new WrathInteraction(wraths[0], 2, 4);
wraths[1].wrathInteraction = new WrathInteraction(wraths[1], 0, 1);
wraths[2].wrathInteraction = new WrathInteraction(wraths[2], 1, 2);
wraths[3].wrathInteraction = new WrathInteraction(wraths[3], 3, 2);

resizeScoreText();


window.addEventListener('resize', ()=>{
    resizeScoreText();

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.render(scene, camera);
})



const cameraControls = new CameraControls(camera, renderer);

const playerDance = await importclass.importModel("public/Dance.fbx");
playerDance.rotation.y = Math.PI * 1;
playerDance.position.y = -0.15;
playerDance.scale.set(0.004,0.004,0.004);
const playerRun = await importclass.importModel("public/Running.fbx");
playerRun.rotation.y = Math.PI * 1;
playerRun.position.y = -0.175;
playerRun.scale.set(0.004,0.004,0.004);
const playerIdle = await importclass.importModel("public/Idle.fbx");
playerIdle.rotation.y = Math.PI * -1;
playerIdle.scale.set(0.004,0.004,0.004);
let playerAnimationMixer = new THREE.AnimationMixer(playerIdle);
let action = playerAnimationMixer.clipAction(playerIdle.animations[0]);
action.play();

scene.add(playerIdle);
let playerSpeed = 0;
update();

//cameraControls.OnEnableControls(false);
//cameraControls.controls.update();
let sideMoveSpeed = 0.1;
function update(){
    const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
    const aspect = imageAspect / canvasAspect;
    NormalizeBGTexture(aspect)
    ticker += clock.getElapsedTime();
    window.requestAnimationFrame(update);
    if(playerRun.position.z <= -18) {
        playerDance.position.z = playerRun.position.z;
        playerDance.position.x = playerRun.position.x;
        removeObject(playerRun);
        scene.add(playerDance);
        playerSpeed = 0;
        sideMoveSpeed = 0;
        playerAnimationMixer = new THREE.AnimationMixer(playerDance);
        action = playerAnimationMixer.clipAction(playerDance.animations[0]);
        action.play();
    }
    else{
        run(playerSpeed);
    for(let coin of coins){
        coin.AnimationRotate(0.1);
        if(coin.OnTrigger(playerRun)){
            player.score += 1;
            showScore(player.score);
            coin.interactionalZone = 0;
            removeObject(coin.model);
            resizeScoreText();
            }
        }
    }
    for(let wrath of wraths){
        if(wrath.OnEnterInWrath(playerRun)){
            player.score = wrath.wrathInteraction.doInteraction(player.score);
            showScore(player.score);
        }
    }
    playerAnimationMixer.update(0.01);
    renderer.render(scene, camera);
}

function removeObject(model:THREE.Object3D){
    model.remove();
    model.clear();
}
function GlueCameraTo(playerModel:THREE.Object3D<Object3DEventMap>, camera:THREE.Camera) {
    camera.position.x = playerModel.position.x;
    camera.position.z = playerModel.position.z + 3;
    camera.position.y = playerModel.position.y + 0.5;
}


function run(speed:number) {
        playerRun.position.z += speed;
        GlueCameraTo(playerRun, camera);
}

function showScore(scoreMessage){
    const scoreBox = document.getElementById('scoreText');
    scoreBox.innerText = scoreMessage;
    scoreBox.style.display = 'block';
}

function resizeScoreText() {
    const scoreText = document.getElementById("scoreText");
    scoreText.style.left = (window.innerWidth - scoreText.offsetWidth) / 2 + "px";
}
function NormalizeBGTexture(aspect) {
    bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
    bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;

    bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
    bgTexture.repeat.y = aspect > 1 ? 1 : aspect;
}
window.addEventListener('touchmove', (clientTouch)=>{
    touch.x = clientTouch.touches[0].clientX / window.innerWidth -0.5;
    if(playerRun.position.x < -1 || playerRun.position.x > 1) {
        playerRun.position.x = 0;
    }
    else{
        playerRun.position.x += touch.x * sideMoveSpeed;
    }
})

window.addEventListener('touchstart',(clientTouch)=>{
    if(firstTouch == false)
    {
        firstTouch = true;
        playerSpeed = -0.01;
        removeObject(playerIdle);
        scene.add(playerRun);
        playerAnimationMixer = new THREE.AnimationMixer(playerRun);
        action = playerAnimationMixer.clipAction(playerRun.animations[0]);
        action.play();
    }
    else{

    }
})