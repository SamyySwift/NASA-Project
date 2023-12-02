const {getAllLaunches, addNewlaunch, launchExist, abortLaunch} = require("../../models/launches.models");
const {getPagination} = require("../../services/query")

const httpGetAllLaunches = async(req, res) => {
    const {skip, limit} = getPagination(req.query)
    return res.status(200).json(await getAllLaunches(skip, limit));

}

const httpPostLaunch = async (req, res)=>{
    const newLaunch = req.body;
    if(!newLaunch.mission || !newLaunch.rocket || !newLaunch.launchDate || !newLaunch.target){
        return res.status(400).json({error: "Missing required field"})
    }
    newLaunch.launchDate = new Date(newLaunch.launchDate)
    if (isNaN(newLaunch.launchDate)){
        return res.status(400).json({error:"Invalid date"})
    }
    await addNewlaunch(newLaunch);
    return res.status(201).json(newLaunch);

}

const httpAbortLaunch = async(req, res) => {
    const launchId = Number(req.params.id);
    if(! await launchExist({flightNumber:launchId})){
        return res.status(404).json(`Launch with id: ${launchId} does not exist`)
    }else{
        await abortLaunch(launchId);
        if (!abortLaunch){
            res.status(400).json({"error": "Error while aborting launch!"})
        }
        return res.status(200).json({"Message":"Launch aborted succesfully"});
    }
}


module.exports = {
    httpGetAllLaunches,
    httpPostLaunch,
    httpAbortLaunch
};