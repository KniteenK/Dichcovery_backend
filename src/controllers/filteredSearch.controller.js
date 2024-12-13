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
        recipeTitle: searchTerm || "",
        energyMin: energy?.min || 0,
        energyMax: energy?.max || 0,
        carbohydratesMin: carbohydrate?.min || 0,
        carbohydratesMax: carbohydrate?.max || 0,
        proteinMin: protein?.min || 0,
        proteinMax: protein?.max || 0,
        fatMin: fat?.min || 0,
        fatMax: fat?.max || 0,
        vegan,
        prepTime,
    };

    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://cosylab.iiitd.edu.in/recipe-search/recipesAdvanced?page=1&pageSize=10",
        headers: {
            "Content-Type": "application/json",
            "x-API-key": process.env.X_API_KEY,
        },
        data: mapFiltersToSearchParams,
    };

    try {
        const response = await axios(config);
        console.log(response.data);
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
