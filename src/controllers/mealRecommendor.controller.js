import axios from "axios";

const searchRecipesForMeal = async (meal, reqBody) => {
    const { calories, protein, carbs, fat } = meal;

    // console.log(calories)

    const requestData = {
        energyMin: Math.max(0, parseInt(calories)),
        energyMax: 0,
        carbohydratesMin: Math.max(0, parseInt(carbs)),
        carbohydratesMax: 0,
        fatMin: Math.max(0, parseInt(fat)),
        fatMax: 0,
        proteinMin: Math.max(0, parseInt(protein)),
        proteinMax: 0
    };

    console.log(JSON.stringify(requestData))

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://cosylab.iiitd.edu.in/recipe-search/recipesAdvanced?page=1&pageSize=8',
        headers: {
            'Content-Type': 'application/json',
            'x-API-key': process.env.X_API_KEY
        },
        data: requestData
    };

    try {
        const response = await axios(config);
        console.log(response.data.payload.data) ;
        return response.data.payload.data;
    } catch (error) {
        console.error("Error fetching search results for", meal, ":", error);
        throw new Error("Failed to fetch search results");
    }
};

const searchRecipes = async (req, res) => {
    const searchParams = req.body;
    // console.log(req.body);

    // Destructure meals from the request body
    const { breakfast, lunch, dinner } = searchParams;
    
    try {
        // Fetch recipes for breakfast, lunch, and dinner
        const breakfastData = await searchRecipesForMeal(breakfast, searchParams);
        const lunchData = await searchRecipesForMeal(lunch, searchParams);
        const dinnerData = await searchRecipesForMeal(dinner, searchParams);

        // Combine all the data
        const combinedData = {
            breakfast: breakfastData,
            lunch: lunchData,
            dinner: dinnerData
        };

        // Return the combined response
        // console.log(combinedData);
        return res.status(200).json({
            message: "Search results retrieved successfully",
            data: combinedData
        });
    } catch (error) {
        console.error("Error fetching search results:", error);
        return res.status(500).send("Failed to fetch search results");
    }
};

export default searchRecipes;
