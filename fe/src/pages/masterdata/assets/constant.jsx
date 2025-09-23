import { Button } from 'antd';
import { MoreVertical } from 'lucide-react';
import * as z from 'zod';

import ContextMenuOption from '@/blocs/ContextMenuOption';
import renderTags from '@/utils/renderTags';
import { fetchSelect } from '@/utils/services/fetchSelect';

export const AssetFormSchema = z
  .object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .positive('Price must be greater than 0'),

    category: z
      .object({
        label: z.string(),
        value: z.string().or(z.number()),
        key: z.string(),
        title: z.string(),
      })
      .optional(),

    condition: z
      .object({
        label: z.string(),
        value: z.string().or(z.number()),
        key: z.string(),
        title: z.string(),
      })
      .optional(),

    department: z
      .object({
        label: z.string(),
        value: z.string().or(z.number()),
        key: z.string(),
        title: z.string(),
      })
      .optional(),

    branch: z
      .object({
        label: z.string(),
        value: z.string().or(z.number()),
        key: z.string(),
        title: z.string(),
      })
      .optional(),

    status: z.enum(['available', 'unavailable'], {
      required_error: 'Status is required',
    }),
  })
  .passthrough();

// API Endpoints
export const ENDPOINTS = '/api/v1/assets';

// Pagination defaults
export const DEFAULT_PER_PAGE = 10;
export const DEFAULT_PAGE = 1;
export const DEFAULT_FILTERS = {
  limit: DEFAULT_PER_PAGE,
  page: DEFAULT_PAGE,
};

// Asset status colors mapping
export const STATUS_COLORS = {
  available: 'green',
  unavailable: 'red',
};

// Export CSV configuration
export const EXPORT_CSV_CONFIG = {
  selectedKeys: ['id', 'name', 'code', 'price', 'status'],
  defaultParams: {
    is_skip_pagination: true,
  },
};

// Mobile view expanded row render
export const expandedRowRender = (record) => (
  <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
    <p>Code: {record.code}</p>
    <p>Name: {record.name}</p>
    <p>Price: {record.price}</p>
    <p>Status: {record.status}</p>
  </div>
);

// Table columns configuration
export const getColumns = () => [
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    width: 120,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: 120,
    responsive: ['md'],
    render: (price) =>
      price ? `Rp ${Number(price).toLocaleString('en-US')}` : '-',
  },
  {
    title: 'Category',
    dataIndex: ['category', 'name'],
    key: 'category',
    width: 120,
    responsive: ['md'],
    render: (category) => category ?? '-',
  },
  {
    title: 'Condition',
    dataIndex: ['condition', 'name'],
    key: 'condition',
    width: 120,
    responsive: ['lg'],
    render: (condition) => condition ?? '-',
  },
  {
    title: 'Department',
    dataIndex: ['department', 'name'],
    key: 'department',
    width: 120,
    responsive: ['lg'],
    render: (department) => department ?? '-',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status) => {
      return renderTags(status, {
        tags: [status],
        color: STATUS_COLORS[status] || 'default',
      });
    },
  },
  {
    title: '',
    dataIndex: '',
    key: 'x',
    align: 'right',
    width: 50,
    render: (_, record) => (
      <ContextMenuOption
        editPath={`/masterdata/assets/edit/${record.id}`}
        detailPath={`/masterdata/assets/detail/${record.id}`}
        deletePath={`/masterdata/assets/delete/${record.id}`}
      >
        <Button
          variant="text"
          type="text"
          shape="circle"
          icon={<MoreVertical size={12} />}
          size={'middle'}
        />
      </ContextMenuOption>
    ),
  },
];

// Helper function untuk create request function
export const createRequestFunction = ({
  url,
  key = 'select option',
  labelKey = 'name',
  valueKey = 'id',
}) => {
  return async (params) => {
    try {
      const response = await fetchSelect({
        pageParam: 1,
        queryKey: [url, key, params.keyWords || ''],
        url: url,
        search: params.keyWords || '',
      });

      return response.data.map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      }));
    } catch (error) {
      console.error('Error fetching options:', error);
      return [];
    }
  };
};

// Breadcrumb items
export const getBreadcrumbItems = (navigate) => [
  {
    title: 'Master Data',
    onClick: () => navigate('/masterdata'),
  },
  {
    title: 'Assets',
  },
];
