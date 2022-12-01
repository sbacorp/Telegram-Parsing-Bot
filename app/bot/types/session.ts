export interface SessionData {
	showOwnerName: boolean;
	showPrice: boolean;
	showTitle: boolean;
	onlyWithPhone: boolean;
	onlyWithWA: boolean;
	subActive: boolean;
	countOutput: Number;
	sbazarStep:
		| "idle"
		| "promo"
		| "sub"
		| "countMaxAds"
		| "registrationDate"
		| "publishDate"
		| "getUrls"
		| "startingSbazar";
	subOneDays: Number;
	subThreeDays: Number;
	subSevenDays: Number;
	subMonth: Number;
	countMaxAds?: Number;
	registrationDate?: Number;
	publishDate?: Number;
	urls?: String[];
}
