class PageCurrency {
    constructor(scl) {
        this.scl = scl;
        document.getElementById('convertEur').addEventListener('click', () => { this.scl.goTo('#calculate-page') });
    }

    show(params) {
        this.scl.showPage('currency-page');
        this.displayConversionsList();
    }

    displayConversionsList() {
        var eur = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200 ];
        var html = '<table><tbody>';
        for (var idx = 0; idx < eur.length; idx++) {
            var src = eur[idx];
            html += '<tr><th>€' + src + '</th><td class="middle">&rarr;</td><td class="right">DKK ' + this.getDKK(src) + '</td></tr>';
        }
        html += '</tbody></table>';
        document.getElementById('conversions').innerHTML = html;
    }

    getDKK(src) {
        var dkk = src * conversionRate;
        dkk = dkk.toFixed(2);
        var decimal = dkk % 1;
        dkk = parseInt(dkk);
        if (decimal < 0.50) {
            return (dkk + 0.50).toFixed(2);
        }
        return (dkk++).toFixed(2);
    }
}