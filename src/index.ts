import * as express from 'express';
import Routes from './route/';
import 'reflect-metadata';
import AppDataSource from './data-source';
import { NextFunction, Request, Response } from 'express';

const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

AppDataSource.initialize().then(async () => {
    app.use(Routes);
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(500).send({ error: err.message });
    });
});
app.listen(8000);
console.log(
    'Express server has started on port 8000. Open http://localhost:8000/users to see results'
);
