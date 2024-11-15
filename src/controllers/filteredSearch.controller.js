import axios from "axios";

const searchRecipes = async (req, res) => {
    const searchParams = req.body; // Expecting the request body to contain the search parameters

    const {
        continent = "",
        region = "",
        recipeTitle = "",
        // ingredientUsed = "",
        // ingredientNotUsed = "",
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
        recipeTitle,
        // ingredientUsed,
        // ingredientNotUsed,
        cookingProcess,
        utensil,
        energyMin,
        energyMax,
        carbohydratesMin,
        carbohydratesMax,
        fatMin,
        fatMax,
        proteinMin,
        proteinMax
    };

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://cosylab.iiitd.edu.in/recipe-search/recipesAdvanced?page=1&pageSize=10',
        headers: {
            'Content-Type': 'application/json'
        },
        data: requestData
    };

    try {
        const response = await axios(config);
        return res.status(200).json({
            message: "Search results retrieved successfully",
            data: response.data
        });
    } catch (error) {
        console.error("Error fetching search results:", error);
        return res.status(500).send("Failed to fetch search results");
    }
};

export default searchRecipes;
