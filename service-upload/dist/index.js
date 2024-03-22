"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const port = 3001;
const message = `Express listening on port ${port}`;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/deploy", (req, res) => {
    const repoUrl = req.body.repoUrl;
    // eslint-disable-next-line no-console
    console.log("repoUrl", repoUrl);
    res.json({});
});
// eslint-disable-next-line no-console
app.listen(port, () => console.log(message));
