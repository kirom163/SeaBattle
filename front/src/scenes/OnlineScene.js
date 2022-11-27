//const Shot = require("../../../back/src/Shot");

class OnlineScene extends Scene {
    actionsBar = null;
	status = "";
	ownTurn = false;

	init() {
		const actionsBar = document.querySelector('[data-scene="online"]');
		this.actionsBar = actionsBar;

		const { socket , player, opponent} = this.app;

		socket.on("statusChange", (status) => {
			this.status = status;
			this.statusUpdate();
		});

		socket.on("turnUpdate", (ownTurn) => {
			this.ownTurn = ownTurn;
			this.statusUpdate();
		});

		socket.on("addShot", ({x, y, variant}) => {
			const shot = new ShotView(x, y, variant);
			if (this.ownTurn) {
				this.app.opponent.addShot(shot);
			} else {
				this.app.player.addShot(shot);
			}
		})

		socket.on("setShots", (ownShots, opponentShots) => {
			player.removeAllShots();

			for (const {x, y, variant} of ownShots) {
				const shot = new ShotView(x, y, variant);
				player.addShot(shot);
			}

			opponent.removeAllShots();

			for (const {x, y, variant} of opponentShots) {
				const shot = new ShotView(x, y, variant);
				opponent.addShot(shot);
			}
		})

		this.statusUpdate();
	}

	start(variant) {
		const { socket , player} = this.app;
		socket.emit("shipSet", player.ships.map((ship) => ({
			size: ship.size, direction: ship.direction, x: ship.x, y: ship.y
		})));

		socket.emit("findRandomOpponent");

		//Показываем вражеское поле
		document.querySelector('[data-side="opponent"]').hidden = false;
		document.querySelectorAll(".app-actions").forEach((element) => element.classList.add("hidden"));
		document.querySelector('[data-scene="online"]').classList.remove("hidden");
		//Убираем лишний текст
		document.querySelectorAll('.app-menu-text').forEach(element => element.classList.add('hidden'));
		this.statusUpdate();
	}

	statusUpdate() {
		const statusDiv = this.actionsBar.querySelector(".battlefield-status");

		if (!this.status) {
			statusDiv.textContent = "";
		} else if (this.status === "randomFinding") {
			statusDiv.textContent = "Поиск соперника";
		} else if (this.status === "play") {
			statusDiv.textContent = this.ownTurn ? "Ваш ход" : "Ход противника";
		} else if (this.status === "winner") {
			statusDiv.textContent = "Вы выиграли ^_^";
		} else if (this.status === "loser") {
			statusDiv.textContent = "Вы проиграли :(";
		}
	}

	update() {
		const {mouse, player, opponent, socket} = this.app;
		const cells = opponent.cells.flat();
		cells.forEach(x => x.classList.remove("battlefield-item__active"));

		if (player.loser) {
			return;
		}

		if (opponent.isUnder(mouse)) {
			const cell = opponent.cells.flat().find((cell) => isUnderPoint(mouse, cell));
			if (cell) {
				cell.classList.add("battlefield-item__active");
			}

			if(mouse.left && !mouse.pLeft) {
				const x = parseInt(cell.dataset.x);
				const y = parseInt(cell.dataset.y);
				socket.emit("addShot", x, y);
			}
		}
	}
}