
export class EventManager {

    get isMouseDown() {
        return this._isMouseDown;
    }
    get mouseDownPos() {
        return this._mouseDownPos;
    }
    
    constructor(referenceElement) {
        this._referenceElement = referenceElement;
        this._isMouseDown = false;
        this._mouseDownPos = { x: null, y: null };
        this._mouseDragCallbacks = [];
        this._mouseClickCallbacks = [];
        this._mouseHoldCallbacks = [];
        this._setUpMouseEvents();
    }
    
    _setUpMouseEvents() {
        this._referenceElement.addEventListener('mousedown', (e) => {
            this._isMouseDown = true;
            this._mouseDownPos = { x: e.offsetX, y: e.offsetY };
        });
        this._referenceElement.addEventListener('mouseup', (e) => {
            this._isMouseDown = false;
        });
        this._referenceElement.addEventListener('mouseout', (e) => {
            this._isMouseDown = false;
        });
        this._referenceElement.addEventListener('click', (e) => {
            this._mouseClickCallbacks.forEach(callback => {
                callback(e);
            });
        });
        this._referenceElement.addEventListener('mousemove', (e) => {
            if (this._isMouseDown) {
                this._mouseDownPos = { x: e.offsetX, y: e.offsetY };
                this._mouseDragCallbacks.forEach(callback => {
                    callback(e);
                });
            }
        });
    }

    clearMouseDragEvent(fn) {
        this._mouseDragCallbacks = this._mouseDragCallbacks.filter(callback => callback !== fn);
    };
    onMouseDrag(callback) {
        this._mouseDragCallbacks.push(callback);
    }
    clearMouseClickEvent(fn) {
        this._mouseClickCallbacks = this._mouseClickCallbacks.filter(callback => callback !== fn);
    };
    onMouseClick(callback) {
        this._mouseClickCallbacks.push(callback);
    }
    clearMouseHoldEvent(fn) {
        this._mouseHoldCallbacks = this._mouseHoldCallbacks.filter(callback => callback !== fn);
    };
    onMouseHold(callback) {
        this._mouseHoldCallbacks.push(callback);
    }

    onNewFrame() {
        if (this._isMouseDown) {
            this._mouseHoldCallbacks.forEach(callback => {
                callback(this._mouseDownPos);
            });
        }
    }
}