import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as path from 'path';
import * as cors from 'cors';

import { Routes } from './routes';

export class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    // this.api();
  }

  public static bootstrap(): Server {
    return new Server();
  }

  private config(): void {
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 86400000
      }
    }));

    this.app.use(cors({origin: process.env.CLIENT_HOST, credentials: true}));
  }

  private routes(): void {
    let router: express.Router = express.Router();
    Routes.create(router);
    this.app.use('/api', router);
  }
}
