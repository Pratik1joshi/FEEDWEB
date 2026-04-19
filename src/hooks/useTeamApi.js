import { useState, useEffect, useRef } from 'react';
import { teamApi } from './api-team';

export function useTeamApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 3;

  const fetchData = async () => {
    if (loading || hasFetched.current) return;
    
    setLoading(true);
    setError(null);
    hasFetched.current = true;

    try {
      let result;
      
      switch (endpoint) {
        case 'getAll':
          result = await teamApi.getAll(options);
          break;
        case 'getById':
          result = await teamApi.getById(options.id);
          break;
        case 'getByDepartment':
          result = await teamApi.getByDepartment(options.department, options);
          break;
        case 'search':
          result = await teamApi.search(options.query, options);
          break;
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }
      
      setData(result);
      retryCount.current = 0;
      
    } catch (err) {
      console.error(`Team API Error (${endpoint}):`, err);
      setError(err.message);
      
      // Retry logic for network errors
      if (retryCount.current < maxRetries && (
        err.message.includes('Failed to fetch') || 
        err.message.includes('Network') ||
        err.message.includes('429')
      )) {
        retryCount.current++;
        const delay = Math.pow(2, retryCount.current) * 1000; // Exponential backoff
        
        setTimeout(() => {
          hasFetched.current = false;
          fetchData();
        }, delay);
        
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint && !hasFetched.current) {
      fetchData();
    }

    // Cleanup function
    return () => {
      hasFetched.current = false;
      retryCount.current = 0;
    };
  }, [endpoint, JSON.stringify(options)]);

  const refetch = () => {
    hasFetched.current = false;
    retryCount.current = 0;
    fetchData();
  };

  return { data, loading, error, refetch };
}
