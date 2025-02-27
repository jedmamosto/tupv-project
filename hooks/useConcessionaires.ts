import { useState, useEffect } from "react";
import { Concessionaire, mockConcessionaires } from "../data/mockData";

export const useConcessionaires = () => {
  const [concessionaires, setConcessionaires] = useState<Concessionaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcessionaires = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setConcessionaires(mockConcessionaires);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch concessionaires");
        setLoading(false);
        console.error(err)
      }
    };

    fetchConcessionaires();
  }, []);

  return { concessionaires, loading, error };
};
