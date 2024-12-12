'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';

const CookingStepsPage = () => {
  const [cookingSteps, setCookingSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchCookingSteps = async () => {
    setError(null);
    try {
      const { data, error } = await supabase.from('cooking_steps').select('template');
      if (error) throw error;

      const stepTemplates = data.map((step) => step.template);
      setCookingSteps(stepTemplates);
    } catch (err) {
      console.error('Error fetching cooking steps:', err);
      setError('Error fetching cooking steps.');
    }
  };

  const handleAddCookingStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!newStep.trim()) {
      setError('Cooking step template cannot be empty.');
      return;
    }

    try {
      const { error } = await supabase
        .from('cooking_steps')
        .insert([{ template: newStep.trim() }]);

      if (error) throw error;

      setSuccessMessage('Cooking step added successfully!');
      setNewStep('');
      fetchCookingSteps();
    } catch (err) {
      console.error('Error adding new cooking step:', err);
      setError('Error adding new cooking step.');
    }
  };

  useEffect(() => {
    fetchCookingSteps();
  }, []);

  return (
    <div>
      <h1>Cooking Steps</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      
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
