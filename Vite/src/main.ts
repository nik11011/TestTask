import * as THREE from 'three';
import {Player} from './Player';
import {AssetLoader} from "./AssetLoader";
import {Coin} from "./Coin";
import {Bomb} from "./Bomb";
import {Wrath} from "./Wrath";
import {interactionalWithScore, WrathInteraction} from "./WrathProperties"
import {Object3DEventMap} from "three";
import {Explosive} from "./Explosive";
import {createTextMesh, updateTextMesh} from "./Font3D";

let {clock, deltaTime, canvas, bgTexture, canvasAspect, player} = PreparationScene();
let touch = {
    x: 0
}
let startX = 0;
let currentX = 0;
let moving = false;
let targetRotate;
let volume = false;
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
const {loopSound, CoinHopSound, BombHopSound, StepSound, LoseMusic, WinMusic, WrathSound} = await createAudio();
loadSounds()

let firstTouch = false;
let cameraIndent = {
    x:0,
    y:0,
    z:0
}

NormalizeBGTexture(canvasAspect);
const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
    });
renderer.setSize(window.innerWidth, window.innerHeight);
const {camera, scene} = CreateCameraAndScene();
const platformForRun = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 40),
    new THREE.MeshBasicMaterial(
        {color: '#ffffff', shadowSide: true}
    ));
createPlatform();
const light = new THREE.AmbientLight('#FFFFFF', 5);

let scoreText = await createTextMesh("Take coin, avoid bomb", 0.5, '#ca9100');
scoreText.scale.set(0.1,0.1,0.0001);
scoreText.position.set(0, 0, 0);
scoreText.material.depthFunc = 7;
scoreText.lookAt(
    camera.position.x,
    camera.position.y-1,
    camera.position.z);
scene.add(scoreText);
createGameScene();


camera.add(listener);
const importclass = new AssetLoader();
let coins = new Array<Coin>();
let bombs = new Array<Bomb>();
let wraths = new Array<Wrath>();
await createIteractionObject();
addingGateInteraction();

const {playerDance, playerRun, playerIdle} = await loadAnimation();
let playerAnimationMixer = new THREE.AnimationMixer(playerIdle);
let action = playerAnimationMixer.clipAction(playerIdle.animations[0]);
action.play();
scene.add(playerIdle);
let playerSpeed = 0;
let sideMoveSpeed = 0.05;
let expl = new Explosive();
let playerDeath = false;
function playLoseSounds() {
    if (volume){
    StepSound.pause();
    BombHopSound.play();
    loopSound.setVolume(0);
    loopSound.pause();
    loopSound.remove();
    LoseMusic.play();
    }
    else {
        StepSound.pause();
        BombHopSound.pause();
        loopSound.setVolume(0);
        loopSound.pause();
        LoseMusic.pause();
    }
}

function playWinSounds() {
    if (volume) {
        loopSound.setVolume(0);
        loopSound.pause();
        loopSound.remove();
        StepSound.pause();
        StepSound.remove;
        WinMusic.play();
    }
    else {
        loopSound.pause();
        StepSound.pause();
        WinMusic.pause();
    }
}

function playCoinTake() {
    if (volume) {
        CoinHopSound.play();
    }
    else {
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
let redPlaneGeometry = new THREE.PlaneGeometry(0.75,0.25);
let redPlaneMaterial = new THREE.MeshBasicMaterial({color: "#730000"});
let redPlane = new THREE.Mesh(
    redPlaneGeometry,
    redPlaneMaterial
);
redPlane.lookAt(
    camera.position.x,
    camera.position.y-1,
    camera.position.z,
);
coins[8].model.scale.set(0.5,0.5,0.5);
scene.add(redPlane);

let textureLoader = new THREE.TextureLoader();
let textureOffSound = await textureLoader.loadAsync('public/sound_off_coffee.png');
let textureOnSound = await textureLoader.loadAsync('public/sound_on_coffee.png');
let buttonOfSound = new THREE.MeshBasicMaterial({
    map: textureOffSound,
    transparent:true,
    depthFunc: 1
});

let buttonSoundGeometry = new THREE.PlaneGeometry(0.2,0.2);
let buttonSound = new THREE.Mesh(
    buttonSoundGeometry,
    buttonOfSound
);
buttonSound.scale.set(0.3,0.3,0.3);
scene.add(buttonSound)
let installBtn;
let restartBtn;
let installText = await createTextMesh('Install',1,'#000000');
let restartText = await createTextMesh('Restart',1,'#000000');

SizeOnScreen();

const raycaster = new THREE.Raycaster();
const rayTouch = new THREE.Vector2();




let textureFinger : THREE.Texture;
textureFinger = await textureLoader.loadAsync("public/fingerIcon.png");
let fingerPlaneGeometry = new THREE.PlaneGeometry(0.5,0.5);
let fingerMaterial = new THREE.MeshBasicMaterial({map: textureFinger, transparent:true, depthFunc: 7});
let finger = new THREE.Mesh(
    fingerPlaneGeometry,
    fingerMaterial
);
finger.scale.set(0.5,0.5,0.5);
let fingerAnimFrame = 0;
let fingerTutorial = new THREE.Mesh(
    fingerPlaneGeometry,
    fingerMaterial
)
scene.add(fingerTutorial);
let left = false;
let right = true;
update();
function update(){
    Tutorial();
    moveToSide();
    if (playerDeath == false){
        for(let bomb of bombs){
            if (bomb.OnTrigger(playerRun)){
                playLoseSounds();
                removeObject(playerRun);
                removeObject(bomb.model);
                playerSpeed = 0;
                sideMoveSpeed = 0;
                playerDeath = true;
                expl.createExplosive(scene,
                bomb.model.position.x,
                bomb.model.position.y+0.1,
                bomb.model.position.z)
                createRestartButton(camera);
                createInstallButton(camera);
                scene.add(installBtn);
                scene.add(installText);
                scene.add(restartBtn);
                scene.add(restartText);
                finger.position.z = installBtn.position.z+0.2;
                finger.position.y = installBtn.position.y-0.1;
                finger.position.x = installBtn.position.x+0.2;
                scene.add(finger);
            }
        }
    }
    else {
        expl.animate(scene);
    }
    const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
    const aspect = imageAspect / canvasAspect;
    NormalizeBGTexture(aspect)
    deltaTime += clock.getElapsedTime();
    window.requestAnimationFrame(update);
    if (playerRun.position.z <= -24) {
        if (win == 0) {
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
            createRestartButton(camera);
            createInstallButton(camera);
            scene.add(installBtn);
            scene.add(installText);
            scene.add(restartBtn);
            scene.add(restartText);
            finger.position.z = installBtn.position.z+0.2;
            finger.position.y = installBtn.position.y-0.2;
            finger.position.x = installBtn.position.x+0.2;
            scene.add(finger);
        }
    }
    for (let coin of coins) {
        coin.AnimationRotate(0.1);
        if (coin.OnTrigger(playerRun)){
            playCoinTake();
            player.score += 1;
            coin.interactionalZone = 0;
            updateTextMesh(scoreText, `${player.score}`)
            removeObject(coin.model);
            }
        }
    for (let wrath of wraths) {
        if (wrath.OnEnterInWrath(playerRun)){
            player.score = wrath.wrathInteraction.doInteraction(player.score);
            updateTextMesh(scoreText, `${player.score}`)
            WrathSoundPlay();
            removeObject(wrath.model);
            updateTextMesh(wrath.textMesh, "");
        }
    }
    if (fingerAnimFrame<=100) {
    finger.position.x-=0.001;
    fingerAnimFrame+=1;
    }
    else{
        finger.position.x+=0.1;
        fingerAnimFrame = 0;
    }
    if(firstTouch)
    {
    run(playerSpeed);
    }
    playerAnimationMixer.update(0.01);
    if (!moving) {
        playerRun.rotation.y += (targetRotate - playerRun.rotation.y) * 0.1;
    }
    console.log(deltaTime);
    renderer.render(scene, camera);
}

function MoveToLeftPosition() {
    if (fingerTutorial.position.x >= -0.3) {
        fingerTutorial.position.x -= 0.01;
    } else {
        right = false;
        left = true;
    }
}

function MoveToRightPosition() {
    if (fingerTutorial.position.x <= 0.4) {
        fingerTutorial.position.x += 0.01;
    } else {
        right = true;
        left = false;
    }
}

function AnimationTutorial() {
    if (left == false) {
        MoveToLeftPosition();
    }
    if (right == false) {
        MoveToRightPosition();
    }
}

function Tutorial(){
    if (firstTouch == false){
        AnimationTutorial();
    }
    else{
        scene.remove(fingerTutorial);
    }
}


function removeObject(model:THREE.Object3D){
    model.remove();
    model.clear();
}
function glueCameraTo(playerModel:THREE.Object3D<Object3DEventMap>, camera:THREE.Camera) {
        camera.position.x = playerModel.position.x;
        camera.position.z = playerModel.position.z + cameraIndent.z;
        scoreText.position.set(
            playerModel.position.x,
            playerModel.position.y + 2.1,
            playerModel.position.z - 1
        )
        buttonSound.position.set(
            camera.position.x - 0.13,
            camera.position.y - 0.5,
            camera.position.z - 0.3
        )
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





async function loadWrathArray() {
    wraths.push(
        new Wrath(scene, -0.5, -4,
            await importclass.importModel("public/Wrath.fbx"),
            await createTextMesh("x4", 0.5, "#0004ff")),
        new Wrath(scene, 0.5, -4,
            await importclass.importModel("public/Wrath.fbx"),
            await createTextMesh("-1", 0.5, "#fd0000")),
        new Wrath(scene, -0.5, -12,
            await importclass.importModel("public/Wrath.fbx"),
            await createTextMesh("+2", 0.5, "#0004ff")),
        new Wrath(scene, 0.5, -12,
            await importclass.importModel("public/Wrath.fbx"),
            await createTextMesh("/2", 0.5, "#ff0000")),
        new Wrath(scene, -0.5, -20,
            await importclass.importModel("public/Wrath.fbx"),
            await createTextMesh("/5", 0.5, "#ff0000")),
        new Wrath(scene, 0.5, -20,
            await importclass.importModel("public/Wrath.fbx"),
            await createTextMesh("*4", 0.5, "#0004ff"))
    );
}


async function loadCoinArray() {
    coins.push(
        new Coin(scene, -0.5, -1, await importclass.importModel("public/Coin_Reskin.fbx")),
        new Coin(scene, -0.5, -3, await importclass.importModel("public/Coin_Reskin.fbx")),
        new Coin(scene, +0.5, -5, await importclass.importModel("public/Coin_Reskin.fbx")),
        new Coin(scene, -0.5, -7, await importclass.importModel("public/Coin_Reskin.fbx")),
        new Coin(scene, +0.5, -9, await importclass.importModel("public/Coin_Reskin.fbx")),
        new Coin(scene, +0.5, -11, await importclass.importModel("public/Coin_Reskin.fbx")),
        new Coin(scene, +0.5, -13, await importclass.importModel("public/Coin_Reskin.fbx")),
        new Coin(scene, +0.5, -16, await importclass.importModel("public/Coin_Reskin.fbx")),
        new Coin(scene, -0.5, -19, await importclass.importModel("public/Coin_Reskin.fbx"))
    );
}

async function loadBombArray() {
    bombs.push(
        new Bomb(scene, 0.5, -5, await importclass.importModel("public/bomb.fbx")),
        new Bomb(scene, 0.5, -9, await importclass.importModel("public/bomb.fbx")),
        new Bomb(scene, -0.5, -10, await importclass.importModel("public/bomb.fbx")),
        new Bomb(scene, -0.5, -15, await importclass.importModel("public/bomb.fbx"))
    );
}
function createPlatform() {
    platformForRun.position.y = -0.65;
    platformForRun.position.z = -18;
}
function addingGateInteraction() {
    wraths[0].wrathInteraction = new WrathInteraction(interactionalWithScore.MULTIPLY, 4);
    wraths[1].wrathInteraction = new WrathInteraction(interactionalWithScore.MINUS, 1);
    wraths[2].wrathInteraction = new WrathInteraction(interactionalWithScore.PLUS, 2);
    wraths[3].wrathInteraction = new WrathInteraction(interactionalWithScore.DIVIDE, 2);
    wraths[4].wrathInteraction = new WrathInteraction(interactionalWithScore.DIVIDE, 5);
    wraths[5].wrathInteraction = new WrathInteraction(interactionalWithScore.MULTIPLY, 4);

}
function createGameScene() {
    scene.add(platformForRun);
    scene.add(light);
    scene.add(camera);
}
function PreparationScene() {
    const clock = new THREE.Clock();
    let deltaTime = 0;
    const canvas: Element = document.querySelector('#c');
    const loader = new THREE.TextureLoader();
    const bgTexture = loader.load('public/SkyBox.jpg')
    let canvasAspect = canvas.clientWidth / canvas.clientHeight
    const player = new Player();
    return {clock, deltaTime, canvas, bgTexture, canvasAspect, player};
}


function CreateCameraAndScene() {
    const axesHelper = new THREE.AxesHelper(3);
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight);
    const scene = new THREE.Scene();
    scene.background = bgTexture;
    return {axesHelper, camera, scene};
}

function SizeOnScreen() {
    if(window.innerWidth>window.innerHeight){
        camera.fov = 30;
        camera.position.y = 2;
        cameraIndent.z = 5;
        camera.position.z = playerRun.position.z + cameraIndent.z;
        camera.lookAt(
            playerRun.position.x,
            playerRun.position.y,
            playerRun.position.z-2);
    }
    else if(window.innerHeight>window.innerWidth) {
        camera.fov = 55;
        camera.position.y = 2;
        cameraIndent.z = 3;
        camera.position.z = playerRun.position.z + cameraIndent.z;
        camera.lookAt(
            playerRun.position.x,
            playerRun.position.y,
            playerRun.position.z-1);
    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
}

//screen.orientation.addEventListener('change', SizeOnScreen);
window.addEventListener('resize', SizeOnScreen);

async function loadAnimation() {
    const playerDance = await importclass.importModel("public/Dance.fbx");
    playerDance.rotation.y = Math.PI * 0.5;
    playerDance.position.y = -0.15;
    playerDance.scale.set(0.004, 0.004, 0.004);
    const playerRun = await importclass.importModel("public/Running.fbx");
    playerRun.rotation.y = Math.PI/1;
    targetRotate = Math.PI/1;
    playerRun.position.y = -0.15;
    playerRun.scale.set(0.004, 0.004, 0.004);
    const playerIdle = await importclass.importModel("public/Idle.fbx");
    playerIdle.rotation.y = Math.PI/1;
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
    audioLoader.load('public/loopTrack.mp3', function(buffer) {
        loopSound.setBuffer(buffer);
        loopSound.setLoop(true);
        loopSound.setVolume(0.5);
    });
    audioLoader.load('public/coin.mp3', function (buffer) {
        CoinHopSound.setBuffer(buffer);
        CoinHopSound.setVolume(0.5);
    });
    audioLoader.load('public/explosion_small_no_tail_03.mp3', function (buffer) {
        BombHopSound.setBuffer(buffer);
        BombHopSound.setVolume(0.5);
    });
    audioLoader.load('public/step_0.mp3', function (buffer) {
        StepSound.setBuffer(buffer);
        StepSound.setVolume(0.5);
        StepSound.setLoop(true);
    });
    audioLoader.load('public/STGR_Fail_Lose_forMUSIC_A_1.mp3', function (buffer) {
        LoseMusic.setBuffer(buffer);
        LoseMusic.setVolume(0.5);
    });
    audioLoader.load('public/STGR_Success_Win_forMUSIC_A_2.mp3', function (buffer) {
        WinMusic.setBuffer(buffer);
        WinMusic.setVolume(0.5);
        WinMusic.setLoop(true);
    });
    audioLoader.load('public/SFX_UI_Appear_Generic_2.mp3', function (buffer) {
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



window.addEventListener('touchstart', onTouchStart);
window.addEventListener('touchend', onTouchEnd);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
function onTouchStart(event: TouchEvent) {
    startX = event.touches[0].clientX;
    currentX = startX;
    moving = true;
}

function onTouchMove(event: TouchEvent) {
    if (!moving) return;
    currentX = event.touches[0].clientX;
}

function onTouchEnd() {
    moving = false;
}

function onMouseDown(event: MouseEvent) {
    startX = event.clientX;
    currentX = startX;
    moving = true;
}

function onMouseMove(event: MouseEvent) {
    if (!moving) return;
    currentX = event.clientX;
}

function onMouseUp() {
    moving = false;
}

function moveToSide() {
    if (!firstTouch) return;

    const deltaX = currentX - startX;
    const normalized = deltaX / window.innerWidth;

    // движение в стороны
    playerRun.position.x += normalized * sideMoveSpeed;

    const targetRotationY = targetRotate - normalized * 0.5;
    playerRun.rotation.y += (targetRotationY - playerRun.rotation.y) * 0.1;
    if(playerRun.position.x > 1) playerRun.position.x = 1;
    if(playerRun.position.x < -1) playerRun.position.x = -1;
}

/*function onTouchMove(event: TouchEvent){
    moveToSide(event.touches[0].clientX)
}
function onMouseMove(event: MouseEvent) {
    rayTouch.x = (event.clientX / window.innerWidth) * 2 - 1;
    rayTouch.y = -(event.clientY / window.innerHeight) * 2 + 1;
    moveToSide(event.clientX);
}*/

window.addEventListener('touchmove', onTouchMove);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick);
window.addEventListener('touchstart', onClick);
function onClick() {
    raycaster.setFromCamera(rayTouch, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);
    if (intersects.length > 0)
    {
        const firstIntersect = intersects[0];
        if (firstIntersect.object == buttonSound){
            if (buttonSound.material.map == textureOffSound) {
                buttonSound.material.map = textureOnSound;
                playTracks();
                volume = true;
            }
            else{
                buttonSound.material.map = textureOffSound;
                volume = false;
                volumeOff();
            }
        }
        else if(firstIntersect.object == restartBtn){
            location.reload();
        }
        else {
            if (win == 0) {
                if (firstTouch == false) {
                    firstTouch = true;
                    scoreText.scale.set(0.1,0.1,0.0001);
                    updateTextMesh(scoreText, "Score");
                    playerSpeed = -0.03;
                    removeObject(playerIdle);
                    scene.add(playerRun);
                    playerAnimationMixer = new THREE.AnimationMixer(playerRun);
                    action = playerAnimationMixer.clipAction(playerRun.animations[0]);
                    action.play();
                }
            }
        }
    }
}
function volumeOff() {
    volume = false;
    loopSound.pause();
    StepSound.pause();
}
function playTracks() {
    if (playerDeath!=true && win!=0) {
        loopSound.play();
        StepSound.play();
    }
}
function createInstallButton(camera:THREE.Camera){
    let installBtnGeometry = new THREE.PlaneGeometry(1,0.5);
    let installBtnMaterial = new THREE.MeshBasicMaterial({color: "#baff93", depthFunc: 7});
    installBtn = new THREE.Mesh(
        installBtnGeometry,
        installBtnMaterial
    )
    installText.scale.set(0.2,0.2,0.00001);
    installBtn.position.x = camera.position.x;
    installBtn.position.z = camera.position.z - 2;
    installBtn.position.y = camera.position.y - 0.4;
    installText.position.x = installBtn.position.x;
    installText.position.z = installBtn.position.z;
    installText.position.y = installBtn.position.y;
    installText.scale.z = 0.00000001;
    installText.material.depthFunc = 7;
}

function createRestartButton(camera:THREE.Camera){
    let restartBtnGeometry = new THREE.PlaneGeometry(1,0.5);
    let restartBtnMaterial = new THREE.MeshBasicMaterial({color: "#baff93", depthFunc: 7});
    restartBtn = new THREE.Mesh(
        restartBtnGeometry,
        restartBtnMaterial
    );
    restartText.scale.set(0.2,0.2,0.00001)
    restartBtn.position.x = camera.position.x;
    restartBtn.position.z = camera.position.z - 2;
    restartBtn.position.y = camera.position.y + 0.2;
    restartText.position.x = restartBtn.position.x;
    restartText.position.z = restartBtn.position.z;
    restartText.position.y = restartBtn.position.y;
    restartText.scale.z = 0.00000001;
    restartText.material.depthFunc = 7;
}

