import mongoose from "mongoose";

const connectDB = async () => {
	const DB_URI = process.env.DB_URI;
	if (!DB_URI) {
		console.error("Error: DB_URI environment variable is not defined.");
		process.exit(1);
	}

	try {
		await mongoose.connect(DB_URI);
		console.log("Database connection successful");
	} catch (error) {
		console.error("Database connection error:", error.message);
		process.exit(1);
	}
};

export default connectDB;