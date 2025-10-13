import * as THREE from 'three';
import {Player} from './Player';
import {AssetLoader} from "./AssetLoader";
import {CameraControls} from "./CameraControls";
import {Coin} from "./Coin";
import {Bomb} from "./Bomb";
import {Wrath} from "./Wrath";
import {WrathInteraction} from "./WrathProperties"
import {Object3DEventMap} from "three";
import {Explosive} from "./Explosive";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import {createTextSprite} from "./Fonts";

let {clock, ticker, canvas, bgTexture, canvasAspect, player} = PreparationScene();
let touch = {
    x: 0,
}
//let canvasForText = document.createElement('canvas');
const volumeButton = document.getElementById("volumeButton");
let volume = false;
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
const {loopSound, CoinHopSound, BombHopSound, StepSound, LoseMusic, WinMusic, WrathSound} = await createAudio();
loadSounds()
if(volume == false){
    let audioContext = new window.AudioContext;
}
volumeButton.addEventListener('touchstart', (event)=>{
    event.stopPropagation();
    function volumeOff() {
        volumeButton.style.backgroundImage = "url('/public/sound_off_coffee.png')";
        volume = false;
        loopSound.pause();
        StepSound.pause();
    }

    function playTracks() {
        loopSound.play();
        StepSound.play();
    }

    if(volume == false) {
        if(playerDeath == false && win == 0) {
            if (firstTouch) {
                playTracks();
            }
        }
        volumeButton.style.backgroundImage = "url('/public/sound_on_coffee.png')";
        volume = true;
    }
    else if (volume == true){
        volumeOff();
    }
})
;
let firstTouch = false;

NormalizeBGTexture(canvasAspect);
const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
    });
renderer.setSize(window.innerWidth, window.innerHeight);
const {camera, scene} = CreateCameraAndScene();
const platformForRun = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 20),
    new THREE.MeshBasicMaterial(
        {color: '#ffffff',}
    ));
createPlatform();
editCameraPlacement();
const light = new THREE.AmbientLight('#FFFFFF', 5);
createGameScene();

camera.add(listener);
const importclass = new AssetLoader();
let coins = new Array<Coin>();
let bombs = new Array<Bomb>();
let wraths = new Array<Wrath>();
await createIteractionObject();
addingGateInteraction();
const cameraControls = new CameraControls(camera, renderer);
const {playerDance, playerRun, playerIdle} = await loadAnimation();
let playerAnimationMixer = new THREE.AnimationMixer(playerIdle);
let action = playerAnimationMixer.clipAction(playerIdle.animations[0]);
action.play();
scene.add(playerIdle);
let playerSpeed = 0;
let sideMoveSpeed = 0.1;
let expl = new Explosive();
let playerDeath = false;
let reloadButton = document.getElementById('reloadButton');
let downloadButton = document.getElementById('downloadButton');
reloadButton.addEventListener('touchstart', (touch) =>{
    touch.stopPropagation();
    location.reload();
})





const textSprite = createTextSprite('Привет, мир!', { font: '28px Arial' });
textSprite.position.y += 3.5;
scene.add(textSprite)
































update();

function playLoseSounds() {
    if(volume){
    StepSound.pause();
    BombHopSound.play();
    loopSound.setVolume(0);
    loopSound.pause();
    loopSound.remove();
    LoseMusic.play();
    }
    else{
        StepSound.pause();
        BombHopSound.pause();
        loopSound.setVolume(0);
        loopSound.pause();
        LoseMusic.pause();
    }
}

function playWinSounds() {
    if(volume) {
        loopSound.setVolume(0);
        loopSound.pause();
        loopSound.remove();
        StepSound.pause();
        WinMusic.play();
    }
    else{
        loopSound.pause();
        StepSound.pause();
        WinMusic.pause();
    }
}

function playCoinTake() {
    if(volume) {
        CoinHopSound.play();
    }
    else{
        CoinHopSound.pause();
    }
}
let win:number = 0;

function WrathSoundPlay() {
    if (volume) {
        WrathSound.play();
    } else {
        WrathSound.pause();
    }
}

function update(){
    if(playerDeath == false){
        for(let bomb of bombs){
            if(bomb.OnTrigger(playerRun)){
                playLoseSounds();
                removeObject(playerRun);
                removeObject(bomb.model);
                playerSpeed = 0;
                sideMoveSpeed = 0;
                playerDeath = true;
                expl.createExplosive(scene,
                bomb.model.position.x,
                bomb.model.position.y+0.1,
                bomb.model.position.z
                )
                reloadButton.style.display = 'inline-block'
                downloadButton.style.display = 'inline-block'
            }
        }
    }
    else{
        expl.animate(scene);
    }
    const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
    const aspect = imageAspect / canvasAspect;
    NormalizeBGTexture(aspect)
    ticker += clock.getElapsedTime();
    window.requestAnimationFrame(update);
    if(playerRun.position.z <= -18) {
        if(win == 0) {
            reloadButton.style.display = 'inline-block'
            downloadButton.style.display = 'inline-block'
            win+=1;
            playWinSounds();
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
    }
    for(let coin of coins){
        coin.AnimationRotate(0.1);
        if(coin.OnTrigger(playerRun)){
            playCoinTake();
            player.score += 1;
            coin.interactionalZone = 0;
            textSprite.updateText(player.score);
            removeObject(coin.model);
            }
        }
    for(let wrath of wraths){
        if(wrath.OnEnterInWrath(playerRun)){
            player.score = wrath.wrathInteraction.doInteraction(player.score);
            textSprite.updateText(player.score);
            WrathSoundPlay();

        }
    }
    run(playerSpeed);
    playerAnimationMixer.update(0.01);
    renderer.render(scene, camera);
}


function removeObject(model:THREE.Object3D){
    model.remove();
    model.clear();
}
function glueCameraTo(playerModel:THREE.Object3D<Object3DEventMap>, camera:THREE.Camera) {
    camera.position.x = playerModel.position.x;
    camera.position.z = playerModel.position.z + 3;
    camera.position.y = playerModel.position.y + 0.5;
    textSprite.position.z = camera.position.z-7;
}
function run(speed:number) {
        playerRun.position.z += speed;
        glueCameraTo(playerRun, camera);
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
    clientTouch.stopPropagation();
    if(win == 0) {
        if (firstTouch == false) {
            if (volume == false) {
                loopSound.pause();
                StepSound.pause();
            } else {
                loopSound.play();
                StepSound.play();
            }
            firstTouch = true;
            playerSpeed = -0.01;
            removeObject(playerIdle);
            scene.add(playerRun);
            playerAnimationMixer = new THREE.AnimationMixer(playerRun);
            action = playerAnimationMixer.clipAction(playerRun.animations[0]);
            action.play();
        } else {
            if (volume == true) {
                loopSound.play();
                StepSound.play();
            }
        }
    }
})


async function loadWrathArray() {
    wraths.push(
        new Wrath(scene, -0.5, -3, await importclass.importModel("public/Wrath.fbx")),
        new Wrath(scene, 0.5, -3, await importclass.importModel("public/Wrath.fbx")),
        new Wrath(scene, -0.5, -9.5, await importclass.importModel("public/Wrath.fbx")),
        new Wrath(scene, 0.5, -9.5, await importclass.importModel("public/Wrath.fbx"))
    );
}


async function loadCoinArray() {
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
}

async function loadBombArray() {
    bombs.push(
        new Bomb(scene, 0.5, -2, await importclass.importModel("public/bomb.fbx")),
        new Bomb(scene, 0.5, -6, await importclass.importModel("public/bomb.fbx")),
        new Bomb(scene, -0.5, -7, await importclass.importModel("public/bomb.fbx")),
        new Bomb(scene, -0.5, -8, await importclass.importModel("public/bomb.fbx"))
    );
}
function createPlatform() {
    platformForRun.position.y = -0.65;
    platformForRun.position.z = -8;
}
function addingGateInteraction() {
    wraths[0].wrathInteraction = new WrathInteraction(wraths[0], 2, 4);
    wraths[1].wrathInteraction = new WrathInteraction(wraths[1], 0, 1);
    wraths[2].wrathInteraction = new WrathInteraction(wraths[2], 1, 2);
    wraths[3].wrathInteraction = new WrathInteraction(wraths[3], 3, 2);
}
function createGameScene() {
    scene.add(platformForRun);
    scene.add(light);
    scene.add(camera);
}
function editCameraPlacement() {
    camera.position.z = 1;
    camera.position.y = 0.5;
}
function PreparationScene() {
    const clock = new THREE.Clock();
    let ticker = 0;
    const canvas: Element = document.querySelector('#c');
    const loader = new THREE.TextureLoader();
    const bgTexture = loader.load('public/SkyBox.jpg')
    let canvasAspect = canvas.clientWidth / canvas.clientHeight
    const player = new Player();
    return {clock, ticker, canvas, bgTexture, canvasAspect, player};
}

function CreateCameraAndScene() {
    const axesHelper = new THREE.AxesHelper(3);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);
    const scene = new THREE.Scene();
    scene.background = bgTexture;
    return {axesHelper, camera, scene};
}
window.addEventListener('resize', ()=>{

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.render(scene, camera);
})

async function loadAnimation() {
    const playerDance = await importclass.importModel("public/Dance.fbx");
    playerDance.rotation.y = Math.PI * 0.5;
    playerDance.position.y = -0.15;
    playerDance.scale.set(0.004, 0.004, 0.004);
    const playerRun = await importclass.importModel("public/Running.fbx");
    playerRun.rotation.y = Math.PI * 1;
    playerRun.position.y = -0.15;
    playerRun.scale.set(0.004, 0.004, 0.004);
    const playerIdle = await importclass.importModel("public/Idle.fbx");
    playerIdle.rotation.y = Math.PI * -1;
    playerIdle.position.y = -0.15;
    playerIdle.scale.set(0.004, 0.004, 0.004);
    return {playerDance, playerRun, playerIdle};
}

async function createIteractionObject() {
    await loadCoinArray();
    await loadBombArray();
    await loadWrathArray();
}

function loadSounds() {
    audioLoader.load('public/loopTrack.wav', function(buffer) {
        loopSound.setBuffer(buffer);
        loopSound.setLoop(true);
        loopSound.setVolume(0.5);
    });
    audioLoader.load('public/coin.mp3', function (buffer) {
        CoinHopSound.setBuffer(buffer);
        CoinHopSound.setVolume(0.5);
    });
    audioLoader.load('public/explosion_small_no_tail_03.wav', function (buffer) {
        BombHopSound.setBuffer(buffer);
        BombHopSound.setVolume(0.5);
    });
    audioLoader.load('public/step_0.mp3', function (buffer) {
        StepSound.setBuffer(buffer);
        StepSound.setVolume(0.5);
        StepSound.setLoop(true);
    });
    audioLoader.load('public/STGR_Fail_Lose_forMUSIC_A_1.wav', function (buffer) {
        LoseMusic.setBuffer(buffer);
        LoseMusic.setVolume(0.5);
    });
    audioLoader.load('public/STGR_Success_Win_forMUSIC_A_2.wav', function (buffer) {
        WinMusic.setBuffer(buffer);
        WinMusic.setVolume(0.5);
    });
    audioLoader.load('public/SFX_UI_Appear_Generic_2.wav', function (buffer) {
        WrathSound.setBuffer(buffer);
        WrathSound.setVolume(0.5);
    });
}

async function createAudio() {
    const loopSound = new THREE.Audio(listener);
    const CoinHopSound = new THREE.Audio(listener);
    const BombHopSound = new THREE.Audio(listener);
    const StepSound = new THREE.Audio(listener);
    const LoseMusic = new THREE.Audio(listener);
    const WinMusic = new THREE.Audio(listener);
    const WrathSound = new THREE.Audio(listener)
    return {loopSound, CoinHopSound, BombHopSound, StepSound, LoseMusic, WinMusic, WrathSound};
}


