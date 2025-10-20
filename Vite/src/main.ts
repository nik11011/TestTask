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
import {UILayout} from "./UILayout";
import {AudioControl} from "./AudioControl";
import {SceneControl} from "./SceneControl";
import {AnimationManager} from "./AnimationManager";


let targetRotate = Math.PI/1;
let uiLayout = new UILayout();
let {clock, deltaTime, canvas, bgTexture, canvasAspect, player} = PreparationScene();
let fps = 60;
let fixedDelta = 1.0 / fps;
let accumulatedTime = 0.0;
let deltaX = 0;
let startX = 0;
let currentX = 0;
let moving = false;
let secondAfterFinal = 0;

let sceneController = new SceneControl();

let audioControl = new AudioControl();

audioControl.loadSounds();
let textureLoader = new THREE.TextureLoader();
let textureTextPlane = await textureLoader.loadAsync('textPlane.png');
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
sceneController.scene.background = bgTexture;
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
sceneController.scene.add(scoreText);
createGameScene();


sceneController.camera.add(audioControl.listener);
const importclass = new AssetLoader();
let coins = new Array<Coin>();
let bombs = new Array<Bomb>();
let wraths = new Array<Wrath>();
await createIteractionObject();
addingGateInteraction();

const {playerDance, playerRun, playerIdle} = await importclass.loadAnimation();
player.replaceModel(playerIdle)
sceneController.scene.add(player.playerModel);
let animationManager = new AnimationManager();
animationManager.changeAnimation(player.playerModel);
animationManager.playAnimation();
let playerSpeed = 0;
let sideMoveSpeed = 2500;
let expl = new Explosive();
let playerDeath = false;

let win:number = 0;



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
sceneController.scene.add(textPlane);

let buttonSoundGeometry = new THREE.PlaneGeometry(0.2,0.2);
let buttonSound = new THREE.Mesh(
    buttonSoundGeometry,
    buttonOfSound
);
sceneController.scene.add(buttonSound)
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
sceneController.scene.add(fingerTutorial);
let left = false;
let right = true;
arrow.position.z = 0.2
fingerTutorial.position.z = 0.3
arrow.position.y = 0.5
fingerTutorial.position.y = 0.3
sceneController.scene.add(arrow);
let tutorialText = await createTextMesh("Touch and swipe !", 1, "#000000");
tutorialText.scale.set(
    0.1, 0.1, 0.00001
)
tutorialText.position.y = 0.6
sceneController.scene.add(tutorialText);
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
            if (bomb.OnTrigger(player.playerModel)) {
                audioControl.playLoseSounds(playerDeath);
                removeObject(player.playerModel);
                removeObject(bomb.model);
                expl.createExplosive(sceneController.scene,
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
        expl.animate(sceneController.scene);
    }
    const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
    const aspect = imageAspect / canvasAspect;
    NormalizeBGTexture(aspect)
    window.requestAnimationFrame(update);
    if (player.playerModel.position.z <= -24) {
        if (win == 0) {
            win+=1;
            audioControl.playWinSounds(win);
            removeObject(player.playerModel);
            player.replaceModel(playerDance);
            sceneController.scene.add(playerDance);
            playerSpeed = 0;
            sideMoveSpeed = 0;
            animationManager.changeAnimation(player.playerModel);
        }
    }
    for (let coin of coins) {
        coin.AnimationRotate(fixedDelta * 10);
        if (coin.OnTrigger(player.playerModel)){
            audioControl.playCoinTake();
            player.score += 1;
            coin.interactionalZone = 0;
            updateTextMesh(scoreText, `${player.score}`)
            removeObject(coin.model);
            }
        }
    for (let wrath of wraths) {
        if (wrath.OnEnterInWrath(player.playerModel)){
            player.score = wrath.wrathInteraction.doInteraction(player.score);
            updateTextMesh(scoreText, `${player.score}`)
            audioControl.WrathSoundPlay();
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
            sceneController.camera.position.z = -60;
            createRestartButton(sceneController.camera);
            createInstallButton(sceneController.camera);
            finger.position.z = installBtn.position.z+0.2;
            finger.position.y = installBtn.position.y-0.1;
            finger.position.x = installBtn.position.x+0.2;
            sceneController.scene.add(finger);
            scoreText.position.z = sceneController.camera.position.z - cameraIndent.z;
            textPlane.position.z = scoreText.position.z;
            scoreText.position.x = sceneController.camera.position.x;
            textPlane.position.x = scoreText.position.x;
            updateTextMesh(scoreText, "You score: " + player.score)
            scoreText.scale.set(0.075,0.075,0.0001);
            scoreText.lookAt(sceneController.camera.position);
            textPlane.lookAt(sceneController.camera.position);
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
    animationManager.mixer.update(fixedDelta);
    if (!moving) {
        player.playerModel.rotation.y += (targetRotate - player.playerModel.rotation.y) * 0.5;
    }
    console.log(deltaTime);
    renderer.render(sceneController.scene, sceneController.camera);
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
        sceneController.scene.remove(arrow);
        sceneController.scene.remove(fingerTutorial);
        sceneController.scene.remove(tutorialText);
    }
}


function removeObject(model:THREE.Object3D){
    model.remove();
    model.clear();
}
function glueCameraTo(playerModel:THREE.Object3D<Object3DEventMap>, camera:THREE.Camera) {
        camera.position.x = playerModel.position.x;
        camera.position.z = playerModel.position.z + cameraIndent.z;
        UIpositioner(uiLayout.buttonSoundPos, uiLayout.scoreTextPos);
}
function run(speed:number) {
    if(playerDeath == true || win!=0) {
        audioControl.stepSound.pause();
    }
    else {
        player.playerModel.position.z -= speed * fixedDelta;
        glueCameraTo(player.playerModel, sceneController.camera);
        if (audioControl.volume) {
            audioControl.stepSound.play();
        } else {
            audioControl.stepSound.pause();
        }
    }
}
function NormalizeBGTexture(aspect) {
    bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
    bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;

    bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
    bgTexture.repeat.y = aspect > 1 ? 1 : aspect;
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
    sceneController.scene.add(platformForRun);
    sceneController.scene.add(light);
    sceneController.scene.add(sceneController.camera);
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



function UIpositioner(buttonSoundPos: { x: number; y: number; z: number }, scoreTextPos: {x: number; y: number; z: number}) {
    scoreText.position.set(
        sceneController.camera.position.x+scoreTextPos.x,
        scoreTextPos.y,
        player.playerModel.position.z + scoreTextPos.z
    )
    scoreText.lookAt(
        sceneController.camera.position
    )
    textPlane.position.set(
        scoreText.position.x,
        scoreText.position.y,
        scoreText.position.z
    )
    textPlane.lookAt(
        sceneController.camera.position
    )
    buttonSound.position.set(
        sceneController.camera.position.x + buttonSoundPos.x,
        sceneController.camera.position.y + buttonSoundPos.y,
        sceneController.camera.position.z + buttonSoundPos.z
    )
    buttonSound.lookAt(
        sceneController.camera.position.x + buttonSoundPos.x,
        sceneController.camera.position.y,
        sceneController.camera.position.z,
    )
}

function SizeOnScreen() {
    if(window.innerWidth>window.innerHeight){
        uiLayout.scoreTextPos = {
            x: -2,
            y: 1.5,
            z: player.playerModel.position.z
        }
        uiLayout.buttonSoundPos = {
            x:0.4,
            y:-0.1,
            z:-1,
        }
        uiLayout.restartButtonPosition = {
            x: -1,
            y: 0.4,
            z: -6
        }
        uiLayout.installButtonPosition = {
            x: +1,
            y: 0.4,
            z: -6
        }
        sceneController.camera.fov = 30;
        sceneController.camera.position.y = 2;
        cameraIndent.z = 5;
        sceneController.camera.position.z = player.playerModel.position.z + cameraIndent.z;
        sceneController.camera.lookAt(
            player.playerModel.position.x,
            player.playerModel.position.y,
            player.playerModel.position.z-2);
        uiLayout.scaleButtonSound = 0.4;
        rePosInstallBtn()
        rePosRestartBtn()

    }
    else if(window.innerHeight>=window.innerWidth) {
        uiLayout.scoreTextPos = {
            x: 0,
            y: 1.7,
            z: player.playerModel.position.z
        }
        uiLayout.buttonSoundPos = {
            x: -0.35,
            y: -1.4,
            z: -1.1,
        }
        uiLayout.restartButtonPosition = {
            x: 0,
            y: 1,
            z: -3
        }
        uiLayout.installButtonPosition = {
            x: 0,
            y: 0.4,
            z: -3
        }
        sceneController.camera.fov = 55;
        sceneController.camera.position.y = 2;
        cameraIndent.z = 3;
        sceneController.camera.position.z = player.playerModel.position.z + cameraIndent.z;
        sceneController.camera.lookAt(
            player.playerModel.position.x,
            player.playerModel.position.y,
            player.playerModel.position.z-1);
        uiLayout.scaleButtonSound = 0.8;
        rePosInstallBtn()
        rePosRestartBtn()
    }
    buttonSound.scale.set(uiLayout.scaleButtonSound, uiLayout.scaleButtonSound, 0.1);
    UIpositioner(uiLayout.buttonSoundPos, uiLayout.scoreTextPos);
    sceneController.camera.aspect = window.innerWidth / window.innerHeight;
    sceneController.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', SizeOnScreen);



async function createIteractionObject() {
    await sceneController.loadCoinArray(coins);
    await sceneController.loadBombArray(bombs);
    await sceneController.loadWrathArray(wraths);
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

    const targetX = player.playerModel.position.x + normalized * sideMoveSpeed * fixedDelta;
    player.playerModel.position.x = THREE.MathUtils.lerp(player.playerModel.position.x, targetX, lerpFactor);

    const targetRotationY = targetRotate - normalized * 2000 * fixedDelta;
    player.playerModel.rotation.y = THREE.MathUtils.lerp(player.playerModel.rotation.y, targetRotationY, lerpFactor);

    if(player.playerModel.position.x > 1) player.playerModel.position.x = 1;
    if(player.playerModel.position.x < -1) player.playerModel.position.x = -1;
}

window.addEventListener('touchmove', onTouchMove);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick);
window.addEventListener('touchstart', onClick);
function onClick(event) {
    rayTouch.x = (event.clientX / window.innerWidth) * 2 - 1;
    rayTouch.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(rayTouch, sceneController.camera);
    const intersects = raycaster.intersectObjects(sceneController.scene.children, false);
    if (intersects.length > 0)
    {
        const firstIntersect = intersects[0];
        if (firstIntersect.object == buttonSound){
            if (buttonSound.material.map == textureOffSound) {
                buttonSound.material.map = textureOnSound;
                audioControl.volume = true;
            }
            else{
                buttonSound.material.map = textureOffSound;
                audioControl.volume = false;
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
                player.replaceModel(playerRun);
                sceneController.scene.add(player.playerModel);
                animationManager.changeAnimation(player.playerModel);
                animationManager.playAnimation();
        }
    }
}
function playTracks() {
    if (playerDeath == false && win == 0 && audioControl.volume == true) {
        audioControl.loopSound.play();
    }
    else
    {
        audioControl.loopSound.pause();
    }
}

function rePosInstallBtn() {
    installText.scale.set(uiLayout.scaleButton, uiLayout.scaleButton, 0.0001);
    installBtn.position.x = sceneController.camera.position.x+uiLayout.installButtonPosition.x;
    installBtn.position.z = sceneController.camera.position.z+uiLayout.installButtonPosition.z;
    installBtn.position.y = uiLayout.installButtonPosition.y;
    installText.position.x = installBtn.position.x;
    installText.position.z = installBtn.position.z;
    installText.position.y = installBtn.position.y;
}

function createInstallButton(camera:THREE.Camera){
    rePosInstallBtn();
    sceneController.scene.add(installBtn);
    sceneController.scene.add(installText);
}

function rePosRestartBtn() {
    restartText.scale.set(uiLayout.scaleButton, uiLayout.scaleButton, 0.0001)
    restartBtn.position.x = sceneController.camera.position.x+uiLayout.restartButtonPosition.x;
    restartBtn.position.z = sceneController.camera.position.z+uiLayout.restartButtonPosition.z;
    restartBtn.position.y = uiLayout.restartButtonPosition.y;
    restartText.position.x = restartBtn.position.x;
    restartText.position.z = restartBtn.position.z;
    restartText.position.y = restartBtn.position.y;
}

function createRestartButton(camera:THREE.Camera) {
    rePosRestartBtn();
    sceneController.scene.add(restartBtn);
    sceneController.scene.add(restartText);
}
