import * as THREE from 'three';


    const canvas: Element = document.querySelector('#c');

    const loader = new THREE.TextureLoader();
    const bgTexture = loader.load('src/SkyBox.jpg')


    const canvasAspect = canvas.clientWidth / canvas.clientHeight;
    const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
    const aspect = imageAspect / canvasAspect;

    bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
    bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;

    bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
    bgTexture.repeat.y = aspect > 1 ? 1 : aspect;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
    });


    renderer.setSize(window.innerWidth, window.innerHeight);

    const axesHelper = new THREE.AxesHelper(3);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);

    const scene = new THREE.Scene();
    scene.background = bgTexture;


    const platformForRun = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 20),
        new THREE.MeshBasicMaterial(
            {color: '#ffffff'}
        ));
    scene.add(platformForRun);
    platformForRun.position.y = -1;
    platformForRun.position.z = -8;
    camera.position.z = 3;


    scene.add(camera);

    scene.add(axesHelper);
    renderer.render(scene, camera);




const clock = new THREE.Clock();
let i = 0;
function update(){

    i += clock.getElapsedTime();
    console.log('frame');
    window.requestAnimationFrame(update);
    main()

}

update();