class PagePlayers {
	constructor(scl, playerRepository) {
		this.scl = scl;
		this.playerRepository = playerRepository;
		document.getElementById('add-player').addEventListener('click', () => { this.addPlayer() });
		document.getElementById('start-game').addEventListener('click', () => { this.startNewGame() });
		document.getElementById('continue-game').addEventListener('click', () => { this.continueGame() });
		this.playerRepository.load();
	}

	show(params) {
		this.scl.showPage('players-page');
		this.displayPlayers();
	}

	displayPlayers() {
		let result = '';
		const players = this.playerRepository.get();
		for (let i = 0; i < players.length; i++) {
			let div = '<div class="players-player">';
			const player = players[i];
			div += player.name;
			div += ' <span class="delete" data-id="' + player.id + '">X</span>';
			div += '</div>';
			result += div;
		}

		document.getElementById('players-list').innerHTML = result;
		const deleteButtons = document.getElementsByClassName('delete');
		for (let i = 0; i < deleteButtons.length; i++) {
			const button = deleteButtons[i];
			const id = button.getAttribute('data-id').valueOf();
			button.addEventListener('click', () => this.deletePlayer(id));
		}

		this.scl.showHideElement('players-title', players.length > 0);
		this.scl.showHideElement('start-game', players.length > 1);
		this.scl.showHideElement('continue-game', players.length > 1);
	}

	deletePlayer(target) {
		const id = +target;
		const players = this.playerRepository.get();
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			if (player.id == id) {
				this.playerRepository.delete(player);
				break;
			}
		}

		this.displayPlayers();
	}

	addPlayer() {
		const nameElement = document.getElementById('newPlayer');
		let name = nameElement.value;
		if (!name) {
			return;
		}
		name = name.trim();
		if (!name) {
			return;
		}

		const player = new Player(name);
		player.phase = 1;
		player.score = 0;
		this.playerRepository.add(player);
		this.displayPlayers();

		nameElement.value = "";
		nameElement.focus();
	}

	startNewGame() {
		const players = this.playerRepository.get();
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			player.phase = 1;
			player.score = 0;
		}

		this.playerRepository.save();
		this.scl.goTo('#game');
	}

	continueGame() {
		this.scl.goTo('#game');
	}
}
