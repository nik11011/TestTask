import * as THREE from 'three';
import * as Player from './Player.ts';

const player = new Player();

const canvas = document.querySelector('.canvas');

const camera = new THREE.PerspectiveCamera(60, window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

scene.add(camera);

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera);


camera.position.z = 3;
