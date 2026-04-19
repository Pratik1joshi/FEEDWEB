import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  projectsApi, 
  eventsApi, 
  servicesApi, 
  teamApi, 
  publicationsApi, 
  timelineApi, 
  newsApi
} from '../lib/api-services';

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

// Custom hook for paginated data
export const usePaginatedApi = (apiFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ limit: 10, offset: 0, ...initialParams });

  const fetchData = useCallback(async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const mergedParams = { ...params, ...newParams };
      const result = await apiFunction(mergedParams);
      
      if (newParams.offset === 0 || !newParams.offset) {
        // First page or reset
        setData(result.data || []);
      } else {
        // Append to existing data (load more)
        setData(prev => [...prev, ...(result.data || [])]);
      }
      
      setPagination(result.pagination);
      setParams(mergedParams);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params]);

  useEffect(() => {
    fetchData();
  }, []);

  const loadMore = () => {
    if (pagination && pagination.offset + pagination.limit < pagination.total) {
      fetchData({ offset: pagination.offset + pagination.limit });
    }
  };

  const refresh = (newParams = {}) => {
    fetchData({ offset: 0, ...newParams });
  };

  const hasMore = pagination && pagination.offset + pagination.limit < pagination.total;

  return {
    data,
    pagination,
    loading,
    error,
    loadMore,
    refresh,
    hasMore
  };
};

// Custom hook for search functionality
export const useSearch = (apiFunction, debounceMs = 500) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(query);
        setResults(result.data || []);
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, apiFunction, debounceMs]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch: () => {
      setQuery('');
      setResults([]);
      setError(null);
    }
  };
};

// Custom hook for form submission
export const useApiSubmit = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const result = await apiFunction(data);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { submit, loading, error, success, reset };
};

// Custom hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Verify token and get user profile
      import('../lib/api').then(({ authApi }) => {
        authApi.checkAuth()
          .then(result => {
            setUser(result.data);
          })
          .catch(() => {
            localStorage.removeItem('auth_token');
          })
          .finally(() => {
            setLoading(false);
          });
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const { authApi } = await import('../lib/api');
    const result = await authApi.login(credentials);
    const token = result?.data?.token || result?.token;
    const user = result?.data?.admin || result?.user;

    if (token) {
      localStorage.setItem('auth_token', token);
    }

    if (user) {
      setUser(user);
    }

    return result;
  };

  const logout = async () => {
    const { authApi } = await import('../lib/api');
    await authApi.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  };
};

// Projects hooks
export const useProjects = (params = {}) => {
  return useApi(projectsApi.getAll, params, []);
};

export const useFeaturedProjects = (limit = 6, type = null) => {
  const params = { limit };
  if (type) params.type = type;
  return useApi(projectsApi.getFeatured, params, []);
};

export const useProject = (id) => {
  return useApi(projectsApi.getById, { id }, []);
};

export const useProjectStats = () => {
  return useApi(projectsApi.getStats, {}, []);
};

export const useProjectsByCategory = (category, params = {}) => {
  const memoizedParams = useMemo(() => ({ category, ...params }), [category, JSON.stringify(params)]);
  return useApi(
    () => projectsApi.getByCategory(category, params), 
    memoizedParams, 
    []
  );
};

export const useProjectsByProvince = (province, params = {}) => {
  const memoizedParams = useMemo(() => ({ province, ...params }), [province, JSON.stringify(params)]);
  return useApi(
    () => projectsApi.getByProvince(province, params), 
    memoizedParams, 
    []
  );
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

// Team hooks
export const useTeam = (params = {}) => {
  return useApi(() => teamApi.getAll(params), params, [JSON.stringify(params)]);
};

export const useTeamMember = (id) => {
  return useApi(() => teamApi.getById(id), { id }, [id]);
};

// Publications hooks
export const usePublications = (params = {}) => {
  return useApi(() => publicationsApi.getAll(params), params, [JSON.stringify(params)]);
};

export const useFeaturedPublications = (limit = 6) => {
  return useApi(() => publicationsApi.getFeatured(limit), { limit }, [limit]);
};

export const usePublication = (id) => {
  return useApi(() => publicationsApi.getById(id), { id }, [id]);
};

// Timeline hooks
export const useTimeline = (params = {}) => {
  return useApi(() => timelineApi.getAll(params), params, [JSON.stringify(params)]);
};

export const useTimelineItem = (id) => {
  return useApi(() => timelineApi.getById(id), { id }, [id]);
};

// News hooks
export const useNews = (params = {}) => {
  return useApi(() => newsApi.getAll(params), params, [JSON.stringify(params)]);
};

export const useFeaturedNews = (limit = 6) => {
  return useApi(() => newsApi.getFeatured(limit), { limit }, [limit]);
};

export const useNewsItem = (id) => {
  return useApi(() => newsApi.getById(id), { id }, [id]);
};
