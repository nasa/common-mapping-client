import Immutable from 'immutable';

export default class Cache {
	constructor(limit) {
		this.limit = limit;
		this.activeMap = Immutable.OrderedMap();
	}

	set(key, value) {
		this.activeMap = this.activeMap.set(key, value);
		if(this.activeMap.size > this.limit) {
			let firstAdded = this.activeMap.keySeq().first();
			this.activeMap = this.activeMap.delete(firstAdded);
		}
	}

	get(key) {
		let value = this.activeMap.get(key) || false;
		if(value) {
			return value;
		}
		return false;
	}
}