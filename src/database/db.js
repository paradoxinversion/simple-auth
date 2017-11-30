const db = require("./client.js").db;
const crypt = require("./crypt.js");

/**
 * This function checks the database for a for a user and returns them or null.
 * @async
 * @param {string} userName a username to check the database for.
 * @returns {Object} The user record if it exists, null if no user is found with userName
 */
const getUserByName = async function getUser(userName){
  const user = await db.oneOrNone('SELECT * FROM users WHERE name = $1', [userName]);
  return user;
};

/**
 * This function checks the database for a for a user and returns them or null.
 * @async
 * @param {string} userName a username to check the database for.
 * @returns {Object} The user record if it exists, null if no user is found with userName
 */
const getUserById = async function getUserById(userId){
  const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [userId]);
  return user;
};

/**
 * This function adds a new user to the database.
 * @async
 * @param {string} plainText a plaintext password.
 * @returns {string} that password, encrypted.
 */
const addUser = async function addUser(username, password){
  const sql = 'INSERT INTO users(name, password) VALUES ($1, $2) RETURNING *';
  return await db.task("add-user-task", async t => {
    try {
      const user = await t.oneOrNone('SELECT id FROM users WHERE name = $1', [username]);
      if (user){
        const userExistsError = new Error("User Already Exists");
        userExistsError.code = 409;
        throw userExistsError;
      }else{
        return user || t.one(sql, [username, await crypt.hashPassword(password)]);
      }
    } catch(e){
      throw e;
    }
  });
};

/**
 * This function compares a provided plaintext password against the hashed one associate with the user account.
 * @async
 * @param {Object} user a plaintext password.
 * @param {string} password a plaintext password.
 * @returns {string} that password, encrypted.
 */
const checkPassword = async function checkPassword(user, password){
  const result = await crypt.comparePassword(password, user.password);
  return result;
};

module.exports = {
  getUserByName,
  getUserById,
  addUser,
  checkPassword
};
