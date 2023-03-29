const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Keyv = require('keyv');
require('dotenv').config()

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_URL = process.env.DB_URL
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME

const postgres_url = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_URL}:${DB_PORT}/${DB_NAME}`

const sheets = new Keyv(postgres_url, { table: 'sheets' });
sheets.on('error', err => console.error('Keyv connection error:', err));

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

    let attachment_url = attachment.url;

    let file = await fetchData(attachment_url);
    if (file == null){
        return `There was a problem fetching the file`
    }

    await sheets.set(user_id, file);
    return `Sheet saved successfully`

}

module.exports.importSheetFromJSON = importSheetFromJSON