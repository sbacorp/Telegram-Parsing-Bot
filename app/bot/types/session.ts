export interface SessionData {
	userId: string;
	userBalance: Number;
	log: {
		showPhoto: boolean;
		showOwnerName: boolean;
		showPrice: boolean;
		showLocation: boolean;
		showDesc: boolean;
		showTitle: boolean;
	};
	filters: {
		showPublishTimeF: boolean;
		showRegistrationDateF: boolean;
		showViewsF: boolean;
		showCountItemsF: boolean;
	};
}
