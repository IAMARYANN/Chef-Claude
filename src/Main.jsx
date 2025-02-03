import React, { useEffect, useState } from "react";
import IngredientsList from "./components/IngredientsList";
import ClaudeRecipe from "./components/ClaudeRecipe";
import { getRecipeFromMistral } from "./ai"; // Ensure correct import
import SyncLoader from "react-spinners/SyncLoader";

export default function Main() {
    const [ingredients, setIngredients] = useState([]);
    const [recipe, setRecipe] = useState("");
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state

    async function getRecipe() {
         setLoading(true); // Show loader
        try {
            const recipeMarkdown = await getRecipeFromMistral(ingredients);
            setRecipe(recipeMarkdown);
        } catch (error) {
            console.error("Error fetching recipe:", error);
        } finally {
            setLoading(false); // Hide loader
        }

    }

    async function fetchSuggestions(word) {
        if (!word) return;
        try {
            const response = await fetch(`https://api.datamuse.com/sug?s=${word}`);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    }

    function addIngredient(ingredient) {
        if (!ingredient.trim()) return;
        setIngredients(prev => [...prev, ingredient]);
        setQuery("");
        setSuggestions([]);
    }

    return (
        <main>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (query) addIngredient(query);
                }}
                className="add-ingredient-form"
            >
                <div style={{ position: "relative", width: "350px" }}>
                    <input
                        type="text"
                        placeholder="e.g. oregano"
                        aria-label="Add ingredient"
                        name="ingredient"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            fetchSuggestions(e.target.value);
                        }}
                        style={{ width: "100%", height: "38px" }}
                    />
                    {suggestions.length > 0 && (
                        <ul
                            className="suggestions-list"
                            style={{
                                position: "absolute",
                                width: "50%",
                                background: "white",
                                border: "1px solid #ccc",
                                zIndex: 1,
                                listStyle: "none",
                                padding: 0,
                                marginTop: "2px"
                            }}
                        >
                            {suggestions.map((s, index) => (
                                <li
                                    key={index}
                                    onClick={() => addIngredient(s.word)}
                                    style={{ padding: "5px", cursor: "pointer" }}
                                >
                                    {s.word}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button type="submit">Add ingredient</button>
            </form>

            {ingredients.length > 0 && (
                <IngredientsList ingredients={ingredients} getRecipe={getRecipe} />
            )}

            {/* Show Loader When Fetching Recipe */}
            {loading && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <SyncLoader color="#36d7b7" />
                </div>
            )}

            {!loading && recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    );
}
