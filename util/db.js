const pg = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const saltRounds = 10;

const pool = new pg.Pool({
	user: "postgres",
	password: process.env.POSTGRESQL_PASSWORD,
	host: "127.0.0.1",
	port: 5432,
	database: "quiz"
});

export async function createUser(name, email, password) {
	const hash = await bcrypt.hash(password, saltRounds);
	const result = await pool.query("INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING user_id, name, email", [name, email, hash]);
	return result.rows[0];
}

export async function doesUserExist(email) {
	const result = await pool.query("SELECT COUNT(1) FROM users WHERE email=$1", [email]);
	return result.rows[0].count === "1" ? true : false;
}

export async function createQuiz(name, question_order_random, visibility) {
	const result = await pool.query("INSERT INTO quizzes(name, question_order_random, visibility) VALUES($1, $2, $3)", [name, question_order_random, visibility]);
	return result;
}

export async function verifyUser(email, password) {
	const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
	if(!result.rows[0]) {
		throw new Error("This user doesn't exist");
	}
	const isUser = await bcrypt.compare(password, result.rows[0].password);
	return isUser ? result.rows[0] : isUser;
}

export async function getUserScores(user_id) {
	const result = await pool.query("SELECT * FROM scores WHERE user_id=$1", [user_id]);
	return result.rows;
}