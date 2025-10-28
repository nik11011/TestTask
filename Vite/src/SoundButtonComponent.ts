import {Mesh, MeshBasicMaterial, PlaneGeometry, Texture, TextureLoader} from "three";


export class SoundButtonComponent {

    private _textureLoader: TextureLoader = new TextureLoader;
    public textureOffSound: Texture = this._textureLoader.load('sound_off_coffee.png');
    public textureOnSound: Texture = this._textureLoader.load('sound_on_coffee.png');

    private readonly _buttonMaterial: MeshBasicMaterial = new MeshBasicMaterial({
        map: this.textureOnSound,
        transparent:true,
        depthFunc: 1
    });
    private readonly _buttonSoundGeometry: PlaneGeometry = new PlaneGeometry(0.2,0.2);

    public button: Mesh<PlaneGeometry, MeshBasicMaterial> = new Mesh(
        this._buttonSoundGeometry,
        this._buttonMaterial
    );
}