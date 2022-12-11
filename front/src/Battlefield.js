class Battlefield {
	ships = [];
	shots = [];
	diagonal = 0;//Для диагоналей (тест)
	#matrix = null;
	#changed = true;

	get loser() {

		for (const ship of this.ships) {
			if (!ship.killed) {
				return false;
			}
		}

		return true;
	}

	getDia() {
		let res = 0;
		for (const {x, y} of this.shots) {
			if (this.inDiagonal(x,y)) {
				res++;
				console.log('dia: x ',x, ' y ', y);
			}
		}
		return res;
	}

	get matrix() {
		if (!this.#changed) {
			return this.#matrix;
		}

		const matrix = [];

		for (let y = 0; y < 10; y++) {
			const row = [];
			for (let x  = 0; x < 10; x++) {
				const item = {
					x, y, ship: null, free: true, shoted: false, wounded: false
				};

				row.push(item);
			}

			matrix.push(row);
		}

		for (const ship of this.ships) {
			if (!ship.placed) {
				continue;
			}
			const {x, y} = ship;
			const dx = ship.direction === "row";
			const dy = ship.direction === "column";

			for (let i = 0; i < ship.size; i++) {
				const cy = y + dy * i;
				const cx = x + dx * i;
				const item = matrix[cy][cx];
				item.ship = ship;
			}

			for (let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++) {
				for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + 1; x++) {
					if (this.inField(x,y)) {
						const item = matrix[y][x];
						item.free = false;
					}
				}
			}
		}

		for (const {x, y} of this.shots) {
			const item = matrix[y][x];
			item.shoted = true;

			if (item.ship) {
				item.wounded = true;
			}
		}

		this.#matrix = matrix;
		this.#changed = false;
		return this.#matrix;
	}

	get complete () {
		if (this.ships.length !== 10) {
			return false;
		}

		for (const ship of this.ships) {
			if (!ship.placed) {
				return false;
			}
		}
		return true;
	}

	inField(x, y) {
		const isNumber = (n) => parseInt(n) === n && !isNaN(n) && ![Infinity, -Infinity].includes(n)

		if (!isNumber(x) || !isNumber(y)) {
			return false;
		}
		
		return 0 <= x && x <= 9 && 0 <= y && y <= 9;
	}

	inShore(x, y) {
		if ((x >= 1 && x <= 8) && (y >= 1 && y <= 8)) {
			return false;
		}
		else return true;
	}

	inCenter(x,y) {
		if ((x >= 2 && x <= 7) && (y >= 2 && y <= 7)) {
			return true;
		}
		else return false;
	}

	inDiagonal(x,y) {
		return x == y || x === (9-y);
	}

	addShip(ship, x, y) {
		if (this.ships.includes(ship)) {
			return false;
		}

		this.ships.push(ship);

		if(this.inField(x,y)) {
			const dx = ship.direction === "row";
			const dy = ship.direction === "column";
			let placed = true;

			for (let i = 0; i < ship.size; i++) {
				const cy = y + dy * i;
				const cx = x + dx * i;

				if (!this.inField(cx,cy)) {
					placed = false;
					break;
				}

				const item = this.matrix[cy][cx];
				item.ship = ship;
				if (!item.free) {
					placed = false;
					break;
				}
			}

			if (placed) {
				Object.assign(ship, {x, y});
			}
		}

		this.#changed = true;
		return true;
	}

	removeShip(ship) {
		if (!this.ships.includes(ship)) {
			return false;
		}

		const index = this.ships.indexOf(ship);
		this.ships.splice(index, 1);

		ship.x = null;
		ship.y =  null;
		this.#changed = true;
		return true;
	}

	removeAllShips() {
		const ships = this.ships.slice();

		for (const ship of ships) {
			this.removeShip(ship);
		}

		return ships.length;
	}

	addShot(shot) {
		for (const { x, y } of this.shots) {
			if (x === shot.x && y === shot.y) {
				return false;
			}
		}

		this.shots.push(shot);
		this.#changed = true;

		const matrix = this.matrix;
		const { x, y } = shot;

		if (matrix[y][x].ship) {
			shot.setVariant("wounded");

			const { ship } = matrix[y][x];
			const dx = ship.direction === "row";
			const dy = ship.direction === "column";

			let killed = true;

			for (let i = 0; i < ship.size; i++) {
				const cx = ship.x + dx * i;
				const cy = ship.y + dy * i;
				const item = matrix[cy][cx];

				if (!item.wounded) {
					killed = false;
					break;
				}
			}

			if (killed) {
				ship.killed = true;

				for (let i = 0; i < ship.size; i++) {
					const cx = ship.x + dx * i;
					const cy = ship.y + dy * i;

					const shot = this.shots.find(
						(shot) => shot.x === cx && shot.y === cy
					);
					shot.setVariant("killed")
				}
				
				//Маркеры вокруг убитого поля - графическая часть  работает плохо (
				for (let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++) {
					for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + 1; x++) {
						if (this.inField(x,y)) {
							const shot = new ShotView(x,y);
							 // Находит повторные выстрелы
							if (this.shots.find((s) => s.x === x && s.y === y)) {
								//this.shots.push(shot);
								//console.log('found ', shot);
							} 
							else 
							this.shots.push(shot);
							//графика - возможно в будущем приведет к ошибкам
							this.polygon.append(shot.div);
							const cell = this.cells[shot.y][shot.x];
							const cellRect = cell.getBoundingClientRect();
							const rootRect = this.root.getBoundingClientRect();

							shot.div.style.left = `${cellRect.left - rootRect.left}px`;
							shot.div.style.top = `${cellRect.top - rootRect.top}px`;
							//shot.setVariant("wounded", true);
						}
					}
				} 
			}
		}
		//console.log(this.shots);
		this.#changed = true;
		return true;
	}
	//Выстрел с добиванием - пока что просто выстрел
	addShotFinish(shot) {
		for (const { x, y } of this.shots) {
			if (x === shot.x && y === shot.y) {
				return false;
			}
		}

		this.shots.push(shot);
		this.#changed = true;

		const matrix = this.matrix;
		const { x, y } = shot;

		console.log('addShotFinish');

		if (matrix[y][x].ship) {
			shot.setVariant("wounded");

			const { ship } = matrix[y][x];
			const dx = ship.direction === "row";
			const dy = ship.direction === "column";

			let killed = true;

			for (let i = 0; i < ship.size; i++) {
				const cx = ship.x + dx * i;
				const cy = ship.y + dy * i;
				const item = matrix[cy][cx];

				if (!item.wounded) {
					killed = false;
					break;
				}
			}


			if (killed) {
				ship.killed = true;

				for (let i = 0; i < ship.size; i++) {
					const cx = ship.x + dx * i;
					const cy = ship.y + dy * i;

					const shot = this.shots.find(
						(shot) => shot.x === cx && shot.y === cy
					);
					shot.setVariant("killed")
				}
				
				//Маркеры вокруг убитого поля - графическая часть  работает плохо (
				for (let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++) {
					for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + 1; x++) {
						if (this.inField(x,y)) {
							const shot = new ShotView(x,y);
							 // Находит повторные выстрелы
							 if (this.shots.find((s) => s.x === x && s.y === y)) {
								//this.shots.push(shot);
								//console.log('found ', shot);
							} 
							else 
							this.shots.push(shot);
							//графика - возможно в будущем приведет к ошибкам
							this.polygon.append(shot.div);
							const cell = this.cells[shot.y][shot.x];
							const cellRect = cell.getBoundingClientRect();
							const rootRect = this.root.getBoundingClientRect();

							shot.div.style.left = `${cellRect.left - rootRect.left}px`;
							shot.div.style.top = `${cellRect.top - rootRect.top}px`;
							//shot.setVariant("wounded", true);
						}
					}
				} 
			}
		}
	
		this.#changed = true;
		return true;
	}

	removeShot(shot) {
		if (!this.shots.includes(shot)) {
			return false;
		}

		const index = this.shots.indexOf(shot);
		this.shots.splice(index, 1);

		this.#changed = true;
		return true;
	}

	removeAllShots() {
		const shots = this.shots.slice();

		for (const shot of shots) {
			this.removeShot(shot);
		}
		const shot = new Shot(0,0);
		this.removeShot(shot)
		return shots.length;
	}
    //Случайная расстановка кораблей
	randomize(ShipClass = Ship) {
		this.removeAllShips();

		for (let size = 4; size >= 1; size--) {
			for (let n = 0; n < 5 - size; n++) {
				const direction = getRandomFrom("row", "column");
				const ship = new ShipClass(size, direction);

				while (!ship.placed) {
					const x = getRandomBetween(0, 9);
					const y = getRandomBetween(0, 9);

					this.removeShip(ship);
					this.addShip(ship, x, y);
				}
			}
		}
	}
	//Расстановка "Берега"
	shores(ShipClass = Ship) {
		this.removeAllShips();
		console.log("shores");
		for (let size = 4; size >= 1; size--) {
			for (let n = 0; n < 5 - size; n++) {
				const direction = getRandomFrom("row", "column");
				const ship = new ShipClass(size, direction);

				while (!ship.placed) {
					const x = getRandomBetween(0, 9);
					const y = getRandomBetween(0, 9);
					let ok = true;
					const dx = ship.direction === "row";
					const dy = ship.direction === "column";
					for (let i = 0; i < ship.size; i++) {
						const cy = y + dy * i;
						const cx = x + dx * i;
						//Проверяем, что все корабли больше 1 клетки находятся у берегов
						if (size > 1 && (!this.inField(cx,cy) || !this.inShore(cx,cy))) {
							ok = false;
							break;
						}
						//Проверяем, что однопалубные корабли не на берегах
						if (size === 1 && (!this.inField(cx,cy) || !this.inCenter(cx,cy))) {
							ok = false;
							break;
						}
			
					}
					if (ok) {
						this.removeShip(ship);
						this.addShip(ship, x, y);
					}
				}
			}
		}
	}
	//Расстановка "Диагональ"
	dia(ShipClass = Ship) {
		this.removeAllShips();
		console.log("diagonal");
		for (let size = 4; size >= 1; size--) {
			for (let n = 0; n < 5 - size; n++) {
				const direction = getRandomFrom("row", "column");
				const ship = new ShipClass(size, direction);

				while (!ship.placed) {
					const x = getRandomBetween(0, 9);
					const y = getRandomBetween(0, 9);
					let ok = true;
					const dx = ship.direction === "row";
					const dy = ship.direction === "column";
					for (let i = 0; i < ship.size; i++) {
						const cy = y + dy * i;
						const cx = x + dx * i;
			
						if (!this.inField(cx,cy) || this.inDiagonal(cx,cy)) {
							ok = false;
							break;
						}
			
					}
					if (ok) {
						this.removeShip(ship);
						this.addShip(ship, x, y);
					}
				}
			}
		}
	}

	clear() {
		this.removeAllShots();
		this.removeAllShips();
	}
}