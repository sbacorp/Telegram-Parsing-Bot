export interface SessionData {
	userId: string;
	userBalance: Number;
	showOwnerName: boolean;
	showPrice: boolean;
	showTitle: boolean;
	onlyWithPhone: boolean;
	onlyWithWA: boolean;
	countOutput: Number;
	step: "idle" | "countMaxAds" | "registrationDate" | "publishDate";
	countMaxAds?: Number;
	registrationDate?: Number;
	publishDate?: Number;
	
}
