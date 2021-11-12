export default async (req, res, next) => {
	req.body = typeof(req.body) === "string" ? req.body = JSON.parse(req.body) : req.body;
	next();
};