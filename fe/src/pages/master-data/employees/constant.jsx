import { Button } from 'antd';
import { MoreVertical } from 'lucide-react';
import * as z from 'zod';

import ContextMenuOption from '@/blocs/ContextMenuOption';
import renderTags from '@/utils/renderTags';

export const EmployeeFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    department: z.union([z.string(), z.number()]),
    branch: z.union([z.string(), z.number()]),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
  })
  .loose();

// API Endpoints
export const ENDPOINTS = '/api/v1/employees';

// Pagination defaults
export const DEFAULT_PER_PAGE = 10;
export const DEFAULT_PAGE = 1;
export const DEFAULT_FILTERS = {
  ['$per_page']: DEFAULT_PER_PAGE,
  ['$page']: DEFAULT_PAGE,
};

// Employee type colors mapping
export const TYPE_COLORS = {
  customer: 'blue',
  supplier: 'green',
  employee: 'orange',
  salesman: 'purple',
};

// Export CSV configuration
export const EXPORT_CSV_CONFIG = {
  selectedKeys: ['id', 'name', 'code', 'description'],
  defaultParams: {
    is_skip_pagination: true,
  },
};

// Mobile view expanded row render
export const expandedRowRender = (record) => (
  <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
    <p>code: {record.code}</p>
    <p>name: {record.name}</p>
    <p>economic_age: {record.economic_age}</p>
    <p>description: {record.description}</p>
  </div>
);

// Table columns configuration
export const getColumns = () => [
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    width: 100,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Umur Ekonomis',
    dataIndex: 'economic_age',
    key: 'economic_age',
    render: (_, { economic_age }) => economic_age + ' Bulan',
  },
  {
    title: 'Deskripsi',
    dataIndex: 'description',
    key: 'description',
    render: (_, { description }) => description ?? '-',
  },
  {
    title: 'Status',
    dataIndex: 'is_active',
    key: 'is_active',
    width: 100,
    justify: 'center',
    render: (_, record) => {
      const status = record.is_active ? 'active' : 'inactive';
      return renderTags(_, { tags: [status] });
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
        editPath={`/master-data/employees/edit/${record.id}`}
        detailPath={`/master-data/employees/detail/${record.id}`}
        deletePath={`/master-data/employees/delete/${record.id}`}
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
    title: 'Master Data',
    onClick: () => navigate('/master-data'),
  },
  {
    title: 'Employees',
  },
];
