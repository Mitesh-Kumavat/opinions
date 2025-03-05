import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URI || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Route Setup.
import authRouter from "./routes/auth.route.js";
import pollRouter from "./routes/poll.route.js"

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/poll", pollRouter);

export { app }
