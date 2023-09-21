"use strict";

var InputHandler = function () {
    var i = {};

    i.init = function(canvas, clickDown, clickUp, mouseMove) {
        i.canvas = canvas;
        canvas.addEventListener("mousedown", function (e) {
            clickDown(i.getMousePosition(canvas, e));
        }, false);

        canvas.addEventListener("mouseup", function (e) {
            clickUp(i.getMousePosition(canvas, e));
        }, false);

        canvas.addEventListener("mousemove", function (e) {
            mouseMove(i.getMousePosition(canvas, e));
        }, false);
    }

    i.getMousePosition = function (canvas, mouseEvent) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: parseInt(mouseEvent.clientX - rect.left),
            y: parseInt(mouseEvent.clientY - rect.top)
        };
    }

    return i;
}