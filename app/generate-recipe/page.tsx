'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';

// this file needs a lot of help...

type Tag = {
  id: number;
  name: string;
};

type Ingredient = {
  id: number;
  name: string;
};

type CookingMethod = {
  id: number;
  name: string;
};

type RecipeStep = {
  ingredient: string;
  method: string;
  step: string;
};

export default function GenerateRecipePage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [cookingMethods, setCookingMethods] = useState<CookingMethod[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [numSteps, setNumSteps] = useState<number>(3); // Default to 3 steps
  const [generatedRecipe, setGeneratedRecipe] = useState<RecipeStep[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: tagsData } = await supabase.from('tags').select('*');
        const { data: ingredientsData } = await supabase.from('ingredients').select('*');
        const { data: methodsData } = await supabase.from('cooking_methods').select('*');
        
        // unable to set why???
        setTags(tagsData);
        setIngredients(ingredientsData);
        setCookingMethods(methodsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleGenerateRecipe = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTags.length < 2 || selectedTags.length > 5) {
      alert('Please select 2-5 tags.');
      return;
    }

    const recipeSteps: RecipeStep[] = [];
    
    // gen steps
    for (let i = 0; i < numSteps; i++) {
      const randomIngredient = ingredients[i % ingredients.length];
      const randomMethod = cookingMethods[i % cookingMethods.length];
      const step = `Step ${i + 1}: Use ${randomIngredient.name} and apply the method: ${randomMethod.name}`;

      recipeSteps.push({
        ingredient: randomIngredient.name,
        method: randomMethod.name,
        step,
      });
    }

    setGeneratedRecipe(recipeSteps);
  };

  return (
    <div>
      <h1>Generate Recipe</h1>
      
      <form onSubmit={handleGenerateRecipe}>
        <div>
          <label htmlFor="tags">Select Tags (2-5)(Ctrl click to select multiple):</label>
          <select
            id="tags"
            multiple
            value={selectedTags}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
              setSelectedTags(selected);
            }}
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="numSteps">Number of Steps:</label>
          <input
            type="number"
            id="numSteps"
            min="1"
            max="10"
            value={numSteps}
            onChange={(e) => setNumSteps(Number(e.target.value))}
          />
        </div>

        <button type="submit">Generate Recipe</button>
      </form>

      {generatedRecipe.length > 0 && (
        <div className="generated-recipe">
          <h2>Generated Recipe</h2>
          <ol>
            {generatedRecipe.map((step, index) => (
              <li key={index}>{step.step}</li>
            ))}
          </ol>
        </div>
      )}
      
      <style jsx>{`
        .generated-recipe ol {
          list-style: decimal;
          padding-left: 20px;
        }
        .generated-recipe {
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}
