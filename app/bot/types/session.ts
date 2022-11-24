export interface SessionData {
	userId: string;
	userBalance: Number;
		showPhoto: boolean;
		showOwnerName: boolean;
		showPrice: boolean;
		showLocation: boolean;
		showDesc: boolean;
		showTitle: boolean;
		onlyWithPhone:boolean;
		onlyWithWA:boolean;
		countOutput:Number;
		step: "idle" | "countMaxAds" | "registrationDate" | "publishDate";
		countMaxAds?: Number;
		registrationDate?: Number; 
		publishDate?:Number;
}