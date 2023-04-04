import bodyParser from "body-parser";
import express from "express";
import methodOverride from "method-override";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import * as dotenv from "dotenv";

import { connectDB } from "./config/db/index.js";
import route from "./routes/index.js";

const app = express();
const port = 4000;

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());

app.use(methodOverride("_method"));

// Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
