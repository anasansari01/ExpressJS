import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.mjs";

describe("/api/auth", () => {
  let app;

  beforeAll(() => {
    jest.setTimeout(10000);
    mongoose
      .connect('mongodb://localhost/express_tutorial_test')
      .then(() => console.log("Connected to test Database"))
      .catch((err) => console.log(`Error : ${err}`));
    app = createApp();
  });

  // it("should return 401 when not logged in", async () => {
  //   const response = await request(app).get("/api/auth/status");
  //   console.log(response.statusCode, response.body);
  //   expect(response.statusCode).toBe(401);
  // });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});