import React from "react";
import IngredientsList from "./components/IngredientsList";
import ClaudeRecipe from "./components/ClaudeRecipe";
import { getRecipeFromMistral } from "./ai"; // Ensure correct import

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");

    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromMistral(ingredients); // Ensure correct function name
        setRecipe(recipeMarkdown);
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient").trim(); // Trim to remove spaces
        if (!newIngredient) return; // Prevent empty input from being added
        setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
    }

    return (
        <main>
            <form
                onSubmit={(event) => {
                    event.preventDefault(); 
                    const formData = new FormData(event.target);
                    addIngredient(formData);
                    event.target.reset();
                }}
                className="add-ingredient-form"
            >
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button type="submit">Add ingredient</button>
            </form>

            {ingredients.length > 0 && (
                <IngredientsList ingredients={ingredients} getRecipe={getRecipe} />
            )}

            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    );
}
