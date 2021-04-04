export interface Travel {
	id: string;
	fill: any;
	description: string;
	dateStart: Date;
	dateEnd: Date;
	/**
	 * @todo: add properties
	 */
}

export class Travel implements Travel {
	constructor() {
		this.id = '';
		this.fill = {};
		this.description = '';
		this.dateStart = new Date();
		this.dateEnd = new Date();
	}
}
