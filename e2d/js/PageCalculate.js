class PageCalculate {
    constructor(scl) {
        this.scl = scl;
        document.getElementById('calculate-back').addEventListener('click', () => { this.scl.goTo('#currency-page') });
        document.getElementById('calculate').addEventListener('click', () => { this.calculate() });
    }

    show(params) {
        this.scl.showPage('calculate-page');
		document.getElementById('eurToConvert').focus();
    }

    calculate() {
        var elem = document.getElementById('eurToConvert');
        var eur = elem.value;
        let digitRegExp = /^\d+([,.]\d+)?$/;

        if (!digitRegExp.test(eur)) {
            if (!elem.classList.contains('input-error')) {
                elem.classList.add('input-error')
            }
            return;
        }

        elem.classList.remove('input-error');
        var result = (parseFloat(eur) * conversionRate).toFixed(2);
        var html = '€' + eur + ' &rarr; DKK ' + result;
        document.getElementById('calculate-result').innerHTML = html;
    }
}
