export interface SessionData {
	userId: string;
	userBalance: Number;
		showPhoto: boolean;
		showOwnerName: boolean;
		showPrice: boolean;
		showLocation: boolean;
		showDesc: boolean;
		showTitle: boolean;
		showPublishTimeF: boolean;
		showRegistrationDateF: boolean;
		showViewsF: boolean;
		showCountItemsF: boolean;
		step : "1" | "2" | "3";
}
