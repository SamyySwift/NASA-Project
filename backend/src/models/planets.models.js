const planets = require("./planets.mongo");
const { parse }  = require("csv-parse");
const fs = require('fs')
const path = require("path")




const HabitablePlanet = []

function isHabitablePlanet(planet){
    return planet["koi_disposition"] === "CONFIRMED" 
    && planet["koi_insol"] > 0.36 && planet["koi_insol"] <1.11
    && planet["koi_prad"] <1.6;

}


function loadPlanetsData(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, "..", "data", "keplar.csv"))
    .pipe(parse({
        columns:true,
        comment: "#"
    }))
    .on("data", (data) =>{
        if (isHabitablePlanet(data)){
            // HabitablePlanet.push(data);
            savePlanet(data);
        }
       
    })
    .on("error", (err) => {
        reject(err);
    })
    .on("end", async () =>{
        const allPlanets = await getAllPlanets()
        console.log(`${allPlanets.length} planets found`)
        resolve();
    })

    })
}

async function savePlanet(planet){

    try{
        await planets.updateOne({kepler_name: planet.kepler_name}, 
            {kepler_name: planet.kepler_name},{
                upsert: true
            })
        
    }catch(err){
        console.error(err)
    }
   

}

async function getAllPlanets(){
    return await planets.find({}, {"_id":0, "__v":0});
}
module.exports = {
    loadPlanetsData,
    getAllPlanets};