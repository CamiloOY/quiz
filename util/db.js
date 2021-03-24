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

export function validateUser(name, email, password) {
	if(name.length < 1 || typeof(name) !== "string") {
		throw new Error("Invalid user data");
	}
}