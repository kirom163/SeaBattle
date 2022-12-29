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


document.addEventListener('DOMContentLoaded', function(){
	console.log('gafg',)/////document.querySelectorAll(".loadx"))
})




function allxc(ert){
	document.querySelectorAll(".loadx").forEach(i=>i.addEventListener("click",event=>{//выбираем все кнопки загрузить и их id
		console.log(event.target.innerText);
		console.log(event.target.id);
		let userCV=JSON.stringify({date:event.target.id});
		let requestCV = new XMLHttpRequest();
		console.log('WHERE MY CHICKEN 0')
		requestCV.open("POST", "/load_battle_ai", true);   
		requestCV.setRequestHeader("Content-Type", "application/json");
		console.log('wat in battle')
		

		const matrix =ert.player.matrix;
		console.log('this is startComputerSave-',matrix.flat().filter((item) => item.ship));
		const withoutShipItems = matrix.flat().filter((item) => item.ship);
		
		let untouchables = [];
		let strategy = 0;
		if (true) {
			strategy = 1;
		} 

		let user=JSON.stringify({awaiter:0});
	let request = new XMLHttpRequest();
	const apper=ert;
	request.open("POST", "/load_battle", true);   
	request.setRequestHeader("Content-Type", "application/json");
	request.addEventListener("load", function () {
		let receivedUser = JSON.parse(request.response);
	apper.start("computer", untouchables, receivedUser.rang_ai,true,receivedUser.ships_ai,receivedUser.shots_ai,receivedUser.ships_pl,receivedUser.shots_pl);
	  }) 
 request.send(user);


		requestCV.addEventListener("load", function () {
//
console.log('WHERE MY CHICKEN');
//startComputerSave();
	//nsole.log('some actions on loadx in prepa',document.body.app);  
///////////////////////////////////////////////////////////
/////////////////////////////////////////////
		})}))}


class PreparationScene extends Scene {
	draggedShip = null;
	draggedOffsetX = 0;
	draggedOffestY = 0;
	removeEventListeners = [];



	

	init() {
		this.manually();
	}

	start() {
		var { player, opponent } = this.app;

		opponent.clear();
		player.removeAllShots();
		player.ships.forEach((ship) => (ship.killed = false));


		document.addEventListener('DOMContentLoaded',allxc(this.app));
			

		this.removeEventListeners = [];
		document.querySelectorAll('.app-menu-text').forEach(element => element.classList.remove('hidden'));
		document.querySelectorAll('.app-actions').forEach(element => element.classList.add('hidden'));
		document.querySelector('[data-scene="preparation"]').classList.remove('hidden');

		//Прячем вражеское поле
		document.querySelector('[data-side="opponent"]').hidden = true;

		const loadButton = document.querySelector('[data-type="load_strat"]');
		const saveButton = document.querySelector('[data-type="save_strat"]');
		const randomizeButton = document.querySelector('[data-action="randomize"]');
		const manuallyButton = document.querySelector('[data-action="manually"]');
		const shoresButton = document.querySelector('[data-action="shores"]');
		const diagonalButton = document.querySelector('[data-action="diagonal"]');
		const simpleButton = document.querySelector('[data-computer="simple"]');
		const middleButton = document.querySelector('[data-computer="middle"]');
		const hardButton = document.querySelector('[data-computer="hard"]');
		const randomButton = document.querySelector('[data-type="random"]');
		const loadBatButton = document.querySelector('[data-type="load_battle"]');//загрузка сохраненной битвы
		const helpButton = document.querySelector('[data-action="helpings"]');//справка правила игры
		const systButton = document.querySelector('[data-action="syst"]');//справка о системе
		

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
		this.removeEventListeners.push(addListener(loadBatButton, "click", () => this.loadMenuBattle()));//загрузка сохраненной битвы
		this.removeEventListeners.push(addListener(helpButton, "click", () => window.open('help')));//справка правила игры
		this.removeEventListeners.push(addListener(systButton, "click", () => window.open('syst')));//справка о системе
		
		console.log('Загрузка.....');
		let user=JSON.stringify(this.app.player.matrix);
		let request = new XMLHttpRequest();
		request.open("GET", "/loados_x", true);   
		request.setRequestHeader("Content-Type", "application/json");
		request.addEventListener("load", function () {
			console.log('valor',request.response)
			let receivedUser = JSON.parse(request.response);
			if(receivedUser.isRas){
			if(receivedUser)
			console.log('xccccccccccccccddddddddddddddddddddddcccccccccccccccccccdddddd',receivedUser);
			player.shots=receivedUser.shots;
			player.matrix=receivedUser.battlefield;
			player.randomize1(ShipView,receivedUser.ships); //не работает, или работает???????
	
			}
		});
	 request.send(user);
		
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

		// Вращаение
		if (this.draggedShip && mouse.delta) {
			this.draggedShip.toggleDirection();
		}

		if (player.complete) {
			document.querySelector('[data-computer="simple"]').disabled = false;
			document.querySelector('[data-computer="middle"]').disabled = false;
			document.querySelector('[data-computer="hard"]').disabled = false;
			document.querySelector('[data-type="random"]').disabled = false;
			document.querySelector('[data-computer="difficulty"]').disabled = false;
			document.querySelector('[data-type="save_strat"]').disabled = false;
		}
		else {
			document.querySelector('[data-computer="simple"]').disabled = true;
			document.querySelector('[data-computer="middle"]').disabled = true;
			document.querySelector('[data-computer="hard"]').disabled = true;
			document.querySelector('[data-type="random"]').disabled = true;
			document.querySelector('[data-computer="difficulty"]').disabled = true;
			document.querySelector('[data-type="save_strat"]').disabled = true;
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
		request.open("GET", "/loados", true);   
		request.setRequestHeader("Content-Type", "application/json");

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
		console.log('verk-',matrix.flat().filter((item) => item.ship));
		const withoutShipItems = matrix.flat().filter((item) => item.ship);
		
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

		let ships_ai,shots_ai,ships_pl,shots_pl=null;
		this.app.start("computer", untouchables, strategy,false,ships_ai,shots_ai,ships_pl,shots_pl);
	}

	loadMenuBattle(){
	
		

		
    let request = new XMLHttpRequest();
	const apper=this.app;
	let user=JSON.stringify({awaiter:0});
    request.open("POST", "/load_menu_battle", true);   
    request.setRequestHeader("Content-Type", "application/json");
	request.addEventListener("load", function () {
		const requs=JSON.parse(request.response);
		console.log('requs',requs);
		if (requs.isMenuLoadBattle){
			console.log('try to load in client preparation scene load menubatle');
			
		//
		/*/////////////////////////////////////////////необходима прослушка
			document.querySelectorAll(".loadx").forEach(i=>i.addEventListener("click",event=>{//выбираем все кнопки загрузить и их id
				console.log(event.target.innerText);
				console.log(event.target.id);
				let user=JSON.stringify({date:event.target.id});
				let request = new XMLHttpRequest();
				request.open("POST", "/load_battle_ai", true);   
				request.setRequestHeader("Content-Type", "application/json");
				console.log('wat in battle')
				request.addEventListener("load", function () {
			console.log('some actions on loadx in prepa',document.body.app);  
			
//
//
///
//
//
//
//
//
//
//
//startComputerSave();
//
//
//
//
//
//
//}) 
			 request.send(user);
			
			// let buttonVX=document.getElementById('loadNULL').submit;
			//console.log('buttonVX');
		//	 document.getElementById("crack").remove();
			})
			)
			*/
		}
		window.location.href="/index";
	  }) 
 request.send(user);
	}




	tryHard(dat){
		console.log('///////////////////////////////dat',dat);
	}
	/////////////////////////////////////////////////////////////////////
	startComputerSave() {
		const matrix = this.app.player.matrix;
		console.log('this is startComputerSave-',matrix.flat().filter((item) => item.ship));
		const withoutShipItems = matrix.flat().filter((item) => item.ship);
		
		let untouchables = [];
		let strategy = 0;
		if (true) {
			strategy = 1;
		} 

		let user=JSON.stringify({awaiter:0});
    let request = new XMLHttpRequest();
	const apper=this.app;
    request.open("POST", "/load_battle", true);   
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
		let receivedUser = JSON.parse(request.response);
	apper.start("computer", untouchables, receivedUser.rang_ai,true,receivedUser.ships_ai,receivedUser.shots_ai,receivedUser.ships_pl,receivedUser.shots_pl);
      }) 
 request.send(user);
		
	}
}