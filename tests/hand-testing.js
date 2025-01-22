
import art from '../src/index.js';

let canvas = document.querySelector('canvas');
let scene = new art.Scene(canvas, {pan: true, zoom: true});
scene.setUpCanvasResizer();

new art.SceneObject(scene, (_, position) => {
    console.log(position)
    scene.rect(position.x, position.y, 'red', 10, 10);
})


scene.animate(() => {
});

console.log(scene)