const Keyv = require('keyv');
require('dotenv').config()

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME

const postgres_url = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

const users = new Keyv(postgres_url, { table: 'users' });
users.on('error', err => console.error('Keyv connection error:', err));

async function fetchUser(user_id){

    // Check if user already exist in Users table
    isUserExist = await users.has(user_id)
    if (!isUserExist) {

        // Create new user data
        user_data = {
            "active_sheet": "",
            "all_sheets": []
        };
    
    }
    else {
        // Fetch existing user data
        user_data = await users.get(user_id);
    }

    return user_data;
}

module.exports.fetchUser = fetchUser