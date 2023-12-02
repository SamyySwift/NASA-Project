const launchesModel = require("./launches.mongo");
const planets = require("./planets.mongo")
const axios = require("axios");

DEFAULT_FLIGHT_NUM = 1;



async function saveLaunch(launch){
    try{
        await launchesModel.findOneAndUpdate({flightNumber: launch.flightNumber},
            launch,
            {
                upsert:true
            })

    }catch(err){
        console.error(err)
    }
  

}

async function populateLaunches(){
    const spacex_api = "https://api.spacexdata.com/v5/launches/query"
    const response = await axios.post(spacex_api, 
        {
            "query":{},
            "options":{
                "pagination": false,
                "populate":[
                    {
                        "path": "rocket",
                        "select":{
                        "name":1
                        }
                    }
                    
                ]
            }
        })

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs){
        const launch = {
            flightNumber: launchDoc["flight_number"],
            mission: launchDoc["name"],
            rocket: launchDoc["rocket"]["name"],
            launchDate: launchDoc["date_local"],
            upcoming: launchDoc["upcoming"],
            success: launchDoc["success"],
        }
        await saveLaunch(launch)


    }
}

async function loadLauchesData(){
    const firstLaunch = await launchExist({flightNumber:1,
    rocket: "Falcon 1",
    mission:"FalconSat"})

    if (firstLaunch){
        console.log("Launch data already loaded")
    }else{
        await populateLaunches();
        
    }
}

async function getLatestFlightNum(){
    const latestLaunch = await launchesModel.findOne()
    .sort("-flightNumber")
    if (!latestLaunch){
        return DEFAULT_FLIGHT_NUM;
    }

    return latestLaunch.flightNumber;
}


async function addNewlaunch(launch){
    const planet = await planets.findOne({kepler_name:launch.target})
    if (!planet){
        throw new Error("no such planet")
    }
    const latestFlightNumber = await getLatestFlightNum() + 1;
    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        upcoming: true,
        success: true,
    })

    await saveLaunch(newLaunch);

}


const launchExist = async (filter)=>{
    return await launchesModel.exists(filter)
}

const abortLaunch = async (launchId)=>{
    const aborted = await launchesModel.updateOne({flightNumber: launchId},{
        upcoming : false,
        success:false
    });
   
    return aborted.modifiedCount === 1;
}



async function getAllLaunches(skip, limit){
    return await launchesModel.find({},{"_id":0, "__v":0})
    .limit(limit)
    .skip(skip);
}


module.exports = {
    getAllLaunches,
    addNewlaunch,
    loadLauchesData,
    launchExist,
    abortLaunch
};