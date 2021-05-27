var globalId = 0;
function NextId() {
	globalId++;
	return globalId;
}

let hash = '#players';
if (window.location.hash) {
	hash = window.location.hash;
}

let phases = [];
phases[1] = "Two sets of three";
phases[2] = "One set of three + one run of four";
phases[3] = "One set of four + one run of four";
phases[4] = "One run of seven";
phases[5] = "One run of eight";
phases[6] = "One run of nine";
phases[7] = "Two sets of four";
phases[8] = "Seven cards of one color";
phases[9] = "One set of five + one set of two";
phases[10] = "One set of five + one set of three";
var html = "";
for (var i = 1; i < 11; i++) {
	html += '<option value="' + i + '">' + i + ': ' + phases[i] + '</option>';
}

const storage = new Storage();
const scl = new Scl(window, '/pxsc', '#players');
const playerRepository = new PlayerRepository(storage);

let routes = {
	'#players': new PagePlayers(scl, playerRepository),
	'#game': new PageGame(scl, playerRepository, phases),
	'#score': new PageScore(scl, playerRepository)
};

scl.setRoutes(routes);
document.getElementById('phaseList').innerHTML = html;

window.NextId = NextId;

scl.goTo(hash);
