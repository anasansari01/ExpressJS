import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (req, res, next) => {
  const { body, params: { id } } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(404);
  const findUserIdx = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIdx === -1) return res.sendStatus(404);
  req.findUserIdx = findUserIdx;
  next();
}

//MiddleWare
export const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};