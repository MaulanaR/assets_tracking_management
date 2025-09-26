import Api from '@/utils/axios/api';
import { useQuery } from '@tanstack/react-query';

// Separate function for fetching assets category data
const fetchSummary = async ({ url }) => {
  try {
    const response = await Api().get(url);
    console.log('Asset Categories =>', response.data);
    return response.data?.results || [];
  } catch (error) {
    console.error('Error fetching asset categories:', error);
    throw error;
  }
};

const useDashboardController = () => {
  // Fetch assets category data using React Query
  const {
    data: assetsCategory = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['assets_category'],
    queryFn: fetchSummary({
      url: '/api/v1/assets?$select=$count:id&$group=category.id',
    }),
    staleTime: 5 * 60 * 1000, // Data dianggap fresh selama 5 menit
    cacheTime: 10 * 60 * 1000, // Data di-cache selama 10 menit
  });

  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
    isError: isErrorDepartments,
    error: errorDepartments,
    refetch: refetchDepartments,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchSummary({
      url: '/api/v1/departments?$select=$count:id&$group=category.id',
    }),
    staleTime: 5 * 60 * 1000, // Data dianggap fresh selama 5 menit
    cacheTime: 10 * 60 * 1000, // Data di-cache selama 10 menit
  });

  return {
    assetsCategory: {
      data: assetsCategory,
      isLoading,
      isError,
      error,
      refetch,
    },
  };
};

export default useDashboardController;
