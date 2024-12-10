"use client";
import React, { useState, useEffect } from 'react';

type Tag = {
  id: number;
  name: string;
};

type Ingredient = {
  id: number;
  name: string;
  tags: string[];
};

export default function IngredientsPage() {
  const [ingredientName, setIngredientName] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch existing tags and ingredients
    const fetchData = async () => {
      try {
        const tagsRes = await fetch('/api/tags');
        const ingredientsRes = await fetch('/api/ingredients');
        const tagsData: Tag[] = await tagsRes.json();
        const ingredientsData: Ingredient[] = await ingredientsRes.json();

        setTags(tagsData);
        setIngredients(ingredientsData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ingredientName || selectedTags.length === 0) {
      setError('Ingredient name and at least one tag are required.');
      return;
    }

    try {
      const res = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: ingredientName,
          tagIds: selectedTags,
        }),
      });

      if (res.ok) {
        const newIngredient: Ingredient = await res.json();
        setIngredients((prev) => [...prev, newIngredient]);
        setIngredientName('');
        setSelectedTags([]);
      } else {
        setError('Failed to add ingredient.');
      }
    } catch (err) {
      console.error('Error adding ingredient:', err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div>
      <h1>Ingredients</h1>
      <form onSubmit={handleAddIngredient} className="ingredient-form">
        <div>
          <label htmlFor="ingredientName">Ingredient Name:</label>
          <input
            id="ingredientName"
            type="text"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            placeholder="e.g., Chicken"
          />
        </div>
        <div>
          <label htmlFor="tags">Select Tags:</label>
          <select
            id="tags"
            multiple
            value={selectedTags}
            onChange={(e) =>
              setSelectedTags(
                Array.from(e.target.selectedOptions, (option) =>
                  parseInt(option.value)
                )
              )
            }
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Ingredient</button>
        {error && <p className="error">{error}</p>}
      </form>

      <div className="ingredient-list">
        <h2>Existing Ingredients</h2>
        <ul>
          {ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              <strong>{ingredient.name}</strong> - Tags:{' '}
              {ingredient.tags.join(', ')}
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .ingredient-form {
          margin-bottom: 2rem;
        }
        .ingredient-form div {
          margin-bottom: 1rem;
        }
        .ingredient-list ul {
          list-style: none;
          padding: 0;
        }
        .ingredient-list li {
          margin-bottom: 1rem;
        }
        .error {
          color: red;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
