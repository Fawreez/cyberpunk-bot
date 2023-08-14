const { EmbedBuilder } = require("@discordjs/builders")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const Keyv = require('keyv');
const { v4: uuidv4 } = require('uuid');
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
 * @param {JSON} theSheet the JSON that contains the character's statistics
 * @returns {sheet} Embed object that will be displayed in discord
 */
function characterSheet(theSheet) {
    const skills = skillSorter(theSheet)
    const characterSheet = new EmbedBuilder()
            .setColor(0xad0303)
            .setTitle(theSheet.name)
            .setDescription(
                `**Role:** ${theSheet.role}
                **HP:** ${theSheet.current_hp} / ${theSheet.base_hp}
                **INTL:** ${theSheet.stats.int} **REFX:** ${theSheet.stats.ref}
                **DEXT:** ${theSheet.stats.dex} **TECH:** ${theSheet.stats.tech}
                **COOL:** ${theSheet.stats.cool} **WILL:** ${theSheet.stats.will}
                **LUCK:** ${theSheet.stats.base_luck} **MOVE:** ${theSheet.stats.move}
                **BODY:** ${theSheet.stats.body} **EMPT:** ${theSheet.stats.base_emp}
                `
            )
            .addFields({name: "Skills", value: skills})

    return characterSheet
}

async function fetchData(url) {
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
  
  let file = await fetchData(attachment_url);
  if (file == null) {
    return `There was a problem fetching the file`
  }
  
  // Generate random sheet_id
  sheet_id = uuidv4();

  // Check if user already exist in Users table
  isUserExist = await users.has(user_id)
  if (!isUserExist) {

    // Create new user data
    user_data = {
      "active_sheet": sheet_id,
      "all_sheets": [sheet_id]
    };
    await users.set(user_id, user_data);
  }
  else {

    // Update existing user data
    user_data = await users.get(user_id)
    user_data.all_sheets.push(sheet_id)
    await users.set(user_id, user_data)
  }

  // Store sheet into Sheets table
  await sheets.set(user_id, file);
  return `Sheet saved successfully`

}

module.exports.importSheetFromJSON = importSheetFromJSON
module.exports.characterSheet = characterSheet 