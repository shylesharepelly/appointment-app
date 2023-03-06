/* eslint-disable no-undef */
const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
let server, agent;


describe("Appointment App", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => { });
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates an appointment", async () => {
    const agent = request.agent(server);
    const res = await agent.get("/");
    const res1 = await agent.post("/list").send({
      title: "meeting",
      duration:"30",
      start: "4:00 PM"
    });
    
    expect(res1.statusCode).toBe(302);
  });

  test("update an appointment", async () => {
    const agent = request.agent(server);
    const res = await agent.get("/");
    //console.log("res",res)
    const res1 = await agent.put("/list/01").send({
      title: "meeting1",
      
    });
    expect(res1.statusCode).toBe(302);
  });

  test("delete an appointment", async () => {
    const agent = request.agent(server);
    const res = await agent.get("/");
    const res1 = await agent.delete("/list/01").send({
    
    });
    expect(res1.statusCode).toBe(302);
  });



});