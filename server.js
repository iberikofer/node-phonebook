import app from "./app.js";
import connectDB from "./db.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Server is running. Use my API on port: ${PORT}`);
	});
}

startServer();
