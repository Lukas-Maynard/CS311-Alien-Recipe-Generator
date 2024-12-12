'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';

const CookingMethodsPage = () => {
  const [cookingMethods, setCookingMethods] = useState<string[]>([]);
  const [newMethod, setNewMethod] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchCookingMethods = async () => {
    setError(null);
    try {
      const { data, error } = await supabase.from('cooking_methods').select('name');
      if (error) throw error;

      const methodNames = data.map((method) => method.name);
      setCookingMethods(methodNames);
    } catch (err) {
      console.error('Error fetching cooking methods:', err);
      setError('Error fetching cooking methods.');
    }
  };

  const handleAddCookingMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!newMethod.trim()) {
      setError('Cooking method name cannot be empty.');
      return;
    }

    try {
      const { error } = await supabase
        .from('cooking_methods')
        .insert([{ name: newMethod.trim() }]);

      if (error) throw error;

      setSuccessMessage('Cooking method added successfully!');
      setNewMethod('');
      fetchCookingMethods();
    } catch (err) {
      console.error('Error adding new cooking method:', err);
      setError('Error adding new cooking method. Ensure it has a unique name.');
    }
  };

  useEffect(() => {
    fetchCookingMethods();
  }, []);

  return (
    <div>
      <h1>Cooking Methods</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      
      <h2>Add New Cooking Method</h2>
      <form onSubmit={handleAddCookingMethod}>
        <input
          type="text"
          placeholder="Enter cooking method"
          value={newMethod}
          onChange={(e) => setNewMethod(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      <h2>Existing Cooking Methods</h2>
      <ul>
        {cookingMethods.length > 0 ? (
          cookingMethods.map((method, index) => (
            <li key={index}>{method}</li>
          ))
        ) : (
          <p>No cooking methods found</p>
        )}
      </ul>
    </div>
  );
};

export default CookingMethodsPage;
