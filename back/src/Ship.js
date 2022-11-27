module.exports = class Ship {
	size = null;
	direction = null;
	killed = false;

	x = null;
	y = null;

	get placed() {
		return this.x !== null && this.y !== null;
	}

	constructor(size, direction) {
		Object.assign(this, {size, direction});
	}
}