"use strict";

const currencyUrl = "https://cdn.forexvalutaomregner.dk/api/latest.json";
const rateKey = 'rate';
const storage = new Storage()

var conversionRate = 7.5

let hash = '#currency';
if (window.location.hash) {
    hash = window.location.hash;
}

const scl = new Scl(window, 'e2d', '#currency-page');
//const scl = new Scl(window, '', '#currency-page');
let routes = {
    '#currency-page': new PageCurrency(scl),
    '#calculate-page': new PageCalculate(scl)
}

scl.setRoutes(routes);

fetch(currencyUrl)
    .then(response => response.json())
    .then(data => {
        conversionRate = data.rates.DKK / data.rates.EUR;
        storage.set(rateKey, conversionRate);
        scl.goTo(hash);
    })
    .catch(error => {
        console.log("Fetch error: " + error);
        if (storage.exists(rateKey)) {
            conversionRate = storage.get(rateKey);
        } else {
            conversionRate = 7.5;
        }
        scl.goTo(hash);
    });