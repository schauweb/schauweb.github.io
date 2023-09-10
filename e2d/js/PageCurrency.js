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
        var eur = [ 1, 15, 2, 20, 3, 25, 4, 30, 5, 40, 6, 50, 7, 75, 8, 100, 9, 150, 10, 200 ];
        var html = '<table><tbody>';
        for (var idx = 0; idx < eur.length; ) {
            var src = eur[idx++];
            html += '<tr><th>€' + src + ' &rarr;</th><td>DKK ' + this.getDKK(src) + '</td>';
            var src = eur[idx++];
            html += '<th>€' + src + ' &rarr;</th><td>DKK ' + this.getDKK(src) + '</td></tr>';
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