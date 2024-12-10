'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CookingMethodsPage = () => {
  const [cookingMethods, setCookingMethods] = useState<string[]>([]);
  const [newMethod, setNewMethod] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Fetch cooking methods from the API
  const fetchCookingMethods = async () => {
    try {
      const { data } = await axios.get('/api/cooking-methods');
      setCookingMethods(data);
    } catch (error) {
      setError('Error fetching cooking methods');
    }
  };

  // Add a new cooking method
  const handleAddCookingMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethod.trim()) return;

    try {
      await axios.post('/api/cooking-methods', { name: newMethod });
      setNewMethod('');
      fetchCookingMethods(); // Refresh the list
    } catch (error) {
      setError('Error adding new cooking method');
    }
  };

  useEffect(() => {
    fetchCookingMethods();
  }, []);

  return (
    <div>
      <h1>Cooking Methods</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
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
