import { EventManager } from "./event_manager.js";

export class Scene {
    _lastTime = 0;
    _fps = 60;
    _pan_x = 0;
    _pan_y = 0;
    _scale = 1;

    _settings = {
        pan: false,
        zoom: false
    }

    _sceneObjects = [];

    get deltaTime() {
        let t = new Date().getTime();
        return t - this._lastTime;
    }

    constructor(canvasEl, settings) {
        this.canvas = canvasEl;
        this.ctx = canvasEl.getContext('2d');
        this.events = new EventManager(canvasEl);
        this._settings = {...this._settings, ...settings};

        this.events.onMouseDrag((event) => {
            if (this._settings.pan) {
                this._pan_x -= event.movementX ;
                this._pan_y -= event.movementY ;
            }
        })
        this.events.onScroll((event) => {
            if (this._settings.zoom) {
                this._scale += event.deltaY * 1;
            }
        });
    }

    getRelX(x) {
        return x - this._pan_x + (this.canvas.width / 2);
    }
    getRelY(y) {
        return y - this._pan_y + (this.canvas.height / 2);
    }

    setFps(fps) {
        this._fps = fps;
    }
    setCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    setUpCanvasResizer() {
        let resizeCanvas = () => {
            let rectBox = this.canvas.getBoundingClientRect();
            let width = rectBox.width;
            let height = rectBox.height;
            this.setCanvasSize(width, height);
        }
        window.addEventListener('resize', () => resizeCanvas());
        resizeCanvas();
    }


    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    rect(x, y, color, width, height) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    strokeRect(x, y, color, width, height, lineWidth = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth
        this.ctx.strokeRect(x, y, width, height);
    }

    draw() {
        this.clear();

        this._sceneObjects.forEach(obj => {
            obj.draw();
        })
        this.events.onNewFrame();
    }

    animate(updateCallback) {
        let timestamp = new Date().getTime();
        if (timestamp - this._lastTime > 1000 / this._fps) {
            this._lastTime = timestamp;
            this.draw();
            updateCallback();
        }
        return requestAnimationFrame(() => this.animate(updateCallback));
    }
}

export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    distance(vector) {
        return Math.sqrt((this.x - vector.x) * (this.x - vector.x) + (this.y - vector.y) * (this.y - vector.y));
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get normalized() {
        let mag = this.magnitude;
        return new Vector2(this.x / mag, this.y / mag);
    }
}
export class SceneObject {
    /**
     * @type {Scene} 
     */
    _scene;

    /**
     * @type {Vector2}
     */
    _position;


    constructor(scene, drawer) {
        this._scene = scene;
        this._position = new Vector2(0, 0);

        this._scene._sceneObjects.push(this);
        this._drawer = drawer;
    }

    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
    }

    draw() {
        let relX = this._scene.getRelX(this._position.x);
        let relY = this._scene.getRelY(this._position.y);
        this._drawer(this._scene, new Vector2(relX, relY));
    }
}

export function hue(hueValue) {
    return `hsl(${hueValue}, 70%, 60%)`
}

export default {
    Scene,
    SceneObject,
    Vector2,
    hue,
}