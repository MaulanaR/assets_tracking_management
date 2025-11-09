import ContextMenuOption from '@/blocs/ContextMenuOption';
import renderTags from '@/utils/renderTags';
import { Button } from 'antd';
import { MoreVertical } from 'lucide-react';
import * as z from 'zod';

export const MaintenanceTypeFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().optional(),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
  })
  .loose();

// API Endpoints
export const ENDPOINTS = '/api/v1/maintenance_types';

// Pagination defaults
export const DEFAULT_PER_PAGE = 10;
export const DEFAULT_PAGE = 1;
export const DEFAULT_FILTERS = {
  ['$per_page']: DEFAULT_PER_PAGE,
  ['$page']: DEFAULT_PAGE,
};

// Export CSV configuration (if supported by backend; kept minimal)
export const EXPORT_CSV_CONFIG = {
  selectedKeys: ['id', 'name', 'code', 'description', 'is_active'],
  defaultParams: {
    is_skip_pagination: true,
  },
};

// Mobile view expanded row render
export const expandedRowRender = (record) => (
  <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
    <p>code: {record.code}</p>
    <p>name: {record.name}</p>
    <p>description: {record.description}</p>
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
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 240,
  },
  {
    title: 'Status',
    dataIndex: 'is_active',
    key: 'is_active',
    width: 120,
    justify: 'center',
    render: (_, record) => {
      const status = record.is_active ? 'active' : 'inactive';
      return renderTags(_, { tags: [status] });
    },
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 200,
  },
  {
    title: 'Updated At',
    dataIndex: 'updated_at',
    key: 'updated_at',
    width: 200,
  },
  {
    title: '',
    dataIndex: '',
    key: 'x',
    align: 'right',
    width: 50,
    render: (_, record) => (
      <ContextMenuOption
        editPath={`/master-data/maintenance-types/edit/${record.id}`}
        detailPath={`/master-data/maintenance-types/detail/${record.id}`}
        deletePath={`/master-data/maintenance-types/delete/${record.id}`}
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
    title: 'Maintenance Types',
  },
];