import express from 'express';
import { api } from './api';
import { sse } from './sse';

const app = express();
app.use(api);
app.use(sse);

import path from 'path';
app.use(express.static(path.join(__dirname, '../')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../', 'index.html'));
});

app.listen(process.env["PORT"] || 3002, () => console.log("Server started"));
