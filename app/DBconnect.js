var pgp = require("pg-promise")(/*options*/);
require('dotenv').config();

var dbHOST = process.env.DOCKERDB || process.env.SERVERHOST;

const DBconnect = pgp(`postgres://user:passwd@${dbHOST}:5432/db`);

module.exports = DBconnect;