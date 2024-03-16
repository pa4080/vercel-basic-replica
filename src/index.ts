import express from "express";
import cors from "cors";

const port = 3001;
const message = `Express listening on port ${port}`;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/deploy", (req, res) => {
	const repoUrl = req.body.repoUrl;

	// eslint-disable-next-line no-console
	console.log("repoUrl", repoUrl);

	res.json({});
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(message));
