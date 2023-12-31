const app = require("./app");
const http = require("http");
const fs = require("fs")
const { mongoConnect } = require("./services/mongo");
const { loadLauchesData } = require("./models/launches.models");
const { loadPlanetsData } = require("./models/planets.models");




const PORT = process.env.PORT || 8000;


const server = http.createServer(
app
    
);



const startServer = async () => {
    await mongoConnect();
    await loadPlanetsData();
    await loadLauchesData();
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    })

}

startServer();