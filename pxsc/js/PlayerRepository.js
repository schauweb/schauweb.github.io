class PlayerRepository {
	constructor(storage) {
		this.storage = storage;
		this.players = [];
	}

	load() {
		if (this.storage.exists(this.keyPlayers) === false) {
			this.players = [];
			return;
		}

		this.players = JSON.parse(this.storage.get(this.keyPlayers));
	}

	save() {
		this.players.sort((lhs, rhs) => {
			if (lhs.phase < rhs.phase) {
				return 1;
			}

			if (lhs.phase > rhs.phase) {
				return -1;
			}

			if (lhs.score < rhs.score) {
				return -1;
			}

			if (lhs.score > rhs.score) {
				return 1;
			}

			return lhs.name.localeCompare(rhs.name);
		});

		const payload = JSON.stringify(this.players);
		this.storage.set(this.keyPlayers, payload);
	}

	add(player) {
		let id = 0;

		do {
			id = NextId();
		} while (this.players.some(x => x.id == id));

		player.id = id;
		this.players.push(player);
		this.save();
	}

	delete(player) {
		this.players = this.players.filter(x => x.id != player.id);
		this.save();
	}

	get() {
		return this.players;
	}

	getById(id) {
		for (let i = 0; i < this.players.length; i++) {
			const player = this.players[i];
			if (player.id == id) {
				return player;
			}
		}

		throw new Error('No such player with id: ' + id);
	}
}
