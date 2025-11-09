import { Button } from 'antd';
import { MoreVertical } from 'lucide-react';
import * as z from 'zod';
import AssignmentContextMenuOption from '@/blocs/AssignmentContextMenuOption';
import { formatCurrency } from '@/utils/globalFunction';
import moment from 'moment';

export const MaintenanceAssetFormSchema = z
  .object({
    date: z.coerce
      .date()
      .min(new Date('2000-01-01'), 'Date is required'),
    code: z.string().optional(),
    description: z.string().optional(),
    amount: z.coerce.number().min(0, 'Amount must be >= 0'),
    asset: z.union([
      z.string(),
      z.number(),
      z.object({ label: z.string(), value: z.union([z.string(), z.number()]) }),
    ]),
    employee: z.union([
      z.string(),
      z.number(),
      z.object({ label: z.string(), value: z.union([z.string(), z.number()]) }),
    ]),
    maintenance_type: z.union([
      z.string(),
      z.number(),
      z.object({ label: z.string(), value: z.union([z.string(), z.number()]) }),
    ]),
    attachment: z.any().optional(),
  })
  .loose();

export const ENDPOINTS = '/api/v1/maintenance_assets';

export const DEFAULT_PER_PAGE = 10;
export const DEFAULT_PAGE = 1;
export const DEFAULT_FILTERS = {
  ['$per_page']: DEFAULT_PER_PAGE,
  ['$page']: DEFAULT_PAGE,
};

export const EXPORT_CSV_CONFIG = {
  selectedKeys: [
    'id',
    'date',
    'code',
    'amount',
    'asset.name',
    'employee.name',
    'maintenance_type.name',
  ],
  defaultParams: {
    is_skip_pagination: true,
  },
};

export const expandedRowRender = (record) => {
  const currencyOpts = {
    locale: 'id-ID',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: 'currency',
  };
  return (
    <div style={{ padding: '12px', borderTop: '1px solid #f0f0f0' }}>
      <p>Date: {record?.date ? moment(record.date).format('DD MMM YYYY') : '-'}</p>
      <p>Code: {record?.code ?? '-'}</p>
      <p>Amount: {formatCurrency(record?.amount, currencyOpts)}</p>
      <p>Asset: {record?.asset?.name ?? '-'}</p>
      <p>Employee: {record?.employee?.name ?? '-'}</p>
      <p>Maintenance Type: {record?.maintenance_type?.name ?? '-'}</p>
      <p>Description: {record?.description ?? '-'}</p>
    </div>
  );
};

export const getColumns = () => [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    width: 120,
    render: (date) => (date ? moment(date).format('DD MMM YYYY') : '-'),
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    width: 140,
  },
  {
    title: 'Asset',
    dataIndex: ['asset', 'name'],
    key: 'asset_name',
    width: 180,
  },
  {
    title: 'Employee',
    dataIndex: ['employee', 'name'],
    key: 'employee_name',
    width: 180,
  },
  {
    title: 'Maintenance Type',
    dataIndex: ['maintenance_type', 'name'],
    key: 'maintenance_type_name',
    width: 200,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    width: 140,
    render: (amount) =>
      formatCurrency(amount, {
        locale: 'id-ID',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        style: 'currency',
      }),
  },
  {
    title: '',
    dataIndex: '',
    key: 'x',
    align: 'right',
    width: 50,
    render: (_, record) => (
      <AssignmentContextMenuOption
        editPath={`/master-data/maintenance-assets/edit/${record.id}`}
        detailPath={`/master-data/maintenance-assets/detail/${record.id}`}
        deletePath={`/master-data/maintenance-assets/delete/${record.id}`}
      >
        <Button variant="text" type="text" shape="circle" icon={<MoreVertical size={12} />} size={'middle'} />
      </AssignmentContextMenuOption>
    ),
  },
];

export const getBreadcrumbItems = (navigate) => [
  { title: 'Master Data', onClick: () => navigate('/master-data') },
  { title: 'Asset Maintenance' },
];