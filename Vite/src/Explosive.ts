import * as THREE from "three"


export class Explosive{
    particles: THREE.Points;
    geometry = new THREE.BufferGeometry();
    material = new THREE.PointsMaterial({
        color: '#ff9100',
        size: 0.01
    });
    lifespan=2;
    livespan=0;
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

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
    this.particles = new THREE.Points(this.geometry, this.material);
    scene.add(this.particles);
}

// Анимация
    animate(scene:THREE.Scene) {
    const positions = this.geometry.attributes.position.array;
    const velocities = this.geometry.attributes.velocity.array;
    for (let i = 0; i < positions.length; i += 3) {
        // Обновление положения
        positions[i] += velocities[i] * 0.01;
        positions[i + 1] += velocities[i + 1] * 0.01;
        positions[i + 2] += velocities[i + 2] * 0.01;
    }
    this.livespan+=0.01;
    if(this.lifespan<=this.livespan){
        scene.remove(this.particles.remove())
    }
    this.geometry.attributes.position.needsUpdate = true;
}
}
