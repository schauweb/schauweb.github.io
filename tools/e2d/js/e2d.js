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
    '#fetching-page': new PageFetching(scl),
    '#currency-page': new PageCurrency(scl),
    '#calculate-page': new PageCalculate(scl)
}

scl.setRoutes(routes);
scl.goTo('#fetching-page')
