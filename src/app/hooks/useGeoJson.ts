import { useEffect, useState } from "react";

const useGeoJson = (filePath: string) => {
  const [geoJson, setGeoJson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        const data = await response.json();
        setGeoJson(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGeoJson();
  }, [filePath]);

  return { geoJson, isLoading, error };
};

export default useGeoJson;
