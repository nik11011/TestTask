import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import * as THREE from "three";
interface TextSpriteOptions {
    font?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: number;
    padding?: number;
    backgroundColor?: string;
}

export function createTextSprite(text: string, options: TextSpriteOptions = {}): THREE.Sprite & { updateText: (newText: string) => void } {
    const {
        font = '20px Custom',
        textColor = '#ffffff',
        borderColor = 'red',
        borderWidth = 4,
        padding = 10,
        backgroundColor = 'rgba(255,74,74,0.6)',
    } = options;

    // === Canvas и контекст ===
    const canvasForText = document.createElement('canvas');
    const ctx = canvasForText.getContext('2d')!;
    ctx.font = font;

    const fontSize = parseInt(font, 10);
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;

    const width = textWidth + padding * 2 + borderWidth * 2;
    const height = fontSize + padding * 2 + borderWidth * 2;

    canvasForText.width = width;
    canvasForText.height = height;

    // После изменения размера нужно пересоздать шрифт
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // === Отрисовка фона ===
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // === Рамка ===
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);

    // === Текст ===
    ctx.fillStyle = textColor;
    ctx.fillText(text, width / 2, height / 2);

    // === Создание текстуры и спрайта ===
    const texture = new THREE.CanvasTexture(canvasForText);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material) as THREE.Sprite & { updateText: (newText: string) => void };

    // Пропорции и масштаб
    const aspect = width / height;
    sprite.scale.set(aspect, 1, 1);

    // === Метод обновления текста ===
    sprite.updateText = (newText: string) => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);

        ctx.fillStyle = textColor;
        ctx.fillText(newText, width / 2, height / 2);

        texture.needsUpdate = true;
    };

    return sprite;
}
