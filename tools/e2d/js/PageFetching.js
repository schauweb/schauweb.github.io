class PageFetching {
    constructor(scl) {
        this.scl = scl;
    }

    show(params) {
        this.scl.showPage('fetching-page');
        fetch(currencyUrl)
            .then(response => response.json())
            .then(data => {
                conversionRate = data.rates.DKK / data.rates.EUR;
                storage.set(rateKey, conversionRate);
                scl.goTo('#currency-page');
            })
            .catch(error => {
                console.log("Fetch error: " + error);
                if (storage.exists(rateKey)) {
                    conversionRate = storage.get(rateKey);
                } else {
                    conversionRate = 7.5;
                }
                scl.goTo('#currency-page');
            });
    }
}
