const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanetsData } = require("../../models/planets.models")


describe("Test Launhes API", ()=>{
    beforeAll(async()=>{
        await mongoConnect();
        await loadPlanetsData();
    })

    afterAll(async()=>{
        await mongoDisconnect();
    })


    describe("Test Get", ()=>{
        test("It should return 200 status code", async ()=>{
         const res = await request(app)
         .get("/v1/launches?page=1&limit=5")
         .expect(200);
        }, 10000);
     })
     
     
     describe("Test POST /launch", ()=>{
     
         const completeData =  {
             "mission":"ZTM166",
             "rocket":"Explorer 8",
             "target": "Kepler-1652 b",
             "launchDate":"December 21, 2023"
         }
     
         dataWithoutDate =  {
             "mission":"ZTM166",
             "rocket":"Explorer 8",
             "target": "Kepler-1652 b",
         }
     
         test("It should respond to 201 created", async ()=>{
             const response = await request(app).post("/v1/launches")
             .send(
                 completeData)
             .expect(201);
     
             const requestDate = new Date(completeData.launchDate).valueOf();
             const responseDate = new Date(response.body.launchDate).valueOf();
     
             expect(responseDate).toBe(requestDate);
     
             expect(response.body).toMatchObject(
                 dataWithoutDate
             )
         })
     
         test("It should check for missing fields", async ()=>{
     
         const response = await request(app).post("/v1/launches")
             .send(
                 dataWithoutDate)
             .expect(400);
     
         expect(response.body).toStrictEqual({error:"Missing required field"})
         })
     
     })
})

