import { response, Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { checkFilterValidationSchema, checkUsernameValidationSchema } from "../utils/checkValidationSchema.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import session from "express-session";
import passport from "passport";
import { User } from '../mongoose/schemas/user.mjs'
import { hashPassword } from "../utils/helpers.mjs";
import { createUserHandler, getUserByIdHandler } from "../handler/users.mjs";
import '../strategies/local-strategy.mjs'

const router = Router();

// get all the details of the User from the Array.
router.get("/api/users", checkSchema(checkFilterValidationSchema), (req, res) => {
  console.log(req.session.id);
  req.sessionStore.get(req.session.id, (err, sessionData) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(`Inside session stor GET`);
    console.log(sessionData);
  });

  const result = validationResult(req);
  console.log(result);
  // if (!result.isEmpty()) return res.status(404).send({ errors: result.array() })
  const { query: { filter, value } } = req;
  if (filter && value)
    return res.send(
      mockUsers.filter((user) => user[filter].includes(value))
    );
  return res.send(mockUsers);
});

//make changes in the database and put the data of user in it.
// MADE FOR THE ARRAY MANIPULATION FOR DATA.
router.post("/api/users", checkSchema(checkUsernameValidationSchema), (req, res) => {
  const { body } = req;
  const result = validationResult(req);
  // console.log(result);

  if (!result.isEmpty()) return res.status(404).send({ errors: result.array() });
  const data = matchedData(req);
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data }
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});


// Connected to the DATABASE.
router.post('/api/users', checkSchema(checkUsernameValidationSchema), createUserHandler);

// Our Created user authentication
router.post('/api/auth', (req, res) => {
  const { body: {
    username, password
  } } = req;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password) return res.status(200).send({ msg: "Bad Credential" });

  req.session.user = findUser;
  return res.status(200).send(findUser);
})

router.get('/api/auth/status', (req, res) => {
  req.sessionStore.get(req.sessionID, (err, sessionData) => {
    console.log(sessionData);
  });
});


// Passport strategies Authentication:
router.post('/api/auth', passport.authenticate("local"), (req, res) => {
  return res.sendStatus(200);
});

router.get('/api/auth/status', (req, res) => {
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

router.post('/api/auth/logout', (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logOut((err) => {
    if (err) return res.sendStatus(401);
    res.sendStatus(200);
  })
});

router.post('/api/cart', (req, res) => {
  if (!req.session.user) return res.sendStatus(404);
  const { body: item } = req;

  const { cart } = req.session;
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(200).send(item);
});

router.get('/api/cart', (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  return res.send(req.session.cart ?? []);
});

router.get("/api/users/:id", resolveIndexByUserId, getUserByIdHandler);

// update the all data of the specific id with new provided data.
router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIdx } = req;
  mockUsers[findUserIdx] = { id: mockUsers[findUserIdx].id, ...body };
  return res.sendStatus(201);
});

// it make update to a particular  id in the specific value given by the user.
router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIdx } = req;
  mockUsers[findUserIdx] = { ...mockUsers[findUserIdx], ...body };
  return res.sendStatus(200);
});

// it deletes.
router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIdx } = req;
  mockUsers.splice(findUserIdx, 1);
  return res.sendStatus(200);
});

export default router;