import express from 'express';
import { api } from './api';
import { sse } from './sse';
import puppeteer from 'puppeteer';

const app = express();
app.use(api);
app.use(sse);
let i=0;
app.get('/api/test', async (req, res) => {
    for (let index = 0; index < 100; index++) {
        i++;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.goto('https://mighty-tor-87921.herokuapp.com/', { waitUntil: 'networkidle2' });
        console.log(i);

    }
    res.send("started 300");
});
import path from 'path';
app.use(express.static(path.join(__dirname, '../')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'index.html'));
});

(async () => {


})();


app.listen(process.env["PORT"] || 3002, () => console.log("Server started"));


