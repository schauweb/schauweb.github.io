"use strict";

var StateManager = function () {
    const STATE_KEY = 'state';
    var s = {};

    var localStorageSupported = typeof window['localStorage'] != "undefined" && window['localStorage'] != null;
    if (localStorageSupported === false) {
        s.load = function () {};
        s.save = function (moves, penguins) {};
        s.clear = function () {};
    } else {
        s.load = function () {
            var raw = localStorage.getItem(STATE_KEY);
            if (!raw) {
                return null;
            }

            localStorage.removeItem(STATE_KEY);
            return JSON.parse(raw);
        };

        s.save = function (moves, penguins) {
            var data = { version: 'v1', moves: moves, penguins: penguins };
            localStorage.setItem(STATE_KEY, JSON.stringify(data));
        }

        s.clear = function () {
            if (!!localStorage.getItem(STATE_KEY)) {
                localStorage.removeItem(STATE_KEY);
            }
        }
    }

    return s;
}