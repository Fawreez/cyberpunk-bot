const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Keyv = require('keyv');
require('dotenv').config()

const sheets = new Keyv('postgresql://postgres:admin123@localhost:5432/postgres', { table: 'sheets' });
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