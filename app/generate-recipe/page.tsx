'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Tag {
  id: number;
  name: string;
}

const GenerateRecipePage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [generatedSteps, setGeneratedSteps] = useState<string[]>([]);
  const { register, handleSubmit, watch, reset } = useForm();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch('/api/tags');
        const contentType = response.headers.get('Content-Type');

        if (response.ok && contentType?.includes('application/json')) {
          const data = await response.json();
          setTags(data);
        } else {
          const errorText = await response.text();
          console.error('Error: Expected JSON, but got:', errorText);
          // setError('Failed to fetch tags');
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
        // setError('Failed to fetch tags');
      }
    }
    fetchTags();
  }, []);

  const onSubmit = async (data: any) => {
    const { selectedTags, stepsCount } = data;

    // Generate recipe steps
    const generated = Array.from({ length: stepsCount }, (_, i) => {
      const randomTag = tags.find(tag => selectedTags.includes(tag.id.toString()))?.name || 'Unknown';
      return `Step ${i + 1}: Use something ${randomTag.toLowerCase()} here!`;
    });

    setGeneratedSteps(generated);
  };

  const saveRecipe = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('image', data.image[0]);
      formData.append('steps', JSON.stringify(generatedSteps));
      formData.append('tags', JSON.stringify(data.selectedTags));

      const res = await fetch('/api/recipes', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Recipe saved successfully!');
        reset();
        setGeneratedSteps([]);
      } else {
        alert('Failed to save the recipe.');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <div className="generate-recipe-page">
      <h1>Generate Recipe</h1>

      {/* Recipe Generation Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="tags">Select Tags:</label>
          <select
            id="tags"
            multiple
            {...register('selectedTags', { required: true })}
            className="tags-dropdown"
          >
            {tags.map(tag => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="stepsCount">Number of Steps:</label>
          <input
            id="stepsCount"
            type="number"
            {...register('stepsCount', { required: true, min: 1, max: 10 })}
            className="steps-input"
          />
        </div>

        <button type="submit" className="generate-button">
          Generate Recipe
        </button>
      </form>

      {/* Generated Recipe Display */}
      {generatedSteps.length > 0 && (
        <div className="generated-recipe">
          <h2>Generated Recipe Steps:</h2>
          <ol>
            {generatedSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>

          {/* Recipe Save Form */}
          <form onSubmit={handleSubmit(saveRecipe)}>
            <div>
              <label htmlFor="recipeName">Recipe Name:</label>
              <input
                id="recipeName"
                type="text"
                {...register('name', { required: true })}
                className="name-input"
              />
            </div>

            <div>
              <label htmlFor="recipeImage">Upload Recipe Image:</label>
              <input
                id="recipeImage"
                type="file"
                {...register('image', { required: true })}
                className="image-input"
              />
            </div>

            <button type="submit" className="save-button">
              Save Recipe
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GenerateRecipePage;
