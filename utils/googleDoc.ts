import fs from "fs/promises";
import fetch from "node-fetch";
import xlsx from "node-xlsx";
import { isValidAddress } from "ethereumjs-util";
import { BigNumberish, ContractTransaction } from "ethers";
import { ethers } from "ethers";
import _ from "lodash";
import { parseEther } from "ethers/lib/utils";
// https://docs.google.com/spreadsheets/d/1Q8M9plybED0wlaqXk5F2MdAZXpl8j0UKqVqNtzIDmMk/edit?usp=sharing

export function googleCookie() {
	return `S=apps-spreadsheets=nvjuRrnAShYSJ1FLiM34HtOSwPm4fA6XWpdBkgHmxlQ; COMPASS=apps-spreadsheets=CjIACWuJVwQbeggIRk4P-vJe02xuiKc1tl5_7ROWdYb9TZgjMTSwLBoPR35YNBi74NsRWRCc4peNBho0AAlriVdLSPiy8TfTsTdqZIlW7JBGnTYC9DQg839nmTnbz4NyVuZtuz1Z0er5_r4_tgoVMg==; ANID=OPT_OUT; OGPC=19022591-2:; HSID=A4GfySYps5WOnKImy; SSID=AtLkRX8_gC4xVo1zF; APISID=RjKPZ9moPcJj6vZt/AOEmu67iJqe5-Dyjb; SAPISID=m_ITS9316hlwGm0B/AKE4h8EP6CO_xkRdh; __Secure-1PAPISID=m_ITS9316hlwGm0B/AKE4h8EP6CO_xkRdh; __Secure-3PAPISID=m_ITS9316hlwGm0B/AKE4h8EP6CO_xkRdh; __Secure-1PSIDCC=AJi4QfHYAa0vs3CYmPI4Sq8to5Ha0VF4DEeozPSutxYys_6pak5uxD5cbs0RdKQQfgK3EjCC; SID=Dgj4-70d7i6tWX93_5Y1viAMBJ9s-LkNJRj7dbA3swGTVj9-N5lKE1zgcCdmz4VKvMgxFA.; __Secure-1PSID=Dgj4-70d7i6tWX93_5Y1viAMBJ9s-LkNJRj7dbA3swGTVj9-xhlemKizoSiGJH8gZRtJ_w.; __Secure-3PSID=Dgj4-70d7i6tWX93_5Y1viAMBJ9s-LkNJRj7dbA3swGTVj9-G9iJFfULcer9ItFwvj1_UA.; SEARCH_SAMESITE=CgQIiJQB; S=maestro=5CgMMxkm-tNg63Kq1BkEHRsOZX0-cxFeO2w2Oq0mI9Q; googtrans=/en/zh-CN; NID=511=V0Z9b_pOx5SDZQta18_596TYxLj2IkW4lEleA6becDr2V-YTY6udezZWBwrC06wM2z4um_xljiYA_iwF0JWgRmTVjMl6_w_4qZ7wUiShFbZjiXZA3seugqChZn4773_3hZfU6r_Zlsq2Prvr_klmVD5eteIlcx06MGMasMJ7ZDYag2Hl2LXQp2av96jZ7n9BYag-9XQZrIC87Lw7WGI8erpb289I0NW227XtLtNBzt_7cmSvnWyG6MwyjQS4ppVE_30mBm5dWwdlLfkHnZe9vDC2goIFLQntvLizqxUWAvNxzzNuztIpC7UNOFilHosrdMGM1qPue587tVYEKchuRGfJrh8kcyQNk24c6F0lEVOa5os6; 1P_JAR=2021-11-30-08; SIDCC=AJi4QfHlq4tYhU8mkB2z6OEZ0EHy7Kr8b4DIfEJcfBIImWtTdnr7EmsOAKoBQcLC8DIV_SGMQXs; __Secure-3PSIDCC=AJi4QfEN_KA89ERCPqmPsO2D6Yo_fUFeCCUSM04jVezh3-3o8p__n-5l8jrFnze5BOQpS6XSpb6q`;
}

export function sheetIdToDownloadUrl(id: string) {
	return `https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx&id=${id}`;
}

export async function parseSheet(
	id: string,
	sheetNameOrIndex: string | number
) {
	const data = await parseGoogleDocById(id);
	let index: number;
	if (typeof sheetNameOrIndex === "string") {
		index = data.findIndex((s) => s.name === sheetNameOrIndex);
	} else {
		index = sheetNameOrIndex;
	}
	if (index === -1) {
		throw new Error(`sheet ${sheetNameOrIndex} not found`);
	}
	const { data: sheetData } = data[index];
	return sheetData as unknown[][];
}

export async function parseAddressSheet(
	id: string,
	sheetNameOrIndex: string | number,
	addressColIndex: number
) {
	const sheetData = await parseSheet(id, sheetNameOrIndex);
	return sheetData
		.map((row) => row[addressColIndex] as string)
		.filter(isValidAddress);
}

export async function downloadGoogleDocById(id: string) {
	return await downloadGoogleDoc(sheetIdToDownloadUrl(id));
}

export async function downloadGoogleDoc(url: string) {
	const buffer = await fetch(url, {
		headers: { cookie: googleCookie() },
		method: "GET",
	}).then((r) => r.buffer());
	return buffer;
}

export async function parseGoogleDocById(id: string) {
	return parseDoc(sheetIdToDownloadUrl(id));
}

export async function parseDoc(url: string) {
	const buffer = await downloadGoogleDoc(url);
	const p = xlsx.parse(buffer, { type: "buffer" });
	return p;
}
export async function airdropByGoogleDoc(
	id: string,
	addrCol: number,
	valueCol: number,
	chunk: number,
	airDropFunc: (
		addrs: string[],
		values: BigNumberish[]
	) => Promise<ContractTransaction>,
	beginChunk = 0
) {
	const p = await parseGoogleDocById(id);
	const { data }: {data: any[][]} = p[0] as any;
	const valid = data
		.filter((r: any[]) => isValidAddress(r[addrCol]))
		.filter((r: any[]) => r[valueCol] > 0)
		.map((r) => ({
			address: r[addrCol] as string,
			value: r[valueCol] as number,
		}));
	const chunked = _.chunk(valid, chunk);

	for (let i = beginChunk; i < chunked.length; i++) {
		const g = chunked[i];
		const addrs = g.map((x) => x.address);
		const values = g.map((x) => parseEther(`${x.value}`));
		const tx = await airDropFunc(addrs, values);
		console.log(`airdrop [${i}] ${tx.hash}`);
	}
}

export function parseSheetByName(buffer: Buffer, sheetName: string) {
	const p = xlsx.parse(buffer, { type: "buffer" });
	const sheet = p.find((x) => x.name === sheetName);
	if (!sheet) {
		throw new Error(`sheet  ${sheetName} not found`);
	}
	const { data } = sheet;
	return data;
}


export async function parseSheetWithType<Item>(
	id: string,
	sheetNameOrIndex: number | string,
	headerCol: number
) {
	const data = await parseSheet(id, sheetNameOrIndex);
	const columns = <string[]>data[headerCol];
	return data.map(
		(r) => <Item>r.reduce((u, v, i) => {
			if (columns[i]) {
			 	(<any>u)[columns[i]] = v;
			}
			return u;
		}, {})
	);
}

export async function parseAllSheet<Item>(id: string, headerCol: number) {
	const data = await parseGoogleDocById(id);
	return data.map((x) => {
		const { data }: {data: any[][]} = x as any;
		const columns = <string[]>data[headerCol];
		return data.map((r: any[]) => {
			return <Item>r.reduce((u, v, i) => {
				if (columns[i]) {
					u[columns[i]] = v;
				}
				return u;
			}, {})
		})
	});

}
