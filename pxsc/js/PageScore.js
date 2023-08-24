class PageScore {
	constructor(scl, playerRepository) {
		this.scl = scl;
		this.playerRepository = playerRepository;
		document.getElementById('score-back').addEventListener('click', () => { this.backToGame() });
		this.phaseList = document.getElementById("phaseList");
	}

	backToGame() {
		this.player.score = +(document.getElementById('newScore')).value;
		var selectedIndex = this.phaseList.selectedIndex;
		var option = this.phaseList.options[selectedIndex];
		this.player.phase = +option.value;
		this.playerRepository.save();
		this.scl.goTo('#game');
	}

	show(params) {
		const id = +params;
		this.player = this.playerRepository.getById(id);
		document.getElementById('score-player-name').innerHTML = this.player.name;
		(document.getElementById('newScore')).value = '' + this.player.score;
		this.phaseList.selectedIndex = this.player.phase - 1;
		this.scl.showPage('score-page');
	}
}
