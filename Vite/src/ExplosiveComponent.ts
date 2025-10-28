import * as THREE from "three"
import {BufferGeometry, PointsMaterial} from "three";


export class ExplosiveComponent {
    private _particles: THREE.Points;
    private readonly _geometry: BufferGeometry = new THREE.BufferGeometry();
    private readonly _material: PointsMaterial = new THREE.PointsMaterial({
        color: '#ff9100',
        size: 0.01
    });
    private readonly _lifespan: number = 2;
    private _livespan: number = 0;
    constructor(){
        
    }
    createExplosive(scene:THREE.Scene, _x:number, _y:number, _z:number) {
    const vertices = [];
    const velocities = [];

    const particleCount = 1000;

    for (let i = 0; i < particleCount; i++) {
        const x = _x;
        const y = _y;
        const z = _z;
        vertices.push(x, y, z);

        // Случайная скорость
        const speed = 0.5;
        const vx = (Math.random() - 0.5) * speed;
        const vy = (Math.random() - 0.5) * speed;
        const vz = (Math.random() - 0.5) * speed;
        velocities.push(vx, vy, vz);
    }

    this._geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this._geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
    this._particles = new THREE.Points(this._geometry, this._material);
    scene.add(this._particles);
}

// Анимация
    animate(scene:THREE.Scene) {
    const positions = this._geometry.attributes.position.array;
    const velocities = this._geometry.attributes.velocity.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i] * 0.01;
        positions[i + 1] += velocities[i + 1] * 0.01;
        positions[i + 2] += velocities[i + 2] * 0.01;
    }
    this._livespan+=0.01;
    if(this._lifespan<=this._livespan){
        scene.remove(this._particles.remove())
    }
    this._geometry.attributes.position.needsUpdate = true;
}
}
