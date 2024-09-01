import { EventManager } from "./event_manager.js";

export class Scene {
    _lastTime = 0;
    _fps = 60;

    constructor(canvasEl) {
        this.canvas = canvasEl;
        this.ctx = canvasEl.getContext('2d');
        this.events = new EventManager(canvasEl);
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

    animate(updateCallback) {
        let timestamp = new Date().getTime();
        if (timestamp - this._lastTime > 1000 / this._fps) {
            this._lastTime = timestamp;
            this.clear();
            this.events.onNewFrame();
            updateCallback()
        }
        return requestAnimationFrame(() => this.animate(updateCallback));
    }
}

export function hue(hueValue) {
    return `hsl(${hueValue}, 70%, 60%)`
}

export default {
    Scene,
    hue
}