import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CountryData {
  code: string;
  country: string;
  flag: string;
}
interface CountryMap {
  [key: string]: CountryData;
}


export const useCountryData = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [countriesMap, setCountriesMap] = useState<CountryMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://restcountries.com/v3.1/all');

      if (!response.ok) {
        throw new Error('Failed to fetch country data');
      }

      const result = await response.json();
      const rawData = result.data;

      const formattedCountries: CountryData[] = Object.entries(rawData).map(
        ([code, countryData]: [string, any]) => ({
          code,
          country: countryData.country,
          flag: `https://flagsapi.com/${code}/shiny/64.png`, // Using flagsapi.com for SVG flags
        })
      ).sort((a, b) => a.country.localeCompare(b.country));

      const countryMap: CountryMap = formattedCountries.reduce((acc, country) => {
        acc[country.code] = country;
        return acc;
      }, {} as CountryMap);

      setCountries(formattedCountries);
      setCountriesMap(countryMap);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast.error('Failed to load country data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return {
    countries,
    countriesMap,
    isLoading,
    error,
    refetch: fetchCountries,
  };
};
