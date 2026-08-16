import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import appRouter from "./routes/api/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/avatars", express.static(path.join(__dirname, "public", "avatars")));
app.use("/api", appRouter);

app.use((_, res, __) => {
	res.status(404).json({
		status: "error",
		code: 404,
		message: "Not Found",
		data: "Not found",
	});
});

app.use((err, _, res, __) => {
	console.log(err.stack);
	res.status(500).json({
		status: "fail",
		code: 500,
		message: err.message,
		data: "Internal Server Error",
	});
});

export default app;
