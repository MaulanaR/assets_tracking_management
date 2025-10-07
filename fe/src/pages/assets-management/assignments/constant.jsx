import { Button, Col, Row, Typography } from 'antd';
import { MoreVertical } from 'lucide-react';
import * as z from 'zod';

import AssignmentContextMenuOption from '@/blocs/AssignmentContextMenuOption';
import { formatCurrency } from '@/utils/globalFunction';
import renderTags from '@/utils/renderTags';
import moment from 'moment';

const { Text, Title } = Typography;

export const AssignmentFormSchema = z
  .object({
    asset: z.union([
      z.string(),
      z.number(),
      z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
      }),
    ]),
    employee: z.union([
      z.string(),
      z.number(),
      z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
      }),
    ]),
    condition: z.union([
      z.string(),
      z.number(),
      z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
      }),
    ]),
    assign_date: z.coerce
      .date()
      .min(new Date('2000-01-01'), 'Assign date is required'),
  })
  .loose();

// API Endpoints
export const ENDPOINTS = '/api/v1/assets';

// Pagination defaults
export const DEFAULT_PER_PAGE = 10;
export const DEFAULT_PAGE = 1;
export const DEFAULT_FILTERS = {
  ['$per_page']: DEFAULT_PER_PAGE,
  ['$page']: DEFAULT_PAGE,
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
export const expandedRowRender = (record) => {
  const options = {
    locale: 'id-ID',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: 'currency',
  };

  const InfoItem = ({ label, value }) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Text type="secondary" style={{ fontSize: '13px' }}>
        {label}:
      </Text>
      <Text strong style={{ fontSize: '13px', color: '#262626' }}>
        {value || '-'}
      </Text>
    </div>
  );

  return (
    <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12}>
          <div
            style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e8e8e8',
            }}
          >
            <Text
              strong
              style={{
                fontSize: '14px',
                color: '#1890ff',
                marginBottom: '12px',
                display: 'block',
              }}
            >
              Informasi Assignment
            </Text>
            <InfoItem
              label="Tanggal Assignment"
              value={
                record?.assign_date
                  ? moment(record.assign_date).format('DD MMM YYYY')
                  : '-'
              }
            />
            <InfoItem label="Departemen" value={record?.department?.name} />
            <InfoItem label="Cabang" value={record?.branch?.name} />
            <InfoItem label="Kondisi" value={record?.condition?.name} />
            <InfoItem
              label="Nilai Saat Ini"
              value={formatCurrency(record?.current_amount, options)}
            />
          </div>
        </Col>

        <Col xs={24} sm={12}>
          <div
            style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e8e8e8',
            }}
          >
            <Text
              strong
              style={{
                fontSize: '14px',
                color: '#f5222d',
                marginBottom: '12px',
                display: 'block',
              }}
            >
              Informasi Depresiasi
            </Text>
            <InfoItem
              label="Depresiasi per Bulan"
              value={formatCurrency(record?.depreciation?.per_month, options)}
            />
            <InfoItem
              label="Total Depresiasi"
              value={formatCurrency(record?.depreciation?.amount, options)}
            />
            <InfoItem
              label="Nilai Sisa"
              value={formatCurrency(record?.salvage?.amount, options)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

// Table columns configuration
export const getColumns = () => [
  {
    title: 'Assignment Date',
    dataIndex: 'assign_date',
    key: 'assign_date',
    width: 120,
    render: (date) => moment(date).format('DD MMM YYYY') || '-',
  },
  {
    title: 'Employee Name',
    dataIndex: ['employee', 'name'],
    key: 'employee_name',
    width: 200,
  },
  {
    title: 'Asset Name',
    dataIndex: 'name', // key from res data
    key: 'name',
    width: 120,
    responsive: ['md'],
    render: (name) => {
      return name ?? '-';
    },
  },
  // {
  //   title: 'Condition',
  //   dataIndex: ['condition', 'name'],
  //   key: 'condition',
  //   width: 120,
  //   responsive: ['lg'],
  //   render: (condition) => {
  //     return condition ?? '-';
  //   },
  // },
  {
    title: 'Currnt Amount',
    dataIndex: ['current', 'amount'],
    key: 'current_amount',
    width: 120,
    responsive: ['lg'],
    render: (current_amount) => {
      const options = {
        locale: 'id-ID',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        style: 'currency',
      };
      return formatCurrency(current_amount, options) ?? '-';
    },
  },
  // {
  //   title: 'Status',
  //   dataIndex: 'status',
  //   key: 'status',
  //   width: 100,
  //   render: (status) => {
  //     return renderTags(status, {
  //       tags: [status],
  //       color: STATUS_COLORS[status] || 'default',
  //     });
  //   },
  // },
  {
    title: '',
    dataIndex: '',
    key: 'x',
    align: 'right',
    width: 50,
    render: (_, record) => (
      <AssignmentContextMenuOption
        editPath={`/assets-management/assignments/edit/${record.id}`}
        detailPath={`/assets-management/assignments/detail/${record.id}`}
        // deletePath={`/assets-management/assignments/delete/${record.id}`}
        transferPath={`/assets-management/assignments/transfer/${record.id}`}
      >
        <Button
          variant="text"
          type="text"
          shape="circle"
          icon={<MoreVertical size={12} />}
          size={'middle'}
        />
      </AssignmentContextMenuOption>
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
