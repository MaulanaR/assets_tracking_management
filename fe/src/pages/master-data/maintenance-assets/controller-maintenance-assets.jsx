import ListInfinteScroll from '@/components/ListInfinteScroll';
import { useDataQuery } from '@/utils/hooks/useDataQuery';
import { useDebouncedSearchParams } from '@/utils/hooks/useDebouncedSearchParams';
import useExportCSV from '@/utils/hooks/useExportCSV';
import { Avatar, Grid, List } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useFetcher, useNavigate } from 'react-router';
import { DEFAULT_FILTERS, DEFAULT_PAGE, DEFAULT_PER_PAGE, ENDPOINTS, EXPORT_CSV_CONFIG } from './constant';

const { useBreakpoint } = Grid;

export const useMaintenanceAssetsController = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const fetcher = useFetcher({ key: 'action-delete-maintenance-asset' });
  const [selectedRow, setSelectedRow] = useState([]);

  const { searchParam, updateParam, clearAllParams } = useDebouncedSearchParams(600);

  const allParams = Object.fromEntries(searchParam.entries());
  const currentPage = Number.parseInt(allParams['$page'], 10) || DEFAULT_PAGE;
  const per_page = Number.parseInt(allParams['$per_page'], 10) || DEFAULT_PER_PAGE;
  const searchValue = allParams['$search']?.split(':')[1] || '';

  const currentFilters = { ...DEFAULT_FILTERS, ...allParams };

  const hasActiveFilters = Object.keys(allParams).length > 0;

  const { exportToCSV, isExporting } = useExportCSV({
    endpoint: ENDPOINTS,
    selectedKeys: EXPORT_CSV_CONFIG.selectedKeys,
    filename: `maintenance_assets_${moment().format('YYYY-MM-DD')}`,
    defaultParams: EXPORT_CSV_CONFIG.defaultParams,
  });

  const { initialData, isLoading, refetch } = useDataQuery({
    queryKey: ['maintenance_assets'],
    getUrl: ENDPOINTS,
    filters: currentFilters,
  });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      refetch();
    }
  }, [refetch, fetcher.state, fetcher.data]);

  const handleSearch = (e) => {
    updateParam({ ['$search']: `code,description:${e.target.value}`, ['$page']: 1 });
  };

  const onShowSizeChange = (_, newPerPage) => {
    updateParam({ ['$per_page']: newPerPage, ['$page']: 1 });
  };

  const handleSelectRow = (selectedRowKeys) => {
    setSelectedRow(selectedRowKeys);
  };

  const onChange = (page) => {
    updateParam('page', page);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleClearFilters = () => {
    clearAllParams?.();
  };

  const handleFilter = () => {
    navigate('filter');
  };

  const handleCreate = () => {
    navigate('/master-data/maintenance-assets/create');
  };

  const handleExportCSV = () => {
    exportToCSV();
  };

  const navigateToParent = () => {
    navigate('/master-data');
  };

  return {
    selectedRow,
    screens,
    initialData,
    isLoading,
    currentPage,
    per_page,
    searchValue,
    hasActiveFilters,
    isExporting,
    handleSearch,
    onShowSizeChange,
    handleSelectRow,
    onChange,
    handleRefresh,
    handleClearFilters,
    handleFilter,
    handleCreate,
    handleExportCSV,
    navigateToParent,
    renderListMobileView: () => (
      <ListInfinteScroll
        queryKey="mobile-maintenance-assets"
        endpoint={ENDPOINTS}
        pageSize={per_page}
        filters={currentFilters}
        onEdit={(item) => navigate(`/master-data/maintenance-assets/edit/${item.id}`)}
        onDetail={(item) => navigate(`/master-data/maintenance-assets/detail/${item.id}`)}
        onDelete={(item) => navigate(`/master-data/maintenance-assets/delete/${item.id}`)}
        renderItem={(item, handleItemClick) => (
          <List.Item key={item.id} onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
            <List.Item.Meta
              avatar={item?.asset?.avatar ? <Avatar src={item.asset.avatar} /> : <Avatar>{item?.asset?.name?.[0] || '?'}</Avatar>}
              title={`${item?.asset?.name ?? '-'} - ${item?.maintenance_type?.name ?? '-'}`}
              description={item?.description}
            />
          </List.Item>
        )}
      />
    ),
    navigate,
  };
};