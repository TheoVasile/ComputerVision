import express from "express";
import {PORT, mongoDBURL} from "./config.js";
import mongoose from "mongoose";
import imagesRoute from './routes/imagesRoute.js'
import cors from 'cors'

const app = express();

app.use(express.json());

app.use(cors())

app.get('/', (request, response) => {

});

app.use('/images', imagesRoute);


mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening to the port: ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });