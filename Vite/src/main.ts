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
import {InputEventsManager} from "./InputEventsManager";
import {Tutorial} from "./Tutorial";
import {TextBox3D} from "./TextBox3D";
import {UIManager} from "./UIManager";


let targetRotate = Math.PI/1;
let uiLayout = new UILayout();
let {clock, deltaTime, canvas, bgTexture, canvasAspect, player} = PreparationScene();
let fps = 60;
let fixedDelta = 1.0 / fps;
let accumulatedTime = 0.0;
let secondAfterFinal = 0;

let inputManager = new InputEventsManager(player);

let sceneController = new SceneControl();

let audioControl = new AudioControl();

audioControl.loadSounds();
let textureLoader = new THREE.TextureLoader();
let textureTextPlane = await textureLoader.loadAsync('textPlane.png');
let firstTouch = false;

NormalizeBGTexture(canvasAspect);
const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
    });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
sceneController.scene.background = bgTexture;
const platformForRun = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 40),
    new THREE.MeshLambertMaterial(
        {color: "#ffffff"}
    ));
platformForRun.receiveShadow = true;
EditPlatform();
const light = new THREE.DirectionalLight('#ffffff', 7);
light.castShadow = true;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 100;
light.shadow.camera.left = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.camera.bottom = -50;
light.position.set(5, 10, 5);
sceneController.scene.add(new THREE.DirectionalLightHelper(light));
let scoreText = await createTextMesh("Take coin, avoid bomb", 0.5, '#cc6d00');
scoreText.scale.set(0.1,0.1,0.0001);
scoreText.material.depthFunc = 7;



sceneController.scene.add(scoreText);
createGameScene();
sceneController.camera.add(audioControl.listener);
const assetLoader = new AssetLoader();
let coins = new Array<Coin>();
let bombs = new Array<Bomb>();
let wraths = new Array<Wrath>();
await createIteractionObject();
addingGateInteraction();

const {playerDance, playerRun, playerIdle} = await assetLoader.loadAnimation();
player.replaceModel(playerIdle)
sceneController.scene.add(player.playerModel);
let animationManager = new AnimationManager();
animationManager.changeAnimation(player.playerModel);
animationManager.playAnimation();
let playerSpeed = 0;
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


const raycaster = new THREE.Raycaster();
const rayTouch = new THREE.Vector2();

let installButton = new TextBox3D(
    await createTextMesh("Install", 1, "#249500"),
    '#baff93');
let restartButton = new TextBox3D(
    await createTextMesh("Restart", 1, "#249500"),
    '#baff93');

let textureFinger: THREE.Texture;
textureFinger = await textureLoader.loadAsync("fingerIcon.png");
let fingerPlaneGeometry = new THREE.PlaneGeometry(0.5,0.5);
let fingerMaterial = new THREE.MeshBasicMaterial({
    map: textureFinger,
    transparent:true
});

let finger = new THREE.Mesh(
    fingerPlaneGeometry,
    fingerMaterial
);
finger.scale.set(0.5,0.5,0.5);
let fingerAnimFrame = 0;
let tutorialText = await createTextMesh("Touch and swipe !", 1, "#000000");
tutorialText.scale.set(
    0.1, 0.1, 0.00001
)
tutorialText.position.y = 0.6
let tutorial = new Tutorial(tutorialText, sceneController);
let uiManager = new UIManager(
    player,
    sceneController,
    buttonSound,
    restartButton,
    installButton,
    textPlane,
    scoreText,
    uiLayout,
    renderer
)
uiManager.sizeOnScreen();
update();
function update(){
    playTracks();
    let delta = clock.getDelta();
    accumulatedTime += delta;
    accumulatedTime -= fixedDelta;
    tutorial.Tutorial(firstTouch, 2*fixedDelta);
    //Tutorial();
    inputManager.moveToSide(firstTouch, targetRotate, fixedDelta);
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
                inputManager.sideMoveSpeed = 0;
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
            //removeObject(player.playerModel);
            player.replaceModel(playerDance);
            sceneController.scene.add(player.playerModel);
            animationManager.changeAnimation(player.playerModel);
            animationManager.playAnimation();
            playerSpeed = 0;
            inputManager.sideMoveSpeed = 0;
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
            uiManager.createInstallButton();
            uiManager.createRestartButton();
            finger.position.z = installButton.textBox.position.z+0.2;
            finger.position.y = installButton.textBox.position.y-0.1;
            finger.position.x = installButton.textBox.position.x+0.2;
            sceneController.scene.add(finger);
            scoreText.position.z = sceneController.camera.position.z - uiManager.cameraIndent.z;
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
        finger.position.x = installButton.textBox.position.x+0.2;
        fingerAnimFrame = 0;
    }

    if (!inputManager.moving) {
        player.playerModel.rotation.y += (targetRotate - player.playerModel.rotation.y) * 0.5;
    }
    animationManager.mixer.update(fixedDelta);
    console.log(deltaTime);
    renderer.render(sceneController.scene, sceneController.camera);
}


function removeObject(model:THREE.Object3D){
    model.remove();
    model.clear();
}
function glueCameraTo(playerModel:THREE.Object3D<Object3DEventMap>, camera:THREE.Camera) {
        camera.position.x = playerModel.position.x;
        camera.position.z = playerModel.position.z + uiManager.cameraIndent.z;
        uiManager.UIpositioner(uiManager.uiLayout.buttonSoundPosition, uiManager.uiLayout.scoreTextPosition);
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

function EditPlatform() {
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


window.addEventListener('resize', uiManager.sizeOnScreen);
async function createIteractionObject() {
    await sceneController.loadCoinArray(coins);
    await sceneController.loadBombArray(bombs);
    await sceneController.loadWrathArray(wraths);
}
window.addEventListener('touchstart', inputManager.onTouchStart);
window.addEventListener('touchend', inputManager.onTouchEnd);
window.addEventListener('mousedown', inputManager.onMouseDown);
window.addEventListener('mouseup', inputManager.onMouseUp);
window.addEventListener('touchmove', inputManager.onTouchMove);
window.addEventListener('mousemove', inputManager.onMouseMove);
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
        else if(firstIntersect.object == restartButton.textBox || firstIntersect.object == restartButton.text){
            location.reload();
        }
        else if(firstIntersect.object != buttonSound && firstIntersect.object != restartButton.textBox)
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
