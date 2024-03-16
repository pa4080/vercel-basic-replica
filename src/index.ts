import express from "express";
import cors from "cors";

const port = 3001;
const message = `Express listening on port ${port}`;

const app = express();

app.use(cors());

// eslint-disable-next-line no-console
app.listen(port, () => console.log(message));
