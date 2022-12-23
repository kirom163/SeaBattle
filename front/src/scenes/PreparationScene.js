const shipDatas = [
	{ size: 4, direction: "row", startX: 10, startY: 345 },
	{ size: 3, direction: "row", startX: 10, startY: 390 },
	{ size: 3, direction: "row", startX: 120, startY: 390 },
	{ size: 2, direction: "row", startX: 10, startY: 435 },
	{ size: 2, direction: "row", startX: 88, startY: 435 },
	{ size: 2, direction: "row", startX: 167, startY: 435 },
	{ size: 1, direction: "row", startX: 10, startY: 480 },
	{ size: 1, direction: "row", startX: 55, startY: 480 },
	{ size: 1, direction: "row", startX: 100, startY: 480 },
	{ size: 1, direction: "row", startX: 145, startY: 480 },
];

class PreparationScene extends Scene {
	draggedShip = null;
	draggedOffsetX = 0;
	draggedOffestY = 0;
	removeEventListeners = [];

	init() {
		this.manually();
	}

	start() {
		const { player, opponent } = this.app;

		opponent.clear();
		player.removeAllShots();
		player.ships.forEach((ship) => (ship.killed = false));

		this.removeEventListeners = [];
		document.querySelectorAll('.app-menu-text').forEach(element => element.classList.remove('hidden'));
		document.querySelectorAll('.app-actions').forEach(element => element.classList.add('hidden'));
		document.querySelector('[data-scene="preparation"]').classList.remove('hidden');

		//Прячем вражеское поле
		document.querySelector('[data-side="opponent"]').hidden = true;

		const loadButton = document.querySelector('[data-action="load_strat"]');
		const saveButton = document.querySelector('[data-action="save_strat"]');
		const randomizeButton = document.querySelector('[data-action="randomize"]');
		const manuallyButton = document.querySelector('[data-action="manually"]');
		const shoresButton = document.querySelector('[data-action="shores"]');
		const diagonalButton = document.querySelector('[data-action="diagonal"]');
		const simpleButton = document.querySelector('[data-computer="simple"]');
		const middleButton = document.querySelector('[data-computer="middle"]');
		const hardButton = document.querySelector('[data-computer="hard"]');
		const randomButton = document.querySelector('[data-type="random"]');


		this.removeEventListeners.push(addListener(loadButton, "click", () => this.load_strat()));
		this.removeEventListeners.push(addListener(saveButton, "click", () => this.save_strat()));
		this.removeEventListeners.push(addListener(manuallyButton, "click", () => this.manually()));
		this.removeEventListeners.push(addListener(randomizeButton, "click", () => this.randomize()));
		this.removeEventListeners.push(addListener(shoresButton, "click", () => this.shores()));
		this.removeEventListeners.push(addListener(diagonalButton, "click", () => this.diagonal()));
		this.removeEventListeners.push(addListener(simpleButton, "click", () => this.startComputer("simple")));
		this.removeEventListeners.push(addListener(middleButton, "click", () => this.startComputer("middle")));
		this.removeEventListeners.push(addListener(hardButton, "click", () => this.startComputer("hard")));
		this.removeEventListeners.push(addListener(randomButton, "click", () => this.app.start("online", "random")));
		
	}

	stop() {
		for (const removeEventListener of this.removeEventListeners) {
			removeEventListener();
		}

		this.removeEventListeners = [];
	}

	update() {
		const { mouse, player } = this.app;

		// Потенциально хотим начать тянуть корабль
		if (!this.draggedShip && mouse.left && !mouse.pLeft) {
			const ship = player.ships.find((ship) => ship.isUnder(mouse));

			if (ship) {
				const shipRect = ship.div.getBoundingClientRect();

				this.draggedShip = ship;
				this.draggedOffsetX = mouse.x - shipRect.left;
				this.draggedOffsetY = mouse.y - shipRect.top;

				ship.x = null;
				ship.y = null;
			}

		}

		// Перетаскивание
		if (mouse.left && this.draggedShip) {
			const { left, top } = player.root.getBoundingClientRect();
			const x = mouse.x - left - this.draggedOffsetX;
			const y = mouse.y - top - this.draggedOffsetY;

			this.draggedShip.div.style.left = `${x}px`;
			this.draggedShip.div.style.top = `${y}px`;
		}

		// Бросание
		if (!mouse.left && this.draggedShip) {
			const ship = this.draggedShip;
			this.draggedShip = null;

			const {left, top} = ship.div.getBoundingClientRect();
			const {width, height} = player.cells[0][0].getBoundingClientRect();
			const point = {
				x: left + width / 2,
				y: top + height / 2
			}

			const cell = player.cells.flat().find((cell) => isUnderPoint(point, cell));
			if (cell) {
				const x = parseInt(cell.dataset.x);
				const y = parseInt(cell.dataset.y);
				player.removeShip(ship);
				player.addShip(ship, x, y);
			}
			else {
				player.removeShip(ship);
				player.addShip(ship);
			}
		}

		// Врощаение
		if (this.draggedShip && mouse.delta) {
			this.draggedShip.toggleDirection();
		}

		if (player.complete) {
			document.querySelector('[data-computer="simple"]').disabled = false;
			document.querySelector('[data-computer="middle"]').disabled = false;
			document.querySelector('[data-computer="hard"]').disabled = false;
			document.querySelector('[data-type="random"]').disabled = false;

			document.querySelector('[data-computer="difficulty"]').disabled = false;
            
		}
		else {
			document.querySelector('[data-computer="simple"]').disabled = true;
			document.querySelector('[data-computer="middle"]').disabled = true;
			document.querySelector('[data-computer="hard"]').disabled = true;
			document.querySelector('[data-type="random"]').disabled = true;
	
			document.querySelector('[data-computer="difficulty"]').disabled = true;
		}
	}
    save_strat(){
		console.log('кеееек');
		let user=JSON.stringify({ships:this.app.player.ships,shots:this.app.player.shots,matrix:this.app.player.matrix});
		let request = new XMLHttpRequest();
		request.open("POST", "/logos", true);   
		request.setRequestHeader("Content-Type", "application/json");
		console.log('hehehehe',this.app.player);
		
	 request.send(user);

	}
	load_strat(){
		const {player} = this.app;
		console.log('Загрузка.....');
		let user=JSON.stringify(this.app.player.matrix);
		let request = new XMLHttpRequest();
		request.open("POST", "/loados", true);   
		request.setRequestHeader("Content-Type", "application/json");
		request.addEventListener("load", function () {
			
			let receivedUser = JSON.parse(request.response);
			
			console.log('ccccccccccccccddddddddddddddddddddddcccccccccccccccccccdddddd',receivedUser);
		
			player.shots=receivedUser.shots;
			player.matrix=receivedUser.battlefield;
			
			console.log('ships------',player.shots);
			console.log('received-',receivedUser.ships)
			player.randomize1(ShipView,receivedUser.ships); //не работает
	
		});
	 request.send(user);
	}

	//Случайная расстановка
	randomize() {
		const {player} = this.app;
		this.app.player.randomize(ShipView);

		for (let i = 0; i < 10; i++) {
			const ship = player.ships[i];
			ship.startX = shipDatas[i].startX;
			ship.startY = shipDatas[i].startY;
		}
	}
	
	manually() {
		const { player } = this.app;
		player.removeAllShips();

		for (const { size, direction, startX, startY } of shipDatas) {
			const ship = new ShipView(size, direction, startX, startY);
			player.addShip(ship);
		}
	}

	shores() {
		const {player} = this.app;
		this.app.player.shores(ShipView);

		for (let i = 0; i < 10; i++) {
			const ship = player.ships[i];
			ship.startX = shipDatas[i].startX;
			ship.startY = shipDatas[i].startY;
			//console.log(ship.startX,ship.startY);
		}
	}

	diagonal() {
		const {player} = this.app;
		player.dia(ShipView);

		for (let i = 0; i < 10; i++) {
			const ship = player.ships[i];
			ship.startX = shipDatas[i].startX;
			ship.startY = shipDatas[i].startY;
		}
	}

	startComputer(level) {
		const matrix = this.app.player.matrix;
		const withoutShipItems = matrix.flat().filter((item) => !item.ship);
		let untouchables = [];
		let strategy = 0;
		if (level === "simple") {
			strategy = 1;
		} else if (level === "middle") {
			untouchables = getRandomSeveral(withoutShipItems, 0);
			strategy = 2;
		} else if (level === "hard") {
			strategy = 3;
			untouchables = getRandomSeveral(withoutShipItems, 0);
		}

		this.app.start("computer", untouchables, strategy);
	}

}