
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import {Font} from "three/examples/jsm/loaders/FontLoader.js";


export type TextMesh = THREE.Mesh<TextGeometry, THREE.MeshPhongMaterial>;


let cachedFont: Font | null = null;

async function loadFont(
    url: string = "./public/helvetiker_regular.typeface.json"
): Promise<Font> {
    if (cachedFont) return cachedFont;
    const loader = new FontLoader();
    cachedFont = await new Promise<Font>((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    });
    return cachedFont;
}

export async function createTextMesh(
    text: string,
    size: number = 1,
    color: any,
): Promise<TextMesh> {
    const font = await loadFont();

    const geometry = new TextGeometry(text, {
        font,
        size,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 3,
    });

    geometry.center();

    const material = new THREE.MeshPhongMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.z = 0.01
    return mesh;
}


export async function updateTextMesh(mesh: TextMesh, newText: string): Promise<void> {
    const font = await loadFont();

    const newGeometry = new TextGeometry(newText, {
        font,
        size: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 3,
    });

    newGeometry.center();

    mesh.geometry.dispose();
    mesh.geometry = newGeometry;
}