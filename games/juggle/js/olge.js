"use strict";

/**
 * @author       Brian Schau <brian@schau.dk>
 * @copyright    2024+ Brian Schau
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @classdesc
 * @class OLGE
 *
 * Inspired by the article
 *
 * 			"Joys of Small Game Development"
 *
 * Found here: https://abagames.github.io/joys-of-small-game-development-en/
 *
 * This "One Level Game Engine" is not about competing with the Crisp Game Lib
 * but more about me being bored :-)
 *
 *     --- Brian
 *
 * OLGE Version: 1.1
 */
class OLGE {
    /**
     * Internal assets loader.
     *
     * @param {array} keys - The list of keys to load assets for.
     * @param {function} callback  - Callback when the last asset has been loaded.
     */
    _load(keys, callback) {
        if (keys.length < 1) {
            callback();
            return;
        }

        var key = keys.shift();
        var url = this._assets.get(key);
        if  (url.endsWith(".png") || url.endsWith(".jpg")) {
            var image = new Image();
            this._assets.set(key, image);
	        image.crossOrigin = "anonymous";
	        image.onload = this._load(keys, callback);
	        image.src = url;
        } else if (url.endsWith(".mp3")) {
            var audio = new Audio();
            this._assets.set(key, audio);
            audio.crossOrigin = "anonymous";
            audio.onload = this._load(keys, callback);
            audio.src = url;
        } else {
            throw "_load cannot handle: " + url;
        }
    }

    /**
     * Initialize OLGE.
     *
     * @param {string} canvasId - HTML ID of canvas.
     * @param {number} screenW - Virtual screen width.
     * @param {number} screenH - Virtual screen height.
     */
    init(canvasId, screenW, screenH) {
        this._canvas = document.getElementById(canvasId);
        this._ctx = this._canvas.getContext("2d");
        this._ctx.imageSmoothingEnabled = false;
        this._screenW = screenW;
        this._screenH = screenH;
        this._start = Date.now();
        this._lag = 0;
        this._loopLocked = true;
        this._animationFrame = false;
        this._scenes = false;
        this._updateFunc = false;
        this._renderFunc = false;
        this._playAudio = this.canPlayAudio();
        this.setCanvasSize();
        window.addEventListener('resize', () => this.setCanvasSize());
    }

	/**
	 * Can we play audio?
	 *
	 * @return true / false.
	 */
	canPlayAudio() {
		if (!navigator.getAutoplayPolicy) {
			return false;
		}

		return navigator.getAutoplayPolicy("mediaelement") === "allowed";
	}

    /**
     * Initialize font.
     *
     * @param {string} fontDescription - "5px MicroChat".
     * @param {number} glyphWidth - Width of glyph (incl. spacing),
     * @param {number} glyphHeight - Height of glyph (incl. spacing),
     */
    setFont(fontDescription, glyphWidth, glyphHeight) {
        this._glyphW = glyphWidth;
        this._glyphH = glyphHeight;
        this._ctx.font = fontDescription;
    }

    /**
     * Load assets.
     *
     * Define assets as:
     *
     *  var assets = new Map([
     *      [ "player", "spritesheet.png" ],
     *      [ "ping", "ping.mp3" ],
     *  ]);
     *
     * @param {map} assets - Map with assets.
     * @param {function} callback - Callback when all assets have been loaded.
     */
    load(assets, callback) {
        this._assets = assets;
        this._load(Array.from(assets.keys()), callback);
    }

    /**
     * Recalculate canvas size. Sets scale factor.
     */
    setCanvasSize() {
	    var screenW = window.innerWidth;
	    var screenH = window.innerHeight;

        var scaleW = screenW / this._screenW;
	    var scaleH = screenH / this._screenH;

	    this._scale = parseInt(scaleW > scaleH ? scaleH : scaleW);
	    if (this._scale < 1) {
		    return;
	    }

	    this._canvas.style.width = (this._scale * this._screenW) + "px";
	    this._canvas.style.height = (this._scale * this._screenH) + "px";
    }

    /**
     * Set scenes.
     *
     * Define scenes:
     *
     *  var scenes = new Map([
     *      "scene-name-1", [ "init-func" | ignore, update-func | "ignore", render-func | "ignore" ] ],
     *      "scene-name-2", [ "init-func" | ignore, update-func | "ignore", render-func | "ignore" ] ],
     *  ]);
     *
     * @param {map} scenes - The scenes for OLGE.
     */
    setScenes(scenes) {
        this._scenes = scenes;
    }

    /**
     * Activate a scene.
     *
     * @param {string} scene - Scene (name) to activate.
     */
    activateScene(scene) {
        if (this._scenes === false) {
            throw "No scenes defined.";
        }

        if (!this._scenes.has(scene)) {
            throw "No such scene: " + scene;
        }

        this._loopLocked = true;
        if (this._animationFrame !== false) {
            cancelAnimationFrame(this._animationFrame);
            this._animationFrame = false;
        }

        scene = this._scenes.get(scene);
        if (!this._isIgnore(scene[0])) {
            scene[0]();
        }

        this._updateFunc = this._isIgnore(scene[1]) ? false : scene[1];
        this._renderFunc = this._isIgnore(scene[2]) ? false : scene[2];

        this._start = Date.now();
        this._loopLocked = false;
        this._loop();
    }

    /**
     * Is the argument "ignore".
     *
     * @param {string} argument.
     * @return true if argument is "ignore";
     */
    _isIgnore(argument) {
        return "ignore".localeCompare(argument, undefined, { sensitivity: 'base' }) === 0;
    }

    /**
     * Activate audio. Call from an onclick event.
     */
    activateAudio() {
        this._playAudio = true;
    }

    /**
     * Play the audio by asset-key.
     *
     * @param {string} key - Asset key.
     */
    playAudio(key) {
        if (!this._playAudio) {
            return;
        }
        const sourceAudio = this._assets.get(key);
        var audio = sourceAudio.cloneNode();
        audio.addEventListener("canplaythrough", (event) => {
            try {
                audio.play();
            } catch (error) {
            }
        });
    }

    /**
     * Random number between min - max.
     *
     * @param {number} min
     * @param {number} max
     * @returns Random number.
     */
    random(min, max) {
	    return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     *
     * @param {function} update function
     * @param {function} render function
     */
    _loop(update, render) {
        if (this._loopLocked) {
            return;
        }

	    this._animationFrame = requestAnimationFrame(() => this._loop());

	    var current = Date.now();
	    var elapsed = current - this._start;
	    this._start = current;
	    this._lag += elapsed;

        const frameDuration = 1000 / 60;        // second / FPS
	    while (this._lag >= frameDuration) {
            if (this._updateFunc !== false) {
		        this._updateFunc();
            }
		    this._lag -= frameDuration;
	    }

        if (this._renderFunc === false) {
            return;
        }
	    this._renderFunc(this._lag / frameDuration);
    }

    /**
     * Get translated click coordinate from event.
     *
     * @param {event} event - Event.
     * @returns [x, y]
     */
    getCoordinates(event) {
        var x = parseInt(event.layerX / this._scale);
        if (x < 0) {
            x = 0;
        } else if (x > this.screenW) {
            x = this.screenW - 1;
        }

        var y = parseInt(event.layerY / this._scale);
        if (y < 0) {
            y = 0;
        } else if (y > this.screenH) {
            y = this.screenH - 1;
        }

        return [x, y];
    }

    /**
     * Draw text string.
     *
     * @param {string} text - Text to render.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {string} color - Hex color, such as '#000' (for black).
     * @param {string} align - Alignment ('left', 'center', 'right').
     * @return {number} Starting X.
     */
    drawString(text, x, y, color, align = "left") {
        if (align === "right") {
            var w = text.length * this._glyphW;
            x -= w;
        } else if (align === "center") {
            var w = text.length * this._glyphW;
            x -= parseInt(w / 2);
        }

        var startX = parseInt(x);
    	this._ctx.fillStyle = color;
	    var glyphs = text.length;
	    for (var i = 0; i < glyphs; i++) {
		    this._ctx.fillText(text[i], x, y);
		    x += this._glyphW;
	    }

        return startX;
    }
}
