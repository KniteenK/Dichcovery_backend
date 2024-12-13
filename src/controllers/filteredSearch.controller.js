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
        continent: selectedContinent || "",
        region: selectedRegion || "",
        subregion: "",
        recipeTitle: searchTerm || "",
        energyMin: energy,
        energyMax: 0,
        carbohydratesMin: carbohydrate,
        ingredientUsed: "",
        ingredientNotUsed: "",
        cookingProcess: "",
        carbohydratesMax: 0,
        proteinMin: protein,
        proteinMax: 0,
        fatMin: fat,
        fatMax: 0,
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
        console.log((response.data));
        return res.status(200).json({
            message: "Search results retrieved successfully",
            data: response.data,
        });
    } catch (error) {
        console.error("Error fetching search results:", error.message);
        return res.status(500).send("Failed to fetch search results");
    }
};

export default searchRecipes;
