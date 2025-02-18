import express from 'express'
import router from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from "passport"
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
// import './strategies/discord-strategy.mjs';
import './strategies/local-strategy.mjs'

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser("helloUsers"));
  app.use(session({
    secret: 'bro code',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient()
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(router);

  app.get('/api/auth/discord', passport.authenticate('discord'));
  app.get('/api/auth/discord/redirect', passport.authenticate('discord'), (req, res) => {
    console.log(req.session)
    console.log(req.user)
    res.sendStatus(200);
  });

  app.get('/hello', (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie("hello", "world", { maxAge: 30000, signed: true });
    res.status(201).send({ msg: "hello, World" });
  });

  return app;
}