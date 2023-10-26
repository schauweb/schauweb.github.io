"use strict";

const mapValues = [
    ["a", "ka"], ["b", "tu"], ["c", "mi"], ["d", "te"], ["e", "ku"], ["f", "lu"], ["g", "ji"], ["h", "ri"],
    ["i", "ki"], ["j", "zu"], ["k", "me"], ["l", "ta"], ["m", "rin"], ["n", "to"], ["o", "mo"], ["p", "no"],
    ["q", "ke"], ["r", "shi"], ["s", "ari"], ["t", "chi"], ["u", "do"], ["v", "ru"], ["w", "mei"], ["x", "na"],
    ["y", "fu"], ["z", "zi"], ["æ", "fa"], ["ø", "ti"], ["å", "zo"]
]
const map = new Map(mapValues);
const reverse = new Map();
for (let [key, value] of map.entries()) {
    reverse.set(value, key);
}

let hash = '#translation-page';
if (window.location.hash) {
    hash = window.location.hash;
}

const scl = new Scl(window, 'orientalizer', '#translation-page');
//const scl = new Scl(window, '', '#translation-page');
let routes = {
    '#translation-page': new Translation(scl),
}

scl.setRoutes(routes);
scl.goTo('#translation-page')
