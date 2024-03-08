class Scl {
	constructor(window, path, defaultRoute) {
		this.window = window;
		this.path = path;
		this.defaultRoute = defaultRoute;
		this.hidePages();

		this.window.onpopstate = (routes) => {
			const page = this.getPage(window.location.pathname);
			page.show();
		}
	}

	getPage(pathName) {
		if (pathName in this.routes) {
			return this.routes[pathName];
		}

		return this.routes[this.defaultRoute];
	}

	setRoutes(routes) {
		this.routes = routes;
	}

	hidePages() {
		const pages = document.getElementsByClassName('page');
		for (let i = 0; i < pages.length; i++) {
			pages[i].style.display = 'none';
		};
	}

	showPage(page) {
		this.hidePages();
		document.getElementById(page).style.display = 'block';
	}

	showHideElement(selector, show) {
		const element = document.getElementById(selector);
		if (show === true) {
			element.classList.remove('hidden');
			return;
		}

		element.classList.add('hidden');
	}

	goTo(pathName, params = "") {
		let url = this.window.location.origin + '/';
		if (this.path !== '') {
			url += this.path + '/' + pathName;
		}
		this.window.history.pushState({}, pathName, url);
		const page = this.getPage(pathName);
		page.show(params);
	}
}
