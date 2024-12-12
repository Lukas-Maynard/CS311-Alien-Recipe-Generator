"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientName, setIngredientName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const { data, error } = await supabase.from('ingredients').select('name');
        if (error) throw error;
        const ingredientNames = data.map((ingredient) => ingredient.name);
        setIngredients(ingredientNames);
      } catch (err) {
        console.error('Error fetching ingredients:', err);
        setError('Failed to fetch ingredients.');
      }
    };

    fetchIngredients();
  }, []);

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!ingredientName.trim()) {
      setError('Ingredient name cannot be empty.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ingredients')
        .insert([{ name: ingredientName.trim() }]);

      if (error) throw error;

      setIngredients((prev) => [...prev, ingredientName.trim()]);
      setIngredientName('');
      setSuccessMessage('Ingredient added successfully!');
    } catch (err) {
      console.error('Error adding ingredient:', err);
      setError('Failed to add ingredient. Ensure it has a unique name.');
    }
  };

  return (
    <div>
      <h1>Ingredients</h1>

      <form onSubmit={handleAddIngredient} className="ingredient-form">
        <div>
          <label htmlFor="ingredientName">Add New Ingredient:</label>
          <input
            id="ingredientName"
            type="text"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            placeholder="e.g., Chicken"
          />
        </div>
        <button type="submit">Add Ingredient</button>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </form>

      <div className="ingredient-list">
        <h2>Existing Ingredients</h2>
        <ul>
          {ingredients.map((name, index) => (
            <li key={index}>{name}</li>
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
          margin-bottom: 0.5rem;
        }
        .error {
          color: red;
          margin-top: 1rem;
        }
        .success {
          color: green;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
