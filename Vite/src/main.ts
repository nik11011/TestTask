import * as THREE from 'three'
import {boxBlur} from "three/examples/jsm/tsl/display/boxBlur";
import {BoxGeometry, MeshBasicMaterial} from "three";




const canvas = document.querySelector('.canvas');

const camera = new THREE.PerspectiveCamera(60, window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

scene.add(camera);

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera);


camera.position.z = 3;

const geometryPlayer = new BoxGeometry(0.5,1,0.5);
const meshPlayer = new MeshBasicMaterial()
