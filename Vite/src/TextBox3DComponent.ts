import {TextMesh} from "./Font3DComponent";
import {Mesh, MeshBasicMaterial, PlaneGeometry, Scene, Texture, TextureLoader} from "three";

export class TextBox3DComponent {
    private readonly _textureLoader: TextureLoader = new TextureLoader();
    private readonly _textureTextPlane: Texture = this._textureLoader.load('textPlane.png')
    private readonly _textBoxMaterial: MeshBasicMaterial = new MeshBasicMaterial({map: this._textureTextPlane, transparent: true});

    public readonly text: TextMesh;
    public readonly textBoxPlane: PlaneGeometry = new PlaneGeometry(1, 0.35);
    public textBox: Mesh<PlaneGeometry, MeshBasicMaterial> = new Mesh(this.textBoxPlane, this._textBoxMaterial);



    constructor(text: TextMesh, planeColor: string) {
        this.text = text;
        this._textBoxMaterial.color.set(planeColor);
        this.text.scale.x = 0.1;
        this.text.scale.y = 0.1;
        this.text.scale.z = 0.000001;
    }

    private _scaleTextBoxSet(x:number, y:number): void{
        this._scaleTextSet(x,y);
        this.textBox.scale.x *= x;
        this.textBox.scale.x *= x;
    }
    private _scaleTextSet(x:number, y:number): void{
        this.text.scale.x *= x;
        this.text.scale.y *= y;
    }
    public addToScene(scene: Scene): void{
        scene.add(this.textBox);
        scene.add(this.text);
    }
}