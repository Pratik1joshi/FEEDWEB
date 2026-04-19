import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  projectsApi, 
  eventsApi, 
  servicesApi, 
  teamApi, 
  publicationsApi, 
  timelineApi, 
  newsApi
} from './api-services';

// Custom hook for API calls with loading, error, and data states
export const useApi = (apiFunction, params = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);

  // Memoize params to prevent unnecessary re-renders
  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);
  const memoizedDependencies = useMemo(() => dependencies, [JSON.stringify(dependencies)]);

  const fetchData = useCallback(async (attempt = 0) => {
    if (hasFetched && attempt === 0) {
      return; // Prevent duplicate initial calls
    }

    try {
      setLoading(true);
      setError(null);
      
      let result;
      if (typeof apiFunction === 'function') {
        // If apiFunction is a bound method or needs parameters
        if (Object.keys(memoizedParams).length === 1 && memoizedParams.id) {
          result = await apiFunction(memoizedParams.id);
        } else if (Object.keys(memoizedParams).length === 1 && memoizedParams.limit) {
          result = await apiFunction(memoizedParams.limit);
        } else if (Object.keys(memoizedParams).length > 0) {
          result = await apiFunction(memoizedParams);
        } else {
          result = await apiFunction();
        }
      } else {
        result = await apiFunction;
      }
      
      setData(result);
      setRetryCount(0); // Reset retry count on success
      setHasFetched(true);
    } catch (err) {
      const isRateLimit = err.message.includes('Rate limit') || 
                          err.message.includes('Too many requests') || 
                          err.status === 429;
      
      if (isRateLimit && attempt < 3) {
        // Exponential backoff: wait 1s, then 2s, then 4s
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/3)`);
        
        setTimeout(() => {
          setRetryCount(attempt + 1);
          fetchData(attempt + 1);
        }, delay);
        return;
      } else {
        setError(err.message);
        setRetryCount(0);
        setHasFetched(true);
      }
    } finally {
      setLoading(false);
    }
  }, [apiFunction, memoizedParams, hasFetched]);

  useEffect(() => {
    let isMounted = true;
    
    if (!hasFetched && isMounted) {
      fetchData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [fetchData, memoizedDependencies]);

  const refetch = useCallback(() => {
    setRetryCount(0);
    setHasFetched(false);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch, retryCount };
};

// Events hooks
export const useEvents = (params = {}) => {
  return useApi(eventsApi.getAll, params, []);
};

export const useFeaturedEvents = (limit = 3) => {
  return useApi(eventsApi.getFeatured, { limit }, []);
};

export const useUpcomingEvents = (limit = 10) => {
  return useApi(eventsApi.getUpcoming, { limit }, []);
};

export const useEvent = (id) => {
  return useApi(eventsApi.getById, { id }, []);
};

// Services hooks
export const useServices = (params = {}) => {
  return useApi(() => servicesApi.getAll(params), params, [JSON.stringify(params)]);
};

export const useFeaturedServices = (limit = 6) => {
  return useApi(() => servicesApi.getFeatured(limit), { limit }, [limit]);
};

export const useService = (id) => {
  return useApi(() => servicesApi.getById(id), { id }, [id]);
};
