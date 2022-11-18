class ComputerScene extends Scene {
	untouchables = [];
	strategy = 0;
	playerTurn = true;
	status = null;
	removeEventListeners = [];
	//Поля для контроля добивания
	target = false; 
	targetX = null; 
	targetY = null;
	key = false;
	xR = true;
	xL = true;
	yU = true;
	yD = true;
	step = 1;
	//Поле для контроля диагоналей
	diagonal = 0;
	init () {
		this.status = document.querySelector(".battlefield-status");
	}

    start(untouchables, strategy) {
		const {opponent} = this.app;
		//Убираем лишний текст
		document.querySelectorAll('.app-menu-text').forEach(element => element.classList.add('hidden'));
		//Убираем лишние элементы
		document
			.querySelectorAll(".app-actions")
			.forEach((element) => element.classList.add("hidden"));
		//Показываем нужные элементы
		document
			.querySelector('[data-scene="computer"]')
			.classList.remove("hidden");
		opponent.clear();
		opponent.randomize(ShipView);

		this.untouchables = untouchables;
		this.strategy = strategy;
		console.log('strategy ', strategy);
		this.removeEventListeners = [];

		const giveupButton = document.querySelector('[data-action="giveup"]');
		giveupButton.classList.remove("hidden");
		const newgameButton = document.querySelector('[data-action="newgame"]');
		newgameButton.classList.add("hidden");

		this.removeEventListeners.push(addListener(giveupButton, 'click', () => {
			this.app.start("preparation");
		}));
		this.removeEventListeners.push(addListener(newgameButton, 'click', () => {
			this.app.start("preparation");
		}))
	}

	stop() {
		//На месте убитых кораблей оставался выстрел "промах", причем только визуальная часть. Приходится так вот убирать.
		document.querySelectorAll('.shot').forEach(element => element.remove());
		for (const removeEventListener of this.removeEventListeners) {
			removeEventListener();
		}
		this.status.textContent = "";
		this.removeEventListeners = [];
		//Поля для контроля добивания
		this.target = false; 
		this.targetX = null; 
		this.targetY = null;
		this.key = false;
		this.xR = true;
		this.xL = true;
		this.yU = true;
		this.yD = true;
		this.step = 1;
		//Поле для контроля диагоналей
		this.diagonal = 0;
	}

	inField(x,y) {
		const isNumber = (n) => parseInt(n) === n && !isNaN(n) && ![Infinity, -Infinity].includes(n)

		if (!isNumber(x) || !isNumber(y)) {
			return false;
		}
		
		return 0 <= x && x <= 9 && 0 <= y && y <= 9;
	}

	inDiagonal(x,y) {
		const isNumber = (n) => parseInt(n) === n && !isNaN(n) && ![Infinity, -Infinity].includes(n)

		if (!isNumber(x) || !isNumber(y)) {
			return false;
		}
		
		return x === y || x === (9 - y);
	}

	update() {
		const {mouse, opponent, player} = this.app;
		const isEnd = opponent.loser || player.loser;
        
		const cells = opponent.cells.flat();
		cells.forEach(cell => cell.classList.remove("battlefield-item__active"));
		
		if (isEnd) {
			if (opponent.loser) {
				this.status.textContent = "Вы выиграли ^_^"
			}
			else {
				this.status.textContent = "Вы проиграли :("
			}

			document.querySelector('[data-action="giveup"]').classList.add("hidden");
			document.querySelector('[data-action="newgame"]').classList.remove("hidden");
			return;
		} 

		if (isUnderPoint(mouse, opponent.table)) {
			const cell = cells.find(cell => isUnderPoint(mouse, cell));

			if (cell) {
				cell.classList.add("battlefield-item__active");

				if (this.playerTurn && mouse.left && !mouse.pLeft) {
					const x = parseInt(cell.dataset.x);
					const y = parseInt(cell.dataset.y);

					const shot = new ShotView(x,y);
					const result = opponent.addShot(shot);

					if (result) {
						this.playerTurn = shot.variant === "miss" ? false : true;
					}
				}
			}
			
		}

		if (!this.playerTurn) {
			//Случайные координаты
			let x;
			let y;
			x = getRandomBetween(0, 9);
			y = getRandomBetween(0, 9);
			if (this.strategy === 3 && this.diagonal < 20) {
				const choise = getRandomBetween(0,1);
				if (choise === 1) {
					y = x;
				}
				else {
					y = 9 - x;
				}
				console.log('x ', x, ' y ', y);
			}

			let inUntouchable = false;

			for (const item of this.untouchables) {
				if (item.x === x && item.y === y) {
					inUntouchable = true;
					break;
				}
			}

			if (!inUntouchable) {
				const shot = new ShotView(x, y);
				let result;

				if (this.strategy === 1) {
					result = player.addShot(shot);
				}
				//Стратегия добивания
				else {
					this.key = true;
					if (!this.target) {
						//Добавление выстрела
						result = player.addShotFinish(shot);
					}
					if (result && !this.target) {
						if (this.inDiagonal(x,y)) {
							//this.diagonal++;
							console.log('diagonals shot: ', this.diagonal);
						}
						if (shot.variant === "miss") {
							this.playerTurn = true;
						}
						else {
							if (shot.variant != "killed") {
								this.target = true;
								this.targetX = shot.x;
								this.targetY = shot.y;
								console.log('target: x ', this.targetX, ' y ', this.targetY);
								this.xR = true;
								this.xL = true;
								this.yU = true;
								this.yD = true;
							}
							this.playerTurn = false;
						}
						//this.playerTurn = shot.variant === "miss" ? true : false;
					}
					while (this.xR && this.target && this.key) {
						console.log('check right side');
						if (!this.inField(this.targetX + this.step, this.targetY)) {
							this.xR = false;
							this.key = false;
							this.step = 1;
							break;
						}
						let s = new ShotView(this.targetX + this.step, this.targetY);
						result = player.addShotFinish(s);
						if (result) {
							if (this.inDiagonal(this.targetX + this.step, this.targetY)) {
								//this.diagonal++;
								//console.log('diagonals shot: ', this.diagonal);
							}
							if (s.variant === "miss") {
								console.log('miss right on ', this.step);
								this.xR = false;
								this.key = false;
								this.playerTurn = true;
								this.step = 1;
								break;
							}
							else {
								this.playerTurn = false;
								this.step++;
							}
							if (s.variant === "killed") {
								this.step = 1;
								this.target = false;
								this.xR = false;
								
							}
						}
						else {
							this.xR = false;
							this.key = false;
							this.step = 1;
							
						}
					}
					while (this.xL && this.target && this.key && !this.playerTurn) {
						console.log('check left side, key: ', this.key);
						if (!this.inField(this.targetX - this.step, this.targetY)) {
							this.xL = false;
							this.key = false;
							this.step = 1;
							break;
						}
						let s = new ShotView(this.targetX - this.step, this.targetY);
						result = player.addShotFinish(s);
						if (result) {
							if (this.inDiagonal(this.targetX - this.step, this.targetY)) {
								//this.diagonal++;
								//console.log('diagonals shot: ', this.diagonal);
							}
							if (s.variant === "miss") {
								console.log('miss left on ', this.step);
								this.xL = false;
								this.key = false;
								this.playerTurn = true;
								this.step = 1;
							}
							else {
								this.playerTurn = false;
								this.step++;
							}
							if (s.variant === "killed") {
								this.step = 1;
								this.target = false;
								this.xL = false;
								
							}
						}
						else {
							this.xL = false;
							this.key = false;
							this.step = 1;
							
						}
					}
					//В связи с тем что ось У направлена вниз, "уВверх" это вниз, а "уВниз" это вверх
					while (this.yU && this.target && this.key) {
						console.log('check down side');
						if (!this.inField(this.targetX, this.targetY + this.step)) {
							this.yU = false;
							this.key = false;
							this.step = 1;
							break;
						}
						let s = new ShotView(this.targetX, this.targetY + this.step);
							result = player.addShotFinish(s);
						if (result) {
							if (this.inDiagonal(this.targetX, this.targetY + this.step)) {
								//this.diagonal++;
								//console.log('diagonals shot: ', this.diagonal);
							}
							if (s.variant === "miss") {
								console.log('miss up on ', this.step);
								this.yU = false;
								this.key = false;
								this.playerTurn = true;
								this.step = 1;
							}
							else {
								this.playerTurn = false;
								this.step++;
							}
							if (s.variant === "killed") {
								this.step = 1;
								this.target = false;
								this.yU = false;
								
							}
						}
						else {
							this.yU = false;
							this.key = false;
							this.step = 1;
							
						}
					}
					while (this.yD && this.target && this.key) {
						console.log('check up side');
						if (!this.inField(this.targetX, this.targetY - this.step)) {
							this.yD = false;
							this.key = false;
							this.step = 1;
							break;
						}
						let s = new ShotView(this.targetX, this.targetY - this.step);
						result = player.addShotFinish(s);
						if (result) {
							if (this.inDiagonal(this.targetX, this.targetY - this.step)) {
								//this.diagonal++;
								//console.log('diagonals shot: ', this.diagonal);
							}
							if (s.variant === "miss") {
								console.log('miss down on ', this.step);
								this.yD = false;
								this.key = false;
								this.playerTurn = true;
								this.step = 1;
							}
							else {
								this.playerTurn = false;
								this.step++;
							}
							if (s.variant === "killed") {
								this.step = 1;
								this.target = false;
								this.yD = false;
								
							}
						}
						else {
							this.yD = false;
							this.key = false;
							this.step = 1;
							
						}
					}
				}

				if (result) {
					if (shot.variant === "miss") {
						this.playerTurn = true;
					}
					else {
						this.playerTurn = false;
					}
					//this.playerTurn = shot.variant === "miss" ? true : false;
				}
				if (!this.key) this.playerTurn = true;
				console.log('thats it, playerTurn ', this.playerTurn, ' key ', this.key);
				this.diagonal = player.getDia();
				console.log('diagonal shots ', this.diagonal);
			}
		}

		if (this.playerTurn) {
			this.status.textContent = "Ваш ход";
		} else {
			this.status.textContent = "Ход компьютера";
		}
	}
	delay(time) {
		return new Promise(resolve => setTimeout(resolve, time));
	  }
}