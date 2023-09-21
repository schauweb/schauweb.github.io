class PageGame {
	constructor(scl, playerRepository, phases) {
		this.scl = scl;
		this.playerRepository = playerRepository;
		this.phases = phases;
		document.getElementById('back-to-players').addEventListener('click', () => { this.scl.goTo('#players'); });
	}

	show(params) {
		this.scl.showPage('game-page');
		this.displayPlayers();
	}

	displayPlayers() {
		let result = '';
		const players = this.playerRepository.get();
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			let div = '<div class="rounds-player" data-id="' + player.id + '">';
			div += player.name + ' (' + player.score + ')';
			div += '<br />' + player.phase + ': ' + this.phases[player.phase ];
			div += '</div>';
			result += div;
		}

		document.getElementById('rounds-list').innerHTML = result;

		const playerButtons = document.getElementsByClassName('rounds-player');
		for (let i = 0; i < playerButtons.length; i++) {
			const button = playerButtons[i];
			const id = button.getAttribute('data-id').valueOf();
			button.addEventListener('click', () => this.adjustScore(id));
		}
	}

	adjustScore(target) {
		this.scl.goTo("#score", target);
	}
}
