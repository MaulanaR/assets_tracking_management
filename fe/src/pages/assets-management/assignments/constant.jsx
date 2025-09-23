import { Button } from 'antd';
import { MoreVertical } from 'lucide-react';
import * as z from 'zod';

import ContextMenuOption from '@/blocs/ContextMenuOption';
import renderTags from '@/utils/renderTags';

export const AssignmentFormSchema = z
  .object({
    code: z.string().min(1, 'Code is required'),
    asset: z.union([z.string(), z.number()]),
    employee: z.union([z.string(), z.number()]),
    condition: z.union([z.string(), z.number()]),
    assign_date: z.coerce
      .date()
      .min(new Date('2000-01-01'), 'Assign date is required'),
  })
  .passthrough();

// API Endpoints
export const ENDPOINTS = '/api/v1/employee_assets';

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
  selectedKeys: ['id', 'assign_date', 'employee_name', 'price', 'status'],
  defaultParams: {
    is_skip_pagination: true,
  },
};

// Mobile view expanded row render
export const expandedRowRender = (record) => (
  <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
    <p>Assignment Date: {record?.assign_date}</p>
    <p>Name: {record?.name}</p>
    <p>Asset: {record?.asset?.name}</p>
    <p>Status: {record?.status}</p>
  </div>
);

// Table columns configuration
export const getColumns = () => [
  {
    title: 'Assignment Date',
    dataIndex: 'assign_date',
    key: 'assign_date',
    width: 120,
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    width: 120,
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
    title: 'Employee Name',
    dataIndex: ['employee', 'name'],
    key: 'employee_name',
    width: 200,
  },
  {
    title: 'Asset Name',
    dataIndex: ['asset', 'name'],
    key: 'asset_name',
    width: 120,
    responsive: ['md'],
    render: (asset) => asset ?? '-',
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
        editPath={`/assets-management/assignments/edit/${record.id}`}
        detailPath={`/assets-management/assignments/detail/${record.id}`}
        deletePath={`/assets-management/assignments/delete/${record.id}`}
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

// Breadcrumb items
export const getBreadcrumbItems = (navigate) => [
  {
    title: 'Assets Management',
    onClick: () => navigate('/assets-management'),
  },
  {
    title: 'Assignments',
  },
];
