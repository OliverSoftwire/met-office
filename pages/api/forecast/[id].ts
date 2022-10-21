import { NextApiRequest, NextApiResponse } from "next";
import { handleErrors } from "lib/server/errorHandler";
import MetOfficeAPI from "lib/server/MetOfficeAPI";

export default handleErrors(async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	console.log("Forecast requested");

	res.setHeader("Cache-Control", "no-cache");

	// From testing it's not possible to create an array of strings for the query param
	// when it's captured from the route itself
	const id = req.query.id as string;

	const location = await MetOfficeAPI.getLocationFromId(id);
	const forecast = await MetOfficeAPI.getLocationForecast(location);

	const dataPoints = forecast.periods
		.map((period) => period.dataPoints.map((dataPoint) => dataPoint.toJSON()))
		.flat();

	res.status(200).json(dataPoints);
});
