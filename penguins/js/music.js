"use strict";

var Music = function() {
    var m = {};
    m.music = null;
    m.playing = false;

    m.init = function(main) {
        m.music = main.createElement("audio");
        m.music.src = "assets/Backfire_loop.mp3";
        m.music.setAttribute("preload", "auto");
        m.music.setAttribute("controls", "none");
        m.music.setAttribute("loop", "auto");
        m.music.style.display = "none";
        main.body.appendChild(m.music);
        m.playing = false;
    }

    m.stop = function() {
	    m.music.pause();
	    m.playing = false;
    }

    m.start = function() {
	    m.music.play();
	    m.playing = true;
    }

    return m;
}