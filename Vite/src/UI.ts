import {Camera, Mesh} from "three";
import {TextMesh};

export class UI{
    camera:Camera;
    UI = {
        mesh:Mesh,
        text:TextMesh,
    }
    constructor(camera) {
    }
}