const fs = require("fs");
const crypto = require('crypto')

const dbFile = "./chat.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;

    try {
      if (!exists) {
        await db.run(
            `CREATE TABLE user(
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT,
                password TEXT
            );`
        );

        await db.run(
          `INSERT INTO user (login, password) VALUES 
          ('admin', 'admin'), 
          ('JavaScript', 'banana'), 
          ('user1', 'password1');`
        );

        await db.run(
            `CREATE TABLE message(
                msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT,
                author INTEGER,
                FOREIGN KEY(author) REFERENCES user(user_id)
            );`
        );
      } else {
        console.log(await db.all("SELECT * from user"));
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });


module.exports = {
  getMessages: async () => {
    try {
      return await db.all(
        `SELECT msg_id, content, login, user_id from message
         JOIN user ON message.author = user.user_id`
        );
    } catch (dbError) {
      console.error(dbError);
    }
  },
  addMessage: async (msg, userId) => {
    await db.run(
      `INSERT INTO message (content, author) VALUES (?, ?)`,
      [msg, userId]
    );
  },


  isUserExists: async (login)=>{
    const candidate = await db.all('SELECT * FROM user WHERE login = ?', [login])
    return !!candidate.length;
  },

  addUser: async (user)=>{
    await db.run(
      `INSERT INTO user (login, password) VALUES (?, ?)`,
    [user.login, user.password]
  );
    
  },
  getAuthToken: async (user)=>{
    const candidate = await db.all('SELECT * FROM user WHERE login = ?', [user.login])
    if(!candidate.length){
      throw 'Wrong login'
    }
    if(candidate[0].password !== user.password){
      throw 'Wrong password'
    }

    return candidate[0].user_id + '.' + candidate[0].login + '.' + crypto.randomBytes(20).toString('hex')
  }

};