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
let buttonSoundPos = {
    x:0,
    y:0,
    z:0,
}
let scoreTextPos = {
    x: 0,
    y: 0,
    z: 0
}
let rstBTN = {
    x: 0,
    y: 0,
    z: 0,
}
let instBTN= {
    x: 0,
    y: 0,
    z: 0,
}
let scaleButton = 0.1;
let scaleButtonSound = 0;
let {clock, deltaTime, canvas, bgTexture, canvasAspect, player} = PreparationScene();
let fps = 60;
let fixedDelta = 1.0 / fps;
let accumulatedTime = 0.0;
let deltaX = 0;
let startX = 0;
let currentX = 0;
let moving = false;
let targetRotate;
let volume = false;
let secondAfterFinal = 0;
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
const {loopSound, CoinHopSound, BombHopSound, StepSound, LoseMusic, WinMusic, WrathSound} = await createAudio();
let textureLoader = new THREE.TextureLoader();
let textureTextPlane = await textureLoader.loadAsync('textPlane.png');
loadSounds()

let arrow: THREE.Mesh;
let arrowTexture = await textureLoader.loadAsync('arrow.png');
let planeArrow = new THREE.PlaneGeometry(1.5,0.5);
let materialArrow = new THREE.MeshBasicMaterial({map: arrowTexture, transparent: true});
arrow = new THREE.Mesh(
    planeArrow,
    materialArrow
)
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
        {color: '#ffffff'}
    ));
createPlatform();
const light = new THREE.AmbientLight('#FFFFFF', 5);

let scoreText = await createTextMesh("Take coin, avoid bomb", 0.5, '#cc6d00');
scoreText.scale.set(0.1,0.1,0.0001);
scoreText.material.depthFunc = 7;
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
let sideMoveSpeed = 2500;
let expl = new Explosive();
let playerDeath = false;
function playLoseSounds() {
    if (playerDeath == false && volume == true){
    BombHopSound.play();
    loopSound.setVolume(0);
    loopSound.pause();
    loopSound.remove();
    LoseMusic.play();
    }
    else {
        BombHopSound.pause();
        loopSound.setVolume(0);
        loopSound.pause();
        LoseMusic.pause();
    }
}

function playWinSounds() {
    if (win != 0 && volume == true) {
        loopSound.setVolume(0);
        loopSound.pause();
        loopSound.remove();
        StepSound.remove;
        WinMusic.play();
    }
    else {
        loopSound.pause();
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



let textureOffSound = await textureLoader.loadAsync('sound_off_coffee.png');
let textureOnSound = await textureLoader.loadAsync('sound_on_coffee.png');
let buttonOfSound = new THREE.MeshBasicMaterial({
    map: textureOffSound,
    transparent:true,
    depthFunc: 1
});

let textPlaneGeometry = new THREE.PlaneGeometry(0.75,0.25);

let textPlaneMaterial = new THREE.MeshBasicMaterial({color: "#970000" ,map: textureTextPlane, transparent:true});
let textPlane = new THREE.Mesh(
    textPlaneGeometry,
    textPlaneMaterial
);
scene.add(textPlane);

let buttonSoundGeometry = new THREE.PlaneGeometry(0.2,0.2);
let buttonSound = new THREE.Mesh(
    buttonSoundGeometry,
    buttonOfSound
);
scene.add(buttonSound)
let installBtn;
let restartBtn;


const raycaster = new THREE.Raycaster();
const rayTouch = new THREE.Vector2();


let installBtnGeometry = new THREE.PlaneGeometry(1,0.35);
let buttonMaterial = new THREE.MeshBasicMaterial({color: "#baff93", map:textureTextPlane, transparent:true});
installBtn = new THREE.Mesh(
    installBtnGeometry,
    buttonMaterial
)
let restartBtnGeometry = new THREE.PlaneGeometry(1,0.35);
restartBtn = new THREE.Mesh(
    restartBtnGeometry,
    buttonMaterial
);
let installText = await createTextMesh('Install',1,'#249500');
let restartText = await createTextMesh('Restart',1,'#249500');
let textureFinger : THREE.Texture;
textureFinger = await textureLoader.loadAsync("fingerIcon.png");
let fingerPlaneGeometry = new THREE.PlaneGeometry(0.5,0.5);
let fingerMaterial = new THREE.MeshBasicMaterial({
    map: textureFinger,
    transparent:true
});
fingerMaterial.alphaTest = 0.1;
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
arrow.position.z = 0.2
fingerTutorial.position.z = 0.3
arrow.position.y = 0.5
fingerTutorial.position.y = 0.3
scene.add(arrow);
let tutorialText = await createTextMesh("Touch and swipe !", 1, "#000000");
tutorialText.scale.set(
    0.1, 0.1, 0.00001
)
tutorialText.position.y = 0.6
scene.add(tutorialText);
SizeOnScreen();
update();
function update(){
    playTracks();
    let delta = clock.getDelta();
    accumulatedTime += delta;
    accumulatedTime -= fixedDelta;
    Tutorial();
    moveToSide();
    if (playerDeath == false){
        for(let bomb of bombs){
            if (bomb.OnTrigger(playerRun)) {
                playLoseSounds();
                removeObject(playerRun);
                removeObject(bomb.model);
                expl.createExplosive(scene,
                    bomb.model.position.x,
                    bomb.model.position.y+0.1,
                    bomb.model.position.z)
                playerSpeed = 0;
                sideMoveSpeed = 0;
                playerDeath = true;
            }
        }
    }
    else {
        expl.animate(scene);
    }
    const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
    const aspect = imageAspect / canvasAspect;
    NormalizeBGTexture(aspect)
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
        }
    }
    for (let coin of coins) {
        coin.AnimationRotate(fixedDelta * 10);
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
    if(firstTouch)
    {
    run(playerSpeed);
    }
    if(playerDeath==true || win>0)
    {
        if (secondAfterFinal>=5) {
            camera.position.z = -60;
            createRestartButton(camera);
            createInstallButton(camera);
            finger.position.z = installBtn.position.z+0.2;
            finger.position.y = installBtn.position.y-0.1;
            finger.position.x = installBtn.position.x+0.2;
            scene.add(finger);
            scoreText.position.z = camera.position.z - cameraIndent.z;
            textPlane.position.z = scoreText.position.z;
            scoreText.position.x = camera.position.x;
            textPlane.position.x = scoreText.position.x;
            updateTextMesh(scoreText, "You score: " + player.score)
            scoreText.scale.set(0.075,0.075,0.0001);
            scoreText.lookAt(camera.position);
            textPlane.lookAt(camera.position);
        }
        else secondAfterFinal+=fixedDelta;
    }
    if (fingerAnimFrame<=10) {
        finger.position.x-=fixedDelta;
        fingerAnimFrame+=1;
    }
    else{
        finger.position.x = installBtn.position.x+0.2;
        fingerAnimFrame = 0;
    }
    playerAnimationMixer.update(fixedDelta);
    if (!moving) {
        playerRun.rotation.y += (targetRotate - playerRun.rotation.y) * 0.5;
    }
    console.log(deltaTime);
    renderer.render(scene, camera);
}

function MoveToLeftPosition() {
    if (fingerTutorial.position.x >= -0.4) {
        fingerTutorial.position.x -= fixedDelta;
    } else {
        right = false;
        left = true;
    }
}

function MoveToRightPosition() {
    if (fingerTutorial.position.x <= 0.4) {
        fingerTutorial.position.x += fixedDelta;
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
        scene.remove(arrow);
        scene.remove(fingerTutorial);
        scene.remove(tutorialText);
    }
}


function removeObject(model:THREE.Object3D){
    model.remove();
    model.clear();
}
function glueCameraTo(playerModel:THREE.Object3D<Object3DEventMap>, camera:THREE.Camera) {
        camera.position.x = playerModel.position.x;
        camera.position.z = playerModel.position.z + cameraIndent.z;
        UIpositioner(buttonSoundPos, scoreTextPos);
}
function run(speed:number) {
    if(playerDeath == true || win!=0) {
        StepSound.pause();
    }
    else {
        playerRun.position.z -= speed * fixedDelta;
        glueCameraTo(playerRun, camera);
        if (volume) {
            StepSound.play();
        } else {
            StepSound.pause();
        }
    }
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

function UIpositioner(buttonSoundPos: { x: number; y: number; z: number }, scoreTextPos: {x: number; y: number; z: number}) {
    scoreText.position.set(
        camera.position.x+scoreTextPos.x,
        scoreTextPos.y,
        playerRun.position.z + scoreTextPos.z
    )
    scoreText.lookAt(
        camera.position
    )
    textPlane.position.set(
        scoreText.position.x,
        scoreText.position.y,
        scoreText.position.z
    )
    textPlane.lookAt(
        camera.position
    )
    buttonSound.position.set(
        camera.position.x + buttonSoundPos.x,
        camera.position.y + buttonSoundPos.y,
        camera.position.z + buttonSoundPos.z
    )
    buttonSound.lookAt(
        camera.position.x + buttonSoundPos.x,
        camera.position.y,
        camera.position.z,
    )
}

function SizeOnScreen() {
    if(window.innerWidth>window.innerHeight){
        scoreTextPos = {
            x: -2,
            y: 1.5,
            z: playerRun.position.z
        }
        buttonSoundPos = {
            x:0.4,
            y:-0.1,
            z:-1,
        }
        rstBTN = {
            x: -1,
            y: 0.4,
            z: -6
        }
        instBTN = {
            x: +1,
            y: 0.4,
            z: -6
        }
        camera.fov = 30;
        camera.position.y = 2;
        cameraIndent.z = 5;
        camera.position.z = playerRun.position.z + cameraIndent.z;
        camera.lookAt(
            playerRun.position.x,
            playerRun.position.y,
            playerRun.position.z-2);
        scaleButtonSound = 0.4;
        rePosInstallBtn()
        rePosRestartBtn()

    }
    else if(window.innerHeight>=window.innerWidth) {
        scoreTextPos = {
            x: 0,
            y: 1.7,
            z: playerRun.position.z
        }
        buttonSoundPos = {
            x: -0.35,
            y: -1.4,
            z: -1.1,
        }
        rstBTN = {
            x: 0,
            y: 1,
            z: -3
        }
        instBTN = {
            x: 0,
            y: 0.4,
            z: -3
        }
        camera.fov = 55;
        camera.position.y = 2;
        cameraIndent.z = 3;
        camera.position.z = playerRun.position.z + cameraIndent.z;
        camera.lookAt(
            playerRun.position.x,
            playerRun.position.y,
            playerRun.position.z-1);
        scaleButtonSound = 0.8;
        rePosInstallBtn()
        rePosRestartBtn()
    }
    buttonSound.scale.set(scaleButtonSound, scaleButtonSound, 0.1);
    UIpositioner(buttonSoundPos, scoreTextPos);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
}

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
    audioLoader.load('loopTrack.mp3', function(buffer) {
        loopSound.setBuffer(buffer);
        loopSound.setLoop(true);
        loopSound.setVolume(0.5);
    });
    audioLoader.load('coin.mp3', function (buffer) {
        CoinHopSound.setBuffer(buffer);
        CoinHopSound.setVolume(0.5);
    });
    audioLoader.load('explosion_small_no_tail_03.mp3', function (buffer) {
        BombHopSound.setBuffer(buffer);
        BombHopSound.setVolume(0.5);
    });
    audioLoader.load('step_0.mp3', function (buffer) {
        StepSound.setBuffer(buffer);
        StepSound.setVolume(0.5);
        StepSound.setLoop(true);
    });
    audioLoader.load('STGR_Fail_Lose_forMUSIC_A_1.mp3', function (buffer) {
        LoseMusic.setBuffer(buffer);
        LoseMusic.setVolume(0.5);
    });
    audioLoader.load('STGR_Success_Win_forMUSIC_A_2.mp3', function (buffer) {
        WinMusic.setBuffer(buffer);
        WinMusic.setVolume(0.5);
    });
    audioLoader.load('SFX_UI_Appear_Generic_2.mp3', function (buffer) {
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
    const lerpFactor = 0.1
    deltaX = currentX - startX;
    startX = currentX;
    const normalized = deltaX / window.innerWidth;

    const targetX = playerRun.position.x + normalized * sideMoveSpeed * fixedDelta;
    playerRun.position.x = THREE.MathUtils.lerp(playerRun.position.x, targetX, lerpFactor);

    const targetRotationY = targetRotate - normalized * 2000 * fixedDelta;
    playerRun.rotation.y = THREE.MathUtils.lerp(playerRun.rotation.y, targetRotationY, lerpFactor);

    if(playerRun.position.x > 1) playerRun.position.x = 1;
    if(playerRun.position.x < -1) playerRun.position.x = -1;
}

window.addEventListener('touchmove', onTouchMove);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick);
window.addEventListener('touchstart', onClick);
function onClick(event) {
    rayTouch.x = (event.clientX / window.innerWidth) * 2 - 1;
    rayTouch.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(rayTouch, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);
    if (intersects.length > 0)
    {
        const firstIntersect = intersects[0];
        if (firstIntersect.object == buttonSound){
            if (buttonSound.material.map == textureOffSound) {
                buttonSound.material.map = textureOnSound;
                volume = true;
            }
            else{
                buttonSound.material.map = textureOffSound;
                volume = false;
            }
        }
        else if(firstIntersect.object == restartBtn || firstIntersect.object == restartText){
            location.reload();
        }
        else if(firstIntersect.object != buttonSound && firstIntersect.object != restartBtn)
            if (win == 0)
            if (firstTouch == false) {
                firstTouch = true;
                scoreText.scale.set(0.1,0.1,0.0001);
                updateTextMesh(scoreText, "Score");
                playerSpeed = 2;
                removeObject(playerIdle);
                scene.add(playerRun);
                playerAnimationMixer = new THREE.AnimationMixer(playerRun);
                action = playerAnimationMixer.clipAction(playerRun.animations[0]);
                action.play();
        }
    }
}
function playTracks() {
    if (playerDeath == false && win == 0 && volume == true) {
        loopSound.play();
    }
    else
    {
        loopSound.pause();
    }
}

function rePosInstallBtn() {
    installText.scale.set(scaleButton, scaleButton, 0.0001);
    installBtn.position.x = camera.position.x+instBTN.x;
    installBtn.position.z = camera.position.z+instBTN.z;
    installBtn.position.y = instBTN.y;
    installText.position.x = installBtn.position.x;
    installText.position.z = installBtn.position.z;
    installText.position.y = installBtn.position.y;
}

function createInstallButton(camera:THREE.Camera){
    rePosInstallBtn();
    scene.add(installBtn);
    scene.add(installText);
}

function rePosRestartBtn() {
    restartText.scale.set(scaleButton, scaleButton, 0.0001)
    restartBtn.position.x = camera.position.x+rstBTN.x;
    restartBtn.position.z = camera.position.z+rstBTN.z;
    restartBtn.position.y = rstBTN.y;
    restartText.position.x = restartBtn.position.x;
    restartText.position.z = restartBtn.position.z;
    restartText.position.y = restartBtn.position.y;
}

function createRestartButton(camera:THREE.Camera) {
    rePosRestartBtn();
    scene.add(restartBtn);
    scene.add(restartText);
}
