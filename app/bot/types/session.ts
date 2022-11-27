export interface SessionData {
	userId: string;
	userBalance: Number;
	showOwnerName: boolean;
	showPrice: boolean;
	showTitle: boolean;
	onlyWithPhone: boolean;
	onlyWithWA: boolean;
	subActive: boolean;
	countOutput: Number;
	sbazarStep: "idle" |"sub" | "countMaxAds" | "registrationDate" | "publishDate"|"getUrls";
	subOneDays:Number;
	subThreeDays:Number;
	subSevenDays:Number;
	subMonth:Number;
	countMaxAds?: Number;
	registrationDate?: Number;
	publishDate?: Number;
	urls?: String[]
	
}
