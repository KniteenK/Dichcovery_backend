import axios from "axios";

const searchRecipes = async (req, res) => {
    const searchParams = req.body; // Expecting the request body to contain the search parameters

    const {
        continent = "",
        region = "",
        recipeTitle = "",
        cookingProcess = "",
        utensil = "",
        energyMin = 0,
        energyMax = 0,
        carbohydratesMin = 0,
        carbohydratesMax = 0,
        fatMin = 0,
        fatMax = 0,
        proteinMin = 0,
        proteinMax = 0
    } = searchParams;

    const requestData = {
        continent,
        region,
        subregion: "",
        recipeTitle,
        ingredientUsed: "",
        ingredientNotUsed: "",
        cookingProcess,
        utensil,
        energyMin: Math.max(0, energyMin),
        energyMax: Math.max(0, energyMax),
        carbohydratesMin: Math.max(0, carbohydratesMin),
        carbohydratesMax: Math.max(0, carbohydratesMax),
        fatMin: Math.max(0, fatMin),
        fatMax: Math.max(0, fatMax),
        proteinMin: Math.max(0, proteinMin),
        proteinMax: Math.max(0, proteinMax)
    };

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://cosylab.iiitd.edu.in/recipe-search/recipesAdvanced?page=1&pageSize=10',
        headers: {
            'Content-Type': 'application/json',
            'x-API-key': process.env.X_API_KEY
        },
        data: requestData
    };

    try {
        const response = await axios(config);
        console.log(response) ;
        return res.status(200).json({
            message: "Search results retrieved successfully",
            data: response.data
        });
    } catch (error) {
        console.error("Error fetching search results:", error.message);
        return res.status(500).send("Failed to fetch search results");
    }
};

export default searchRecipes;
