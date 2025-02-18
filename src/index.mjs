import express from 'express';
import mongoose from 'mongoose';
import { createApp } from './createApp.mjs';

mongoose
  .connect('mongodb://localhost/express_tutorial')
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error : ${err}`));

const app = createApp();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

// client secret = OEXWtMJdq359W00i4pFiIs-2ZlYQqnmk
// client id = 1337374186045444117
// redirect = http://localhost:3000/api/auth/discord/redirect