"use strict";

class Translation {
    constructor(scl) {
        this.scl = scl;
        document.getElementById('translate').addEventListener('click', () => { this.translate() });
        document.getElementById('reverse').addEventListener('click', () => { this.reverse() });
    }

    show(params) {
        this.scl.showPage('translation-page');
    }

    getName() {
        var elem = document.getElementById('name');
        var name = elem.value;
        if (!name || !name.trim()) {
            if (!elem.classList.contains('input-error')) {
                elem.classList.add('input-error')
            }

            elem.focus();
            return ''
        }

        elem.classList.remove('input-error');
        return name.trim().toLowerCase();
    }

    setTranslationResult(result) {
        if (result.length < 1) {
            return;
        }

        result = result[0].toUpperCase() + result.substr(1);
        document.getElementById('translation-result').innerHTML = "Orientalized name: " + result + "";
    }

    translate() {
        var name = this.getName();
        var newName = '';

        for (var i = 0; i < name.length; i++) {
            var c = name[i];
            if (map.has(c)) {
                newName += map.get(c)
            }
        }

        this.setTranslationResult(newName);
    }

    reverse() {        
        var name = this.getName() + '   ';
        var newName = '';

        for (var i = 0; i < name.length; ) {
            var c = name.substring(i, i + 3);
            if (reverse.has(c)) {
                newName += reverse.get(c)
                i += 3;
                continue;
            }

            c = name.substring(i, i + 2);
            if (reverse.has(c)) {
                newName += reverse.get(c);
                i += 2;
                continue;
            }

            i++;
        }

        this.setTranslationResult(newName);
    }
}