import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: tags, error } = await supabase.from('tags').select('*');

    if (error) {
      console.error('Error fetching tags:', error);
      return res.status(500).json({ message: 'Error fetching tags' });
    }

    res.status(200).json(tags);
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Unexpected error occurred' });
  }
}
