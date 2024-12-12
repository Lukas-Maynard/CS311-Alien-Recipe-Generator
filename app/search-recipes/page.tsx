'use client';
import React, { useState } from 'react';
import { supabase } from '@/supabaseClient';

type Recipe = {
  id: number;
  name: string;
  image: string | null;
  steps: string;
  likes: number;
  tags: string[];
};

export default function SearchRecipesPage() {
  const [query, setQuery] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [results, setResults] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let queryBuilder = supabase.from('recipes').select(`
        id,
        name,
        image,
        steps,
        likes,
        tags (name)
      `);

      if (query.trim()) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`);
      }

      if (tagFilter.trim()) {
        queryBuilder = queryBuilder.contains('tags', [tagFilter]);
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;

      const formattedData = data.map((recipe) => ({
        ...recipe,
        tags: recipe.tags.map((tag) => tag.name),
      }));

      setResults(formattedData);
    } catch (err) {
      console.error('Error searching recipes:', err);
      setError('Failed to search recipes. Please try again.');
    }
  };

  return (
    <div>
      <h1>Search Recipes</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div>
          <label htmlFor="query">Search by Name:</label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Grilled Chicken"
          />
        </div>
        <div>
          <label htmlFor="tagFilter">Filter by Tag:</label>
          <input
            id="tagFilter"
            type="text"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            placeholder="e.g., Spicy"
          />
        </div>
        <button type="submit">Search</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="results">
        {results.length > 0 ? (
          <ul className="recipe-list">
            {results.map((recipe) => (
              <li key={recipe.id} className="recipe-item">
                <h2>{recipe.name}</h2>
                {recipe.image && (
                  // in database im using sample images :)
                  <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                )}
                <p>{recipe.steps}</p>
                <p>
                  Tags: {recipe.tags.join(', ')}
                </p>
                <p>Likes: {recipe.likes}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recipes found. Try another search.</p>
        )}
      </div>
      <style jsx>{`
        .search-form {
          margin-bottom: 2rem;
        }
        .search-form div {
          margin-bottom: 1rem;
        }
        .recipe-list {
          list-style: none;
          padding: 0;
        }
        .recipe-item {
          margin-bottom: 2rem;
          border-bottom: 1px solid #ccc;
          padding-bottom: 1rem;
        }
        .recipe-image {
          max-width: 100%;
          height: auto;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
