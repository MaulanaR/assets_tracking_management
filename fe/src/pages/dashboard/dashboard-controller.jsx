import Api from '@/utils/axios/api';
import { useQuery } from '@tanstack/react-query';

// Separate function for fetching summary data
const fetchSummary = async ({ url }) => {
  try {
    const response = await Api().get(url);
    console.log('Summary Data =>', response.data);
    return response.data?.results || [];
  } catch (error) {
    console.error('Error fetching summary data:', error);
    throw error;
  }
};

// Function to extract count from API response
const extractCount = (data) => {
  if (data && data.list && data.list.length > 0) {
    return data.list[0].count_id || 0;
  }
  return 0;
};

// Function to extract sum from API response
const extractSum = (data) => {
  if (data && data.list && data.list.length > 0) {
    return data.list[0].sum_price || 0;
  }
  return 0;
};

// Function to extract depreciation sum from API response
const extractDepreciationSum = (data) => {
  if (data && data.list && data.list.length > 0) {
    return data.list[0].sum_depreciation?.amount || 0;
  }
  return 0;
};

const useDashboardController = () => {
  // Fetch departments count
  const {
    data: departmentsData = [],
    isLoading: isLoadingDepartments,
    isError: isErrorDepartments,
    error: errorDepartments,
    refetch: refetchDepartments,
  } = useQuery({
    queryKey: ['departments_count'],
    queryFn: () =>
      fetchSummary({
        url: '/api/v1/departments?$select=$count:id',
      }),
    staleTime: 5 * 60 * 1000, // Data dianggap fresh selama 5 menit
    cacheTime: 10 * 60 * 1000, // Data di-cache selama 10 menit
  });

  // Fetch branches count
  const {
    data: branchesData = [],
    isLoading: isLoadingBranches,
    isError: isErrorBranches,
    error: errorBranches,
    refetch: refetchBranches,
  } = useQuery({
    queryKey: ['branches_count'],
    queryFn: () =>
      fetchSummary({
        url: '/api/v1/branches?$select=$count:id',
      }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch employees count
  const {
    data: employeesData = [],
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
    error: errorEmployees,
    refetch: refetchEmployees,
  } = useQuery({
    queryKey: ['employees_count'],
    queryFn: () =>
      fetchSummary({
        url: '/api/v1/employees?$select=$count:id',
      }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch available assets count (assets without assignments)
  const {
    data: availableAssetsData = [],
    isLoading: isLoadingAvailableAssets,
    isError: isErrorAvailableAssets,
    error: errorAvailableAssets,
    refetch: refetchAvailableAssets,
  } = useQuery({
    queryKey: ['available_assets_count'],
    queryFn: () =>
      fetchSummary({
        url: '/api/v1/assets?$select=$count:id&$filter=assignment_id eq null',
      }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch unavailable assets count (assets with assignments)
  const {
    data: unavailableAssetsData = [],
    isLoading: isLoadingUnavailableAssets,
    isError: isErrorUnavailableAssets,
    error: errorUnavailableAssets,
    refetch: refetchUnavailableAssets,
  } = useQuery({
    queryKey: ['unavailable_assets_count'],
    queryFn: () =>
      fetchSummary({
        url: '/api/v1/assets?$select=$count:id&$filter=assignment_id ne null',
      }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch assets by category for pie chart
  const {
    data: assetsByCategoryData = [],
    isLoading: isLoadingAssetsByCategory,
    isError: isErrorAssetsByCategory,
    error: errorAssetsByCategory,
    refetch: refetchAssetsByCategory,
  } = useQuery({
    queryKey: ['assets_by_category'],
    queryFn: () =>
      fetchSummary({
        url: '/api/v1/assets?$select=$count:id,category.name&$group=category.id',
      }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch total asset value
  const {
    data: totalAssetValueData = [],
    isLoading: isLoadingTotalAssetValue,
    isError: isErrorTotalAssetValue,
    error: errorTotalAssetValue,
    refetch: refetchTotalAssetValue,
  } = useQuery({
    queryKey: ['total_asset_value'],
    queryFn: () =>
      fetchSummary({
        url: '/api/v1/assets?$select=$sum:price&$is_disable_pagination=true',
      }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch total asset depreciation
  const {
    data: totalAssetDepreciationData = [],
    isLoading: isLoadingTotalAssetDepreciation,
    isError: isErrorTotalAssetDepreciation,
    error: errorTotalAssetDepreciation,
    refetch: refetchTotalAssetDepreciation,
  } = useQuery({
    queryKey: ['total_asset_depreciation'],
    queryFn: () =>
      fetchSummary({
        url: '/api/v1/assets?$select=$sum:depreciation.amount&$is_disable_pagination=true',
      }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Calculate counts
  const departmentsCount = extractCount(departmentsData);
  const branchesCount = extractCount(branchesData);
  const employeesCount = extractCount(employeesData);
  const availableAssetsCount = extractCount(availableAssetsData);
  const unavailableAssetsCount = extractCount(unavailableAssetsData);
  const totalAssetValue = extractSum(totalAssetValueData);
  const totalAssetDepreciation = extractDepreciationSum(
    totalAssetDepreciationData,
  );
  const totalAssetEconomicValue = totalAssetValue - totalAssetDepreciation;

  // Check if any data is still loading
  const isLoading =
    isLoadingDepartments ||
    isLoadingBranches ||
    isLoadingEmployees ||
    isLoadingAvailableAssets ||
    isLoadingUnavailableAssets ||
    isLoadingAssetsByCategory ||
    isLoadingTotalAssetValue ||
    isLoadingTotalAssetDepreciation;

  // Check if any data has errors
  const isError =
    isErrorDepartments ||
    isErrorBranches ||
    isErrorEmployees ||
    isErrorAvailableAssets ||
    isErrorUnavailableAssets ||
    isErrorAssetsByCategory ||
    isErrorTotalAssetValue ||
    isErrorTotalAssetDepreciation;

  return {
    // Individual data objects
    departments: {
      data: departmentsData,
      count: departmentsCount,
      isLoading: isLoadingDepartments,
      isError: isErrorDepartments,
      error: errorDepartments,
      refetch: refetchDepartments,
    },
    branches: {
      data: branchesData,
      count: branchesCount,
      isLoading: isLoadingBranches,
      isError: isErrorBranches,
      error: errorBranches,
      refetch: refetchBranches,
    },
    employees: {
      data: employeesData,
      count: employeesCount,
      isLoading: isLoadingEmployees,
      isError: isErrorEmployees,
      error: errorEmployees,
      refetch: refetchEmployees,
    },
    availableAssets: {
      data: availableAssetsData,
      count: availableAssetsCount,
      isLoading: isLoadingAvailableAssets,
      isError: isErrorAvailableAssets,
      error: errorAvailableAssets,
      refetch: refetchAvailableAssets,
    },
    unavailableAssets: {
      data: unavailableAssetsData,
      count: unavailableAssetsCount,
      isLoading: isLoadingUnavailableAssets,
      isError: isErrorUnavailableAssets,
      error: errorUnavailableAssets,
      refetch: refetchUnavailableAssets,
    },
    assetsByCategory: {
      data: assetsByCategoryData,
      isLoading: isLoadingAssetsByCategory,
      isError: isErrorAssetsByCategory,
      error: errorAssetsByCategory,
      refetch: refetchAssetsByCategory,
    },
    totalAssetValue: {
      data: totalAssetValueData,
      value: totalAssetValue,
      isLoading: isLoadingTotalAssetValue,
      isError: isErrorTotalAssetValue,
      error: errorTotalAssetValue,
      refetch: refetchTotalAssetValue,
    },
    totalAssetDepreciation: {
      data: totalAssetDepreciationData,
      value: totalAssetDepreciation,
      isLoading: isLoadingTotalAssetDepreciation,
      isError: isErrorTotalAssetDepreciation,
      error: errorTotalAssetDepreciation,
      refetch: refetchTotalAssetDepreciation,
    },
    totalAssetEconomicValue: {
      value: totalAssetEconomicValue,
      isLoading: isLoadingTotalAssetValue || isLoadingTotalAssetDepreciation,
      isError: isErrorTotalAssetValue || isErrorTotalAssetDepreciation,
    },
    // Summary counts for easy access
    summary: {
      departments: departmentsCount,
      branches: branchesCount,
      employees: employeesCount,
      availableAssets: availableAssetsCount,
      unavailableAssets: unavailableAssetsCount,
      totalAssets: availableAssetsCount + unavailableAssetsCount,
    },
    // Global loading and error states
    isLoading,
    isError,
    // Legacy support for existing code
    assetsCategory: {
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: () => {},
    },
  };
};

export default useDashboardController;
