'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CookingStepsPage = () => {
  const [cookingSteps, setCookingSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Fetch cooking steps from the API
  const fetchCookingSteps = async () => {
    try {
      const { data } = await axios.get('/api/cooking-steps');
      setCookingSteps(data);
    } catch (error) {
      setError('Error fetching cooking steps');
    }
  };

  // Add a new cooking step
  const handleAddCookingStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStep.trim()) return;

    try {
      await axios.post('/api/cooking-steps', { template: newStep });
      setNewStep('');
      fetchCookingSteps(); // Refresh the list
    } catch (error) {
      setError('Error adding new cooking step');
    }
  };

  useEffect(() => {
    fetchCookingSteps();
  }, []);

  return (
    <div>
      <h1>Cooking Steps</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <h2>Add New Cooking Step</h2>
      <form onSubmit={handleAddCookingStep}>
        <textarea
          placeholder="Enter cooking step template"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      <h2>Existing Cooking Steps</h2>
      <ul>
        {cookingSteps.length > 0 ? (
          cookingSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))
        ) : (
          <p>No cooking steps found</p>
        )}
      </ul>
    </div>
  );
};

export default CookingStepsPage;
