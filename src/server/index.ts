import express from 'express';
import { api } from './api';
import { sse } from './sse';
import puppeteer from 'puppeteer';

const app = express();
app.use(api);
app.use(sse);
let i = 0;
app.get('/api/test', async (req, res) => {
    let num = 10;
    if (req.query?.items)
        num = +req.query.items;
    for (let index = 0; index < num; index++) {
        i++;
        const browser = await puppeteer.launch();
        for (let index = 0; index < 5; index++) {
            const page = await browser.newPage();
            page.goto('https://mighty-tor-87921.herokuapp.com/', { waitUntil: 'networkidle2' });
        }
        console.log(i);

    }
    res.send("started " + i);
});
import path from 'path';
app.use(express.static(path.join(__dirname, '../')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'index.html'));
});

(async () => {


})();


app.listen(process.env["PORT"] || 3002, () => console.log("Server started"));


