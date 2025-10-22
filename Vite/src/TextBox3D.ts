import {TextMesh} from "./Font3D";
import * as THREE from "three"

export class TextBox3D {
    private readonly textureLoader = new THREE.TextureLoader();
    text: TextMesh;
    textBoxPlane = new THREE.PlaneGeometry(1, 0.35);
    private readonly textureTextPlane = this.textureLoader.load('textPlane.png')
    textBoxMaterial = new THREE.MeshBasicMaterial({map: this.textureTextPlane, transparent: true});
    textBox = new THREE.Mesh(this.textBoxPlane, this.textBoxMaterial);

    constructor(_text: TextMesh, _planeColor: string) {
        this.text = _text;
        this.textBoxMaterial.color.set(_planeColor);
        this.text.scale.x = 0.1;
        this.text.scale.y = 0.1;
        this.text.scale.z = 0.000001;
    }

    scaleTextBoxSet(x:number, y:number){
        this.scaleTextSet(x,y);
        this.textBox.scale.x *= x;
        this.textBox.scale.x *= x;
    }
    scaleTextSet(x:number, y:number){
        this.text.scale.x *= x;
        this.text.scale.y *= y;
    }
    addToScene(scene:THREE.Scene){
        scene.add(this.textBox);
        scene.add(this.text);
    }
}