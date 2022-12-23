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

	save_strat(){
		console.log(this.#matrix)
		console.log(JSON.stringify(this.#matrix));
	}

set matrix(matris){
this.#matrix=matris;
//console.log('Suc CHANGED//////////////////////////////////////////////////////////////',this.#matrix)
}
/////////////////////////////////////////////////////////////////////////////////////////////////
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
	
	//расстановка из сохранения расстановок
	randomize1(ShipClass = Ship,shipss) {
//		this.removeAllShips();
//let ship1=shipss;
this.removeAllShips();
//console.log('some ships-',shipss);
			for (const ship of shipss) {
			//	console.log("try to load ship ",ship);
				const direction = ship.direction;
				const shipx = new ShipClass(ship.size, direction);
					const x = ship.x;                   // getRandomBetween(0, 9);
					const y = ship.y;
					this.removeShip(shipx);
					this.addShip(shipx, x, y);
			}
		
	}
	randomize2(ShipClass = Ship,shipss,shotss) {
		//		this.removeAllShips();
		//let ship1=shipss;
		this.removeAllShips();
		//console.log('some ships-',shipss);
					for (const ship of shipss) {
					//	console.log("try to load ship ",ship);
						const direction = ship.direction;
						const shipx = new ShipClass(ship.size, direction);
							const x = ship.x;                   // getRandomBetween(0, 9);
							const y = ship.y;
							this.removeShip(shipx);
							this.addShip(shipx, x, y);
					}
					for (const shoter of shotss){
						const shot = new ShotView(shoter.x,shoter.y);
						const result = this.addShot(shot);
					}
				
			}
	//Расстановка "Берега"
	shores(ShipClass = Ship) {
		let tres=true;
		whiter:while(tres){
		this.removeAllShips();
		console.log("shores");
		let count_2=0;
		let count_g=0;
		let count_f=0;
		outer_block:for (let size = 4; size >= 1; size--) {
			for (let n = 0; n < 5 - size; n++) {
			if(count_g===1){count_g=0;n++;continue;}	
				const direction = getRandomFrom("row", "column");
				let ship = new ShipClass(size, direction);

				
				let a=0;
				let real_x=0;
				let real_y=0;
				let storona=1;
				let real_direction='row';

				let inv=0;

				while (!ship.placed&&a<400) {
					let x = getRandomBetween(0, 9);
					let y = getRandomBetween(0, 9);
					if(a>200){
						size=0;
						n=10;
						console.log('overload=======================================================================================================')
						this.removeAllShips();
						//this.shores();
					//	alert('Произошла небольшая ошибка генерации расстановки, перезапустите расстановку')
						continue whiter;
						
					}
					if (a>800){
						console.log('over 800-----------------------------------------',a);
						//console.log('-------','cx:',cx,'cy:',cy,'x:'+x,'y:'+y,this.inField(cx,cy),this.inShore(cx,cy),ship)
						x=real_x;
						y=real_y;
						if(storona===1||storona===3){real_x++;
							 real_direction='row';
							}
						if(storona===2||storona===4){real_y++;
							 real_direction='column';
							}
							if(storona===4&&real_y===9){break;}
							if(storona===3&&real_x===9){storona=4;real_x=0;real_y=0;real_direction='column';}
						if(storona===1&&real_x===9){storona=2;real_x=9;real_y=0;real_direction='column';}
						if(storona===2&&real_y===9){storona=3;real_x=0;real_y=9;real_direction='row';}
						console.log(ship.direction,real_direction,'x:'+x,'y:'+y)
						
						if(ship.direction!=real_direction){ship.direction=real_direction;inv++;}
						console.log(ship.direction,real_direction,'-new',size)
				
						
						
					}
					let ok = true;
					const dx = ship.direction === "row";
					
					const dy = ship.direction === "column";
					if (a>800){console.log(dx,dy)}
					for (let i = 0; i < ship.size; i++) {
						const cy = y + dy * i;
						const cx = x + dx * i;
						
						
						if(a>800){console.log(ship.size,cx,cy,this.inField(cx,cy),this.inShore(cx,cy),'----',x,y,storona)}
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
					//if(count_g===1){console.log('fetch');n=8;break;}
					a++;
					if (ok) {
						
						if(a>800){count_2++; console.log('tring',x,y,'+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++',count_2);}
						if ((inv==1||inv==3)){if (count_g===0){
							let ship1=new ShipClass(size,ship.direction);
							if(a>800){count_g++; console.log('tring',x,y,'ggggggggggggggggggggggggggggggggggggggggggggggg',count_g)}
						this.removeShip(ship);
						this.removeShip(ship1);
						this.addShip(ship1, x, y);
						if(ship1.placed){n++; break;}
						}else{
							//this.removeShip(ship);
						//	count_g=0;
						//	n++;
						this.removeShip(ship);
							console.log('something doing');
						}
						}else{
							if(a>800){count_f++; console.log('tring',x,y,'ffffffffffffffffffffffffffffffffffffff',count_f)}
							this.removeShip(ship);
						this.addShip(ship, x, y);
					//	if(ship.placed){n++;break;}
						}
					}
				}
				
			}
		}
		tres=false;
		if(count_g>0&&false){
			console.log('overload=======================================================================================================')
			this.shores(ShipClass==Ship);
		}

	}}
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