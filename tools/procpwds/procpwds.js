"use strict";

const consonants = "bcdfghjklmnpqrstvwxyz";
const vocals = "aeiou";
const numbers = "0123456789";

var elemLength, elemDigits;

function init() {
	elemLength = document.getElementById('length');
	elemLength.value = 20;
	elemLength.focus();
	elemDigits = document.getElementById('digits');
	elemDigits.value = 4;
	document.getElementById('generate').addEventListener('click', () => { generate() });
}

function generate() {
    elemLength.classList.remove('input-error');
    elemDigits.classList.remove('input-error');

	var length = parseInt(elemLength.value);
	if (isNaN(length) || length < 0) {
		elemLength.classList.add('input-error');
		return;
	}

	var digits = parseInt(elemDigits.value);
	if (isNaN(digits) || digits < 0) {
		elemDigits.classList.add('input-error');
		return;
	}

	if (length == 0 && digits == 0) {
		return;
	}

	if (digits > length) {
		digits = length;
	}

	var passwords = '';
	for (var i = 0; i < 10; i++) {
		passwords += generatePassword(length, digits) + '\r\n';
	}

	document.getElementById('result').innerHTML = passwords;
}

function getRandom(src) {
	var sLen = src.length;
	return src[parseInt(Math.random() * sLen)];
}

function generatePassword(length, digits) {
	length -= digits;

	var password = '';
	var alphas = parseInt(length / 2);
	for (var i = 0; i < alphas; i++) {
		password += getRandom(consonants);
		password += getRandom(vocals);
	}

	if (length % 2 == 1) {
		password += getRandom(vocals);
	}

	for (var i = 0; i < digits; i++) {
		password += getRandom(numbers);
	}

	return password;
}
