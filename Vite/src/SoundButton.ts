import * as THREE from "three";


export class SoundButton{

    public textureLoader = new THREE.TextureLoader;
    public textureOffSound = this.textureLoader.load('sound_off_coffee.png');
    public textureOnSound = this.textureLoader.load('sound_on_coffee.png');
    public buttonMaterial = new THREE.MeshBasicMaterial({
        map: this.textureOnSound,
        transparent:true,
        depthFunc: 1
    });
    public buttonSoundGeometry = new THREE.PlaneGeometry(0.2,0.2);
    public button = new THREE.Mesh(
        this.buttonSoundGeometry,
        this.buttonMaterial
    );
}