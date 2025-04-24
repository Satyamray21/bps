import manageStation from "../model/manageStation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Station
const createManageStation = asyncHandler(async (req, res) => {
    const { stationName, contact, emailId, address, state, city, pincode } = req.body;

    if ([stationName, contact, emailId, address, state, city, pincode].some(field => typeof field === 'string' && field.trim() === "")) {
        throw new ApiError(400, "All fields are compulsory");
    }

    const existedStation = await manageStation.findOne({
        $or: [{ stationName }, { emailId }]
    });

    if (existedStation) {
        throw new ApiError(401, "Please provide unique email and stationName");
    }

    const station = await manageStation.create({
        stationName,
        emailId,
        contact,
        address,
        state,
        city,
        pincode
    });

    const createdStation = await manageStation.findById(station._id);
    if (!createdStation) {
        throw new ApiError(402, "Something went wrong, Please try again");
    }

    return res.status(200).json(
        new ApiResponse(201, "Station created Successfully", createdStation)
    );
});

// Get All Stations
const getAllStations = asyncHandler(async (req, res) => {
    const stations = await manageStation.find().select("stationId stationName contact");

    const formattedStations = stations.map((station, index) => ({
        sNo: index + 1,
        stationId: station.stationId,
        stationName: station.stationName,
        contactNumber: station.contact
    }));

    res.status(200).json(new ApiResponse(200, "Stations fetched successfully", formattedStations));
});

// Update Station
const updateStation = asyncHandler(async (req, res) => {
    const stationId = req.params.id;

    const updatedStation = await manageStation.findByIdAndUpdate(
        stationId,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedStation) {
        throw new ApiError(404, "Station not found");
    }

    return res.status(200).json(new ApiResponse(200, "Station updated successfully", updatedStation));
});

// Delete Station
const deleteStation = asyncHandler(async (req, res) => {
    const stationId = req.params.id;

    const deletedStation = await manageStation.findByIdAndDelete(stationId);

    if (!deletedStation) {
        throw new ApiError(404, "Station not found");
    }

    return res.status(200).json(new ApiResponse(200, "Station deleted successfully"));
});

export { createManageStation, getAllStations, updateStation, deleteStation };
