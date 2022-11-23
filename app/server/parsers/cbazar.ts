import axios from "npm:axios";
import { connection } from "../../supabase.ts";
/**
 * !consts
 */
// const values = { productsCount: 2, daysAgo: 2, year: 15, count: 10 };
const regex = /[0-9]+/i;
const urls = [`https://www.sbazar.cz/30-elektro-pocitace`];
const fetchUserDataURL = "https://www.sbazar.cz/api/v1/users/public?shop_url=";
/*
	!about: убираем дубликаты
	*/
function removeDuplicates(arr: any[]) {
	arr = arr.reduce(
		(r, i) => (!r.some((j) => i.user.id === j.user.id) ? [...r, i] : r),
		[]
	);
	return arr;
}

// const parse = async (url:string) => {
// 	try {
// 		const ads:any = [];
// 		for (let index = 1; index < 5; index++) {
// 		const res = await fetch(`${url}/cela-cr/cena-neomezena/nejnovejsi/${index}`);
// 		const html = await res.text();
// 		const $1 = cheerio.load(html);
// 		const linkObjects = $1("a.c-item__link")
// 		linkObjects.each(async(index:Number, element:HTMLElement) => {
//       const res = await fetch($1(element).attr('href'));
// 			const html = await res.text();
// 			const $ = cheerio.load(html);
// 			ads.push({
// 				link:$1(element).attr('href'),
// 				title: $("h1.p-uw-item__header").text(),
// 				price:$("b.c-price__price").text(),
// 				phone:$("a.c-seller-card__contact-phone").text()
// 			})
// 			});
// 		}
// 		console.log(ads)
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
const linksCreator = (urls: string[], count) => {
	const reconstructedLinks = [];
	for (let index = 0; index < urls.length; index++) {
		const category = urls[index].match(regex)?.toString();
		reconstructedLinks.push(
			`https://www.sbazar.cz/api/v1/items/search?offset=${
				100 * count
			}&category_id=${category}&limit=${100}&timestamp_to=${Math.floor(
				Date.now() / 1000
			)}`
		);
	}
	return reconstructedLinks;
};

const countUserItems = async (id) => {
	try {
		const { data } = await axios.get(
			`https://www.sbazar.cz/api/v1/items/search?user_id=${id}`
		);
		return data.pagination.total;
	} catch (error) {
		console.log(error);
	}
};
const addShop = async (id) => {
	let shopId = id;
	let { data: error } = await connection
		.from("shpIds")
		.insert({ shopId })
		.single();
	if (error) console.log("error", error);
};
// about  запрос данных о продаце
const fetchUserDate = async (shop_url) => {
	try {
		const { data } = await axios.get(`${fetchUserDataURL}${shop_url}`);
		return data.results[0].ubox_created_date;
	} catch (error) {}
};

const fetchItems = async (urls, count) => {
	const fetchingLinks = linksCreator(urls, count);
	try {
		for (let index = 0; index < fetchingLinks.length; index++) {
			const { data } = await axios.get(fetchingLinks[index]);
			return data.results;
		}
	} catch (error) {
		console.log(error);
	}
};

const fetchSearched = async () => {
	let { data: shopIds } = await connection.from("shpIds").select("shopId");
	const searchedItems = shopIds.map((obj) => obj.shopId)
	return searchedItems;
};
// fetchItems(urls, count,items)

const getOutput = async (tmpItems,searchedItems, values,ctx) => {
let items=[]
	const array = removeDuplicates(
		tmpItems
			.filter((obj) => {
				return (
					obj.user?.user_service &&
					Date.parse(obj.create_date) / 1000 >=
						Math.floor(Date.now() / 1000) - 86400 * values.daysAgo
				);
			})
			.filter((obj) => !searchedItems.includes(obj?.user?.id))
	);
	for (let i = 0; i < array.length; i++) {
		let count = await countUserItems(array[i].user.id);
		let year = await fetchUserDate(array[i].user.user_service.shop_url);
		if (
			count < values.productsCount &&
			Date.parse(year) / 1000 >=
				Math.floor(Date.now() / 1000) - 31556926 * values.year
		) {
			items.push(array[i]);
			searchedItems.push(array[i].user.id)
			await addShop(array[i].user.id);
			await  ctx.reply(array[i].user.id)
		}
	}

	return items;
};



export const parse = async (ctx, values) => {
	let searchedItems = [];
	let items = [];
	let tmpItems = [];
	let count = 0;
	searchedItems = await fetchSearched();
	while (items.length < Number(values.count)) {
	// console.log(searchedItems, 'searchedItems');
		tmpItems = await fetchItems(urls, count);	
		items = items.concat(await getOutput(tmpItems,searchedItems,values, ctx));
		console.log(items.length);
		count += 1;
	}

};
// parse();
// fetchItems(urls);

console.log("server launched");
