import axios from "npm:axios";
import cheerio from "npm:cheerio";
import { mainMenu } from "../../bot/keyboards/index.ts";
import { ShopModel } from "../../server/models.ts";
import { sequelize } from "../../server/db.ts";

const fetchUserDataURL = "https://www.sbazar.cz/api/v1/users/public?shop_url=";

function removeDuplicates(arr: any[]) {
	arr = arr.reduce(
		(r, i) => (!r.some((j) => i.user.id === j.user.id) ? [...r, i] : r),
		[]
	);
	console.log(arr.length);
	return arr;
}
const doPostRequest = async (phone) => {
	const payload = { phoneNumber: phone };
	try {
		let res = await axios.post(
			"https://api.green-api.com/waInstance1101773704/checkWhatsapp/bdf8a829ed094ee5a294ae11e3bcfd80aaaf2f2e2118491bba",
			payload
		);
		let data = res.data;
		return data.existsWhatsapp;
	} catch (error) {}
};

const linksCreator = (urls: string[], count) => {
	const reconstructedLinks: string[] = [];
	for (let index = 0; index < urls.length; index++) {
		const category = urls[index];
		reconstructedLinks.push(
			`https://www.sbazar.cz/api/v1/items/search?offset=${
				200 * count
			}&category_id=${category}&limit=${200}&timestamp_to=${Math.floor(
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

const addShop = async (id, ctx) => {
	let shopId = id.toString();
	const shopik = await ShopModel.findOne({ where: { shopId: shopId } });
	const qq = [ctx.chat.id.toString()];
	try {
		if (shopik) {
			shopik.count += 1;
			shopik.shown = shopik.shown.concat(qq);
			await shopik.save();
		} else {
			await ShopModel.create({ shopId, shown: qq });
		}
	} catch (err) {
		console.error(err);
	}
};
// about  запрос данных о продаце
const fetchUserDate = async (shop_url) => {
	try {
		const { data } = await axios.get(`${fetchUserDataURL}${shop_url}`);
		return data.results[0].ubox_created_date;
	} catch (error) {
		console.log(error, "fetchUserDate");
	}
};

const fetchItems = async (urls, count) => {
	const fetchingLinks = linksCreator(urls, count);
	let items = [];
	try {
		for (let index = 0; index < fetchingLinks.length; index++) {
			const { data } = await axios.get(fetchingLinks[index]);
			items = items.concat(data.results);
		}
		return items;
	} catch (error) {
		console.log(error, "fetchItems");
	}
};

const fetchSearched = async () => {
	await sequelize.authenticate();
	await sequelize.sync();
	try {
		const searchedItems = await ShopModel.findAll({ raw: true });
		return searchedItems;
	} catch (error) {
		console.log(error, "fetchSearched");
	}
};

const parsePhone = async (url: string) => {
	const res = await fetch(url);
	const html = await res.text();
	const $ = cheerio.load(html);
	const number = $("a.c-seller-card__contact-phone").text().replace(/ /g, "");

	if (number === "") {
		return null;
	} else {
		const wa = await doPostRequest(number);
		const phone = { wa: Boolean(wa), number: number };
		return phone;
	}
};

const getOutput = async (tmpItems, searchedItems, values, ctx) => {
	let filteredItems = removeDuplicates(
		tmpItems.filter((obj) => {
			return (
				obj.user?.user_service &&
				Date.parse(obj.create_date) / 1000 >=
					Math.floor(Date.now() / 1000) - 86400 * values.daysAgo
			);
		})
	);
	filteredItems = filteredItems.filter((element) => {
		const isMatched = searchedItems.some((searchedItem) => {
			return (
				element.user?.id == searchedItem.shopId &&
				(searchedItem.count > 3 ||
					searchedItem.shown.includes(ctx.chat.id.toString()))
			);
		});
		return !isMatched;
	});
	
	const items = await Promise.all(
		filteredItems.map(async (item) => {
			const phone = await parsePhone(
				`https://www.sbazar.cz/${item.user.user_service.shop_url}/detail/${item.seo_name}`
			);
			const count = await countUserItems(item.user.id);
			const year = await fetchUserDate(item.user.user_service.shop_url);
			if (
				count > values.productsCount ||
				Date.parse(year) / 1000 <=
					Math.floor(Date.now() / 1000) - 31556926 * values.year
			) {
				return null;
			} else {
				await addShop(item.user.id, ctx);
				try {
					await ctx.replyWithPhoto(
						`${
							item.images[0]?.url === ""
								? "https://grammy.dev/Y.png"
								: `http:${item.images[0]?.url}?fl=exf%7Cres,1024,768,1%7Cwrm,/watermark/sbazar.png,10,10%7Cjpg,80,,1`
						}`,
						{
							caption: `${
								!ctx.session.showTitle
									? ""
									: `✍️ Название: <code>${item.name}</code>`
							}
          ${!ctx.session.showPrice ? "" : `💵 Цена: ${item.price} Kč`}
          ${
						!ctx.session.showOwnerName
							? ""
							: `👨 Продавец: <code>${item.user.user_service.shop_url}</code>`
					}
          <a href=\"https://www.sbazar.cz/${
						item.user.user_service.shop_url
					}/detail/${item.seo_name}\">📌 Ссылка на объявление </a>
          📞 Номер: <code>${phone?.number ? phone.number : "номера нет"}</code>
          ☎️ Перейти в WhatsApp: ${
						phone?.wa
							? `<a href=\"https://wa.me/${phone.number}\">WhatsApp</a>`
							: "WA нет"
					}
          🗂 Количество товаров: ${count}
          📅 Дата публикации: ${item.create_date}
          📅 Дата регистрации: ${year}
          Показано: ${
						searchedItems.filter((el) => el.shopId == item.user.id)[0]?.count ||
						0
					} раз(а)
          `,
							disable_web_page_preview: true,
							parse_mode: "HTML",
						}
					);
					return item;
				} catch (error) {
					console.log("photo eblan", error);
					return null;
				}
				// }
			}
		})
	);

	return items.filter((item) => item !== null);
};

export const parse = async (ctx, values, urls) => {
	await ctx.reply("🔍");
	let searchedItems = [];
	let items: any = [];
	let tmpItems: any = [];
	let count = 0;

	while (items.length < Number(values.count) && count < 48) {
		console.log(count, "count");
		searchedItems = await fetchSearched();
		tmpItems = await fetchItems(urls, count);
		items = items.concat(await getOutput(tmpItems, searchedItems, values, ctx));
		count += 1;
	}
	if (count > 48)
		return ctx.reply("*Поиск завершен, недостаточно товаров в категории*", {
			reply_markup: mainMenu,
		});
	else
		return ctx.reply("*Поиск завершен*", {
			reply_markup: mainMenu,
		});
};
