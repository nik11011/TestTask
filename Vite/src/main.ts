import * as THREE from 'three';
import {Player} from './InteractiveObjects/Player';
import {AssetLoaderComponent} from "./AssetLoaderComponent";
import {ExplosiveComponent} from "./ExplosiveComponent";
import {createTextMesh, updateTextMesh} from "./Font3DComponent";
import {UILayoutComponent} from "./UILayoutComponent";
import {AudioControlComponent} from "./AudioControlComponent";
import {SceneControlComponent} from "./SceneControlComponent";
import {AnimationManagerComponent} from "./AnimationManagerComponent";
import {InputEventsComponent} from "./InputEventsComponent";
import {BeginTutorial} from "./Tutorials/BeginTutorial";
import {TextBox3DComponent} from "./TextBox3DComponent";
import {UIManagerComponent} from "./UIManagerComponent";
import TWEEN from '@tweenjs/tween.js';
import {EndGameTutorial} from "./Tutorials/EndGameTutorial";


let targetRotate = Math.PI;
let uiLayout = new UILayoutComponent();
let {clock, canvas, bgTexture, canvasAspect, player} = PreparationScene();
let fps = 60;
let fixedDelta = 1.0 / fps;
let accumulatedTime = 0.0;
let secondAfterFinal = 0;



let sceneController = new SceneControlComponent();

let audioControl = new AudioControlComponent();

audioControl.loadSounds();

NormalizeBGTexture(canvasAspect);
const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
    });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
sceneController.scene.background = bgTexture;
const platformForRun = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 40),
    new THREE.MeshLambertMaterial(
        {color: "#ffffff"}
    ));
platformForRun.receiveShadow = true;
EditPlatform();


const scoreText: TextBox3DComponent = new TextBox3DComponent(
    await createTextMesh("Score", 1, "#ff9000"),
    "#970000")
scoreText.addToScene(sceneController.scene);

createGameScene();
sceneController.camera.add(audioControl.listener);
const assetLoader = new AssetLoaderComponent();
await createIteractionObject();
sceneController.addingGateInteraction();

const {playerDance, playerRun, playerIdle} = await assetLoader.loadAnimation();
player.replaceModel(playerIdle)
sceneController.scene.add(player.playerModel);
let animationManager = new AnimationManagerComponent();
animationManager.changeAnimation(player.playerModel);
animationManager.playAnimation();
let expl = new ExplosiveComponent();




let installButton = new TextBox3DComponent(
    await createTextMesh("Install", 1, "#249500"),
    '#baff93');
let restartButton = new TextBox3DComponent(
    await createTextMesh("Restart", 1, "#249500"),
    '#baff93');

let tutorialText = await createTextMesh("Touch and swipe !", 1, "#000000");
tutorialText.scale.set(
    0.1, 0.1, 0.00001
)
tutorialText.position.y = 0.6
let tutorial = new BeginTutorial(tutorialText, sceneController);

let uiManager = new UIManagerComponent(
    player,
    sceneController,
    restartButton,
    installButton,
    scoreText.textBox,
    scoreText.text,
    uiLayout,
    renderer
)

let endGame = new EndGameTutorial(
    sceneController,
    uiManager,
    scoreText.text,
    scoreText.textBox,
    player
)
let inputManager = new InputEventsComponent(
    player,
    uiManager,
    sceneController,
    audioControl,
    playerRun,
    animationManager
);
const doubleWrathsArray = sceneController.fillDoubleWrathsInteraction(sceneController.wraths);
uiManager.sizeOnScreen();
update();
function update(){
    audioControl.playTracks(player);
    let delta = clock.getDelta();
    accumulatedTime += delta;
    accumulatedTime -= fixedDelta;
    tutorial.tutorial(inputManager.firstTouch);
    inputManager.moveToSide(inputManager.firstTouch, targetRotate, fixedDelta);
    if (player.playerDeath == false){
        for(let bomb of sceneController.bombs){
            if (bomb.onTrigger(player.playerModel)) {
                audioControl.playLoseSounds(player.playerDeath);
                removeObject(player.playerModel);
                removeObject(bomb.model);
                expl.createExplosive(sceneController.scene,
                    bomb.model.position.x,
                    bomb.model.position.y+0.1,
                    bomb.model.position.z)
                player.playerSpeed = 0;
                inputManager.sideMoveSpeed = 0;
                player.playerDeath = true;
            }
        }
    }
    else {
        expl.animate(sceneController.scene);
    }
    const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
    const aspect = imageAspect / canvasAspect;
    NormalizeBGTexture(aspect)
    if (player.playerModel.position.z <= -24) {
        if (player.win == 0) {
            player.win+=1;
            audioControl.playWinSounds(player.win);
            player.replaceModel(playerDance);
            sceneController.scene.add(player.playerModel);
            animationManager.changeAnimation(player.playerModel);
            animationManager.playAnimation();
            player.playerSpeed = 0;
            inputManager.sideMoveSpeed = 0;
        }
    }
    for (let coin of sceneController.coins) {
        coin.animationRotate(fixedDelta * 10);
        if (coin.onTrigger(player.playerModel)){
            audioControl.playCoinTake();
            player.score += 1;
            coin.interactionalZone = 0;
            updateTextMesh(scoreText.text, `${player.score}`)
            removeObject(coin.model);
            }
        }
    for (let wrath of sceneController.wraths) {
        if (wrath.onEnterInWrath(player.playerModel)){
            player.score = wrath.wrathInteraction.doInteraction(player.score);
            updateTextMesh(scoreText.text, `${player.score}`)
            audioControl.wrathSoundPlay();
            removeObject(wrath.model);
            updateTextMesh(wrath.textMesh, "");
        }
    }
    for (let doubleWrath of doubleWrathsArray) {
        doubleWrath.removeWrath(sceneController.scene);
    }
    if(inputManager.firstTouch)
    {
    run(player.playerSpeed);
    }
    if(player.playerDeath==true || player.win>0)
    {
        if (secondAfterFinal>=5) {
            endGame.realise();
        }
        else secondAfterFinal+=fixedDelta;
    }
    endGame.tutorial();
    if (!inputManager.moving) {
        player.playerModel.rotation.y += (targetRotate - player.playerModel.rotation.y) * 0.5;
    }
    animationManager.mixer.update(fixedDelta);
    window.requestAnimationFrame(TWEEN.update);
    window.requestAnimationFrame(update);
    renderer.render(sceneController.scene, sceneController.camera);
}


function removeObject(model:THREE.Object3D){
    model.remove();
    model.clear();
}
function glueCameraTo(playerModel:THREE.Object3D, camera:THREE.Camera) {
        camera.position.x = playerModel.position.x;
        camera.position.z = playerModel.position.z + uiManager.cameraIndent.z;
        uiManager.UIpositioner(uiManager.uiLayout.buttonSoundPosition, uiManager.uiLayout.scoreTextPosition);
}
function run(speed:number) {
    if(player.playerDeath == true || player.win!=0) {
        audioControl.stepSound.pause();
    }
    else {
        player.playerModel.position.z -= speed * fixedDelta;
        glueCameraTo(player.playerModel, sceneController.camera);
        if (audioControl.volume) {
            audioControl.stepSound.pause(); 
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

function EditPlatform() {
    platformForRun.position.y = -0.65;
    platformForRun.position.z = -18;
}
function createGameScene() {
    sceneController.scene.add(platformForRun);
    sceneController.createSun()
    sceneController.scene.add(sceneController.camera);
}
function PreparationScene() {
    const clock = new THREE.Clock();
    const canvas: Element = document.querySelector('#c');
    const loader = new THREE.TextureLoader();
    const bgTexture = loader.load('public/SkyBox.jpg')
    let canvasAspect = canvas.clientWidth / canvas.clientHeight
    const player = new Player();
    return {clock, canvas, bgTexture, canvasAspect, player};
}


window.addEventListener('resize', uiManager.sizeOnScreen);
async function createIteractionObject() {
    await sceneController.loadCoinArray();
    await sceneController.loadBombArray();
    await sceneController.loadWrathArray();
}
window.addEventListener('touchstart', inputManager.onTouchStart);
window.addEventListener('touchend', inputManager.onTouchEnd);
window.addEventListener('mousedown', inputManager.onMouseDown);
window.addEventListener('mouseup', inputManager.onMouseUp);
window.addEventListener('touchmove', inputManager.onTouchMove);
window.addEventListener('mousemove', inputManager.onMouseMove);
window.addEventListener('mousedown', inputManager.onClick);
window.addEventListener('touchstart', inputManager.onClick);

