'use client';

import { useState, useEffect } from 'react';
import { Territory } from '@/types/territory';
import { getTerritories, getTerritoryById } from '@/lib/db/territories';

interface UseTerritoriesOptions {
  autoFetch?: boolean;
  limit?: number;
  offset?: number;
}

export function useTerritories(options: UseTerritoriesOptions = {}) {
  const { autoFetch = true, limit, offset } = options;
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTerritories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTerritories({ limit, offset });
      setTerritories(data.territories);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch territories'));
      console.error('Error fetching territories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTerritories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, limit, offset]);

  const refetch = () => {
    return fetchTerritories();
  };

  return {
    territories,
    loading,
    error,
    refetch,
  };
}

export function useTerritory(id: string | null) {
  const [territory, setTerritory] = useState<Territory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setTerritory(null);
      return;
    }

    const fetchTerritory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTerritoryById(id);
        setTerritory(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch territory'));
        console.error('Error fetching territory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerritory();
  }, [id]);

  return {
    territory,
    loading,
    error,
  };
}
