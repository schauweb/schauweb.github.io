"use strict";

var elemHex, elemDec, elemGles;

function init() {
	elemHex = document.getElementById('hex');
	elemDec = document.getElementById('dec');
	elemGles = document.getElementById('gles');
	elemHex.focus();

	document.getElementById('convertHex').addEventListener('click', () => { convertFromHex() });
	document.getElementById('convertDec').addEventListener('click', () => { convertFromDec() });
	document.getElementById('convertGles').addEventListener('click', () => { convertFromGles() });
}

function clearErrors() {
    elemHex.classList.remove('input-error');
    elemDec.classList.remove('input-error');
    elemGles.classList.remove('input-error');
}

function convertFromHex() {
	clearErrors();

	var src = elemHex.value;
	if (src.length < 1) {
		return;
	}

	if (src[0] == '#') {
		src = src.substring(1);
	}

	if (src.length == 3) {
		src = '' + src[0] + src[0] + src[1] + src[1] + src[2] + src[2];
	} else if (src.length != 6) {
		elemHex.classList.add('input-error');
		return;
	}

	var dec1 = Number("0x" + src.substring(0, 2));
	if (isNaN(dec1)) {
		elemHex.classList.add('input-error');
		return;
	}

	var dec2 = Number("0x" + src.substring(2, 4));
	if (isNaN(dec2)) {
		elemHex.classList.add('input-error');
		return;
	}

	var dec3 = Number("0x" + src.substring(4, 6));
	if (isNaN(dec3)) {
		elemHex.classList.add('input-error');
		return;
	}

	setDec(dec1, dec2, dec3);
	setGles(dec1, dec2, dec3);
}

function convertFromDec() {
	clearErrors();

	var src = elemDec.value.split(" ", 3);
	var dec1 = parseInt(src[0]);
	var dec2 = parseInt(src[1]);
	var dec3 = parseInt(src[2]);
	if (isNaN(dec1) || dec1 < 0 || dec1 > 255 ||
		isNaN(dec2) || dec2 < 0 || dec2 > 255 ||
		isNaN(dec3) || dec3 < 0 || dec3 > 255) {
		elemDec.classList.add('input-error');
		return
	}

	setHex(dec1, dec2, dec3);
	setGles(dec1, dec2, dec3);
}

function convertFromGles() {
	clearErrors();

	var src = elemGles.value;
	src = src.replaceAll(",", ".").split(" ", 3);
	var flt1 = parseFloat(src[0]);
	var flt2 = parseFloat(src[1]);
	var flt3 = parseFloat(src[2]);
	if (isNaN(flt1) || flt1 < 0.0 || flt1 > 1.0 ||
		isNaN(flt2) || flt2 < 0.0 || flt2 > 1.0 ||
		isNaN(flt3) || flt3 < 0.0 || flt3 > 1.0) {
		elemGles.classList.add('input-error');
		return
	}

	var dec1 = parseInt(flt1 * 255.0);
	var dec2 = parseInt(flt2 * 255.0);
	var dec3 = parseInt(flt3 * 255.0);

	setHex(dec1, dec2, dec3);
	setDec(dec1, dec2, dec3);
}

function setHex(dec1, dec2, dec3) {
	var h1 = ("0" + dec1.toString(16)).slice(-2);
	var h2 = ("0" + dec2.toString(16)).slice(-2);
	var h3 = ("0" + dec3.toString(16)).slice(-2);
	elemHex.value = '' + h1 + h2 + h3;
}

function setDec(dec1, dec2, dec3) {
	elemDec.value = dec1 + ' ' + dec2 + ' ' + dec3;
}

function setGles(dec1, dec2, dec3) {
	var g1 = +((dec1 / 255.0).toFixed(2));
	var g2 = +((dec2 / 255.0).toFixed(2));
	var g3 = +((dec3 / 255.0).toFixed(2));
	elemGles.value = '' + g1 + ' ' + g2 + ' ' + g3;
}
