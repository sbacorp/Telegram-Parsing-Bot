import axios from "npm:axios";
import { connection } from "../../supabase.ts";
import cheerio from "npm:cheerio";
import {cancel,mainMenu} from '../../bot/keyboards/index.ts'
/**
 * !consts
 */
// const values = { productsCount: 2, daysAgo: 2, year: 15, count: 10 };
// const regex = /[0-9]+/;
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

const linksCreator = (urls: string[], count) => {
	const reconstructedLinks = [];
	for (let index = 0; index < urls.length; index++) {
		const category = urls[index];
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
	const searchedItems = shopIds.map((obj) => obj.shopId);
	return searchedItems;
};
const parsePhone = async (url: string) => {
	const res = await fetch(url);
	const html = await res.text();
	const $ = cheerio.load(html);
	const number = $("a.c-seller-card__contact-phone").text().replace(/ /g, "");

	if (number === "") {
		return null;
	} else {
		const phone = { wa: Boolean(await doPostRequest(number)), number: number };

		return phone;
	}
};

const getOutput = async (tmpItems, searchedItems, values, ctx) => {
	let items = [];
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
		const phone = await parsePhone(
			`https://www.sbazar.cz/${array[i].user.user_service.shop_url}/detail/${array[i].seo_name}`
		);
		let count = await countUserItems(array[i].user.id);
		let year = await fetchUserDate(array[i].user.user_service.shop_url);
		if (
			count < values.productsCount &&
			Date.parse(year) / 1000 >=
				Math.floor(Date.now() / 1000) - 31556926 * values.year
		) {
			if (ctx.session.onlyWithWA === true) {
				if (phone?.wa) {
					items.push(array[i]);
					searchedItems.push(array[i].user.id);
					await addShop(array[i].user.id);
					await ctx.replyWithPhoto(
						`${
							array[i].images[0]?.url === ""
								? "https://upload.wikimedia.org/wikipedia/ru/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
								: `http:${array[i].images[0]?.url}?fl=exf%7Cres,1024,768,1%7Cwrm,/watermark/sbazar.png,10,10%7Cjpg,80,,1`
						}`,
						{
							caption: `${
								!ctx.session.showTitle
									? ""
									: `✍️ Название :<code>${array[i].name}</code>`
							}
				${!ctx.session.showPrice ? "" : `💵Цена :${array[i].price} Kč`}
				${
					!ctx.session.showOwnerName
						? ""
						: `👨 Продавец: <code>${array[i].user.user_service.shop_url}</code>`
				}
				<a href=\"https://www.sbazar.cz/
				${array[i].user.user_service.shop_url}/detail/
				${array[i].seo_name}\">📌Ссылка на обьявление</a>
				📞️ Номер:<code>${phone?.number ? phone.number : "номера нет"}</code>
				☎️Перейти в WhatsApp : ${
					phone?.wa
						? `<a href=\"https://wa.me/${phone.number}\">WhatsApp</a>`
						: "WA нет"
				}
				🗂Количество товаров :${count}
				📅Дата публикации: ${array[i].create_date}
				📅 Дата регистрации: ${year}`,
							disable_web_page_preview: true,
							parse_mode: "HTML",
						}
					);
				}
			}
			if (ctx.session.onlyWithPhone === true) {
				if (phone?.number != null) {
					items.push(array[i]);
					searchedItems.push(array[i].user.id);
					await addShop(array[i].user.id);
					await ctx.replyWithPhoto(
						`${
							array[i].images[0]?.url === ""
								? "https://upload.wikimedia.org/wikipedia/ru/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
								: `http:${array[i].images[0]?.url}?fl=exf%7Cres,1024,768,1%7Cwrm,/watermark/sbazar.png,10,10%7Cjpg,80,,1`
						}`,
						{
							caption: `${
								!ctx.session.showTitle
									? ""
									: `✍️ Название :<code>${array[i].name}</code>`
							}
				${!ctx.session.showPrice ? "" : `💵Цена :${array[i].price} Kč`}
				${
					!ctx.session.showOwnerName
						? ""
						: `👨 Продавец: <code>${array[i].user.user_service.shop_url}</code>`
				}
				<a href=\"https://www.sbazar.cz/
				${array[i].user.user_service.shop_url}/detail/
				${array[i].seo_name}\">📌Ссылка на обьявление</a>
				📞️ Номер:<code>${phone?.number ? phone.number : "номера нет"}</code>
				☎️Перейти в WhatsApp : ${
					phone?.wa
						? `<a href=\"https://wa.me/${phone.number}\">WhatsApp</a>`
						: "WA нет"
				}
				🗂Количество товаров :${count}
				📅Дата публикации: ${array[i].create_date}
				📅 Дата регистрации: ${year}`,
							disable_web_page_preview: true,
							parse_mode: "HTML",
						}
					);
				}
			} else {
				items.push(array[i]);
				searchedItems.push(array[i].user.id);
				await addShop(array[i].user.id);
				await ctx.replyWithPhoto(
					`${
						array[i].images[0]?.url === ""
							? "https://upload.wikimedia.org/wikipedia/ru/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
							: `http:${array[i].images[0]?.url}?fl=exf%7Cres,1024,768,1%7Cwrm,/watermark/sbazar.png,10,10%7Cjpg,80,,1`
					}`,
					{
						caption: `${
							!ctx.session.showTitle
								? ""
								: `✍️ Название :<code>${array[i].name}</code>`
						}
				${!ctx.session.showPrice ? "" : `💵Цена :${array[i].price} Kč`}
				${
					!ctx.session.showOwnerName
						? ""
						: `👨 Продавец: <code>${array[i].user.user_service.shop_url}</code>`
				}
				<a href=\"https://www.sbazar.cz/
				${array[i].user.user_service.shop_url}/detail/
				${array[i].seo_name}\">📌Ссылка на обьявление</a>
				📞️ Номер:<code>${phone?.number ? phone.number : "номера нет"}</code>
				☎️Перейти в WhatsApp : ${
					phone?.wa
						? `<a href=\"https://wa.me/${phone.number}\">WhatsApp</a>`
						: "WA нет"
				}
				🗂Количество товаров :${count}
				📅Дата публикации: ${array[i].create_date}
				📅 Дата регистрации: ${year}`,
						disable_web_page_preview: true,
						parse_mode: "HTML",
					}
				);
			}
		}
	}

	return items;
};

export const parse = async (ctx, values, urls) => {
	await ctx.reply("🔍", {reply_markup:cancel});
	let searchedItems = [];
	let items = [];
	let tmpItems = [];
	let count = 0;

	while (items.length < Number(values.count)) {
		searchedItems = await fetchSearched();
		tmpItems = await fetchItems(urls, count);
		items = items.concat(await getOutput(tmpItems, searchedItems, values, ctx));
		count += 1;
	}
	if (ctx.msg.text === "отмена") {
		await ctx.reply("Парсинг отменен");
		ctx.session.sbazarStep = "idle";
		return;
	}

	return ctx.reply("*Поиск завершен*",{reply_markup:mainMenu} );

};

async function doPostRequest(phone) {
	let payload = { phoneNumber: phone };
	let res = await axios.post(
		"https://api.green-api.com/waInstance1101773704/checkWhatsapp/bdf8a829ed094ee5a294ae11e3bcfd80aaaf2f2e2118491bba",
		payload
	);
	let data = res.data;
	return data.existsWhatsapp;
}
