const { EmbedBuilder } = require("@discordjs/builders")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const Keyv = require('keyv');
const { v4: uuidv4 } = require('uuid');
const userWrapper = require('../wrappers/user_wrapper');
require('dotenv').config()

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME

const postgres_url = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

const sheets = new Keyv(postgres_url, { table: 'sheets' });
sheets.on('error', err => console.error('Keyv connection error:', err));

const users = new Keyv(postgres_url, { table: 'users' });
users.on('error', err => console.error('Keyv connection error:', err));

/**
 * Process a sheet json so that only relevant skills to the characters are shown in the embed
 * @param {JSON} sheet the sheet that needs to be sorted
 * @returns {String} Sorted skills to be presented at the Sheet Embed
 */
function skillSorter(sheet) {
		let sortedSkill = ""

		for (const skillCategory in sheet.skill){
				for(const skills in sheet.skill[skillCategory]){
						const skillSpecs = sheet.skill[skillCategory][skills]
						if(skillSpecs.rank > 2){
								sortedSkill += `${skillSpecs.name} : ${skillSpecs.rank} \n`
						}
				}
		}
		return sortedSkill
}

/**
 * Process a sheet json to be displayed in an embed
 * @param {JSON} sheet_data the JSON that contains the character's statistics
 * @returns {sheet} Embed object that will be displayed in discord
 */
function formatCharacterSheet(sheet_data) {
		const skills = skillSorter(sheet_data)
		const characterSheet = new EmbedBuilder()
						.setColor(0xad0303)
						.setTitle(sheet_data.name)
						.setDescription(
								`**Role:** ${sheet_data.role}
								**HP:** ${sheet_data.current_hp} / ${sheet_data.base_hp}
								**INTL:** ${sheet_data.stats.int} **REFX:** ${sheet_data.stats.ref}
								**DEXT:** ${sheet_data.stats.dex} **TECH:** ${sheet_data.stats.tech}
								**COOL:** ${sheet_data.stats.cool} **WILL:** ${sheet_data.stats.will}
								**LUCK:** ${sheet_data.stats.base_luck} **MOVE:** ${sheet_data.stats.move}
								**BODY:** ${sheet_data.stats.body} **EMPT:** ${sheet_data.stats.base_emp}
								`
						)
						.addFields({name: "Skills", value: skills})

		return characterSheet
}

async function fetchFileData(url) {
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function importSheetFromJSON(user_id, attachment) {

	// Fetch attached file from discord url
	if (attachment == null){
		return `No attachment found`
	}
	
	let attachment_url = attachment.url;
	
	let file = await fetchFileData(attachment_url);
	if (file == null) {
		return `There was a problem fetching the file`
	}
	
	// Generate random sheet_id
	sheet_id = uuidv4();

	// Fetch User data from DB
	user_data = await userWrapper.fetchUser(user_id);

	// Update User sheet info
	if (!user_data.active_sheet){
		user_data.active_sheet = sheet_id;
		user_data.all_sheets = [sheet_id];
	}
	else{
		user_data.all_sheets.push(sheet_id);
	}

	await users.set(user_id, user_data);

	// Store sheet into Sheets table
	await sheets.set(sheet_id, file);
	return `Sheet saved successfully`

}

async function fetchSheetFromDB(sheet_id){
	const sheet_data = sheets.get(sheet_id);

	return sheet_data;
}

async function fetchSheet(user_id){
	const user_data = await userWrapper.fetchUser(user_id);
	const sheet_id = user_data.active_sheet
	const sheet_data = await fetchSheetFromDB(sheet_id);

	if(!sheet_data){
		return new EmbedBuilder()
        .setColor(0xad0303)
        .setTitle(`No Character Sheet is found`)
        .setDescription(`No character sheet was found for this user`)
	}
	else{
		return formatCharacterSheet(sheet_data);

	}

}

async function fetchAllSheets(user_id){
	const user_data = await userWrapper.fetchUser(user_id);
	const all_sheets = user_data.all_sheets;
	let character_names = "";
	let result;
	let num = 0;

	if (all_sheets.length <1){
		result = new EmbedBuilder()
					.setColor(0xad0303)
					.setTitle("You have no characters.");

		return result;
	}
	else{
		for (const sheet_id of all_sheets){
			sheet_data = await fetchSheetFromDB(sheet_id);
			let name = sheet_data.name;
			character_names += `${num}. ${name}\n`
			num ++;
		}
	
		result = new EmbedBuilder()
					.setColor(0xad0303)
					.setTitle("Your Characters")
					.addFields({name: " ", value: character_names});
	
		return result;
	}
	
}

module.exports.importSheetFromJSON = importSheetFromJSON
module.exports.characterSheet = formatCharacterSheet
module.exports.fetchSheet = fetchSheet
module.exports.fetchAllSheets = fetchAllSheets