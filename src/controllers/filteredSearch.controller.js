import axios from "axios";

const searchRecipes = async (req, res) => {

    const {
        searchTerm,
        selectedContinent,
        selectedRegion,
        energy,
        carbohydrate,
        protein,
        fat,
        prepTime,
        vegan,
    } = req.body;



    const mapFiltersToSearchParams = {
        continent: "",
        region: "",
        subRegion: "",
        recipeTitle: searchTerm,
        ingredientUsed: "",
        ingredientNotUsed: "",
        cookingProcess: "",
        utensil: "",
        energyMin: 0,
        energyMax: 0,
        carbohydratesMin: 0,
        carbohydratesMax: 0,
        fatMin: 0,
        fatMax: 0,
        proteinMin: 0,
        proteinMax: 0
    };

    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://cosylab.iiitd.edu.in/recipe-search/recipesAdvanced?page=1&pageSize=2",
        headers: {
            "x-API-key": process.env.X_API_KEY,
        },
        data: mapFiltersToSearchParams,
    };

    try {
        const response = await axios(config);
        console.log((response.data.payload.data));
        return res.status(200).json({
            message: "Search results retrieved successfully",
            data: response.data.payload.data,
        });
    } catch (error) {
        console.error("Error fetching search results:", error.message);
        return res.status(500).send("Failed to fetch search results");
    }
};

export default searchRecipes;
