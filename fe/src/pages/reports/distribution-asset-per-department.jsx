import { Card, Table, Typography, Tag, Space, Button } from 'antd';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Api from '@/utils/axios/api';

const { Title } = Typography;

// Function untuk sanitasi HTML sederhana (tanpa library eksternal)
const sanitizeHTML = (html) => {
  if (!html) return '';

  // Remove potentially dangerous scripts and events
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '') // Remove link tags
    .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '') // Remove meta tags
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers like onclick, onload, etc.
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/vbscript:/gi, '') // Remove vbscript: protocols
    .replace(/data:/gi, '') // Remove data: protocols
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '') // Remove form tags
    .replace(/<input\b[^<]*(?:(?!<\/input>)<[^<]*)*<\/input>/gi, '') // Remove input tags
    .replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '') // Remove button tags
    .replace(/<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi, '') // Remove select tags
    .replace(/<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi, ''); // Remove textarea tags

  return sanitized;
};

// Function untuk menampilkan HTML dengan aman
const SafeHTMLDisplay = ({ htmlContent, className = '' }) => {
  if (!htmlContent) return null;

  // Sanitasi HTML untuk mencegah XSS attacks
  const sanitizedHTML = sanitizeHTML(htmlContent);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      style={{
        maxWidth: '100%',
        overflow: 'auto',
        wordWrap: 'break-word',
      }}
    />
  );
};

// Function untuk fetch data report
const fetchReport = async ({ branchIds, departmentIds }) => {
  try {
    const params = {};

    if (branchIds) {
      params['branch.id'] = branchIds;
    }

    if (departmentIds) {
      params['department.id'] = departmentIds;
    }

    const response = await Api().get(
      '/api/v1/reports/distribution_assets_per_departments',
      {
        params,
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching distribution report:', error);
    throw error;
  }
};

const DistributionAssetPerDepartment = () => {
  const [searchParams] = useSearchParams();

  // Ambil parameter filter dari URL
  const branchIds = searchParams.get('branch.id');
  const departmentIds = searchParams.get('department.id');
  const categoryIds = searchParams.get('category.id');

  // Data fetching menggunakan useQuery dari TanStack React Query
  const {
    data: initialData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'reports',
      'distribution_assets_per_departments',
      branchIds,
      departmentIds,
      categoryIds,
    ],
    queryFn: () => fetchReport({ branchIds, departmentIds }),
    staleTime: 5 * 60 * 1000, // Data dianggap fresh selama 5 menit
    cacheTime: 10 * 60 * 1000, // Data di-cache selama 10 menit
  });
  console.log('INIII DISTRIBUTION ASSET PER DEPARTMENT =>', initialData);

  // Check jika response adalah HTML string
  const isHTMLResponse =
    typeof initialData === 'string' && initialData.includes('<');

  // Transform data untuk tabel (jika bukan HTML)
  const data = !isHTMLResponse
    ? initialData?.results?.list || initialData?.data || initialData || []
    : [];

  const columns = [
    {
      title: 'Departemen',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Tipe Asset',
      dataIndex: 'assetType',
      key: 'assetType',
    },
    {
      title: 'Total Asset',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: 'Asset Terassign',
      dataIndex: 'assignedAssets',
      key: 'assignedAssets',
      render: (value) => <Tag color="green">{value}</Tag>,
    },
    {
      title: 'Asset Belum Terassign',
      dataIndex: 'unassignedAssets',
      key: 'unassignedAssets',
      render: (value) => <Tag color="orange">{value}</Tag>,
    },
    {
      title: 'Total Nilai (Rp)',
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (value) => value.toLocaleString('id-ID'),
    },
  ];

  const handleExport = () => {
    // Implementasi export ke Excel/PDF
    console.log('Export data:', data);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={2}>Distribution Asset Per Department</Title>
        <Space>
          <Button type="primary" onClick={handleExport}>
            Export Report
          </Button>
        </Space>
      </div>

      {/* Tampilkan filter yang aktif */}
      {(branchIds || departmentIds) && (
        <Card style={{ marginBottom: 16 }}>
          <Title level={4}>Filter Aktif:</Title>
          <Space wrap>
            {branchIds && <Tag color="blue">Branch ID: {branchIds}</Tag>}
            {departmentIds && (
              <Tag color="green">Department ID: {departmentIds}</Tag>
            )}
            {categoryIds && (
              <Tag color="purple">Category ID: {categoryIds}</Tag>
            )}
          </Space>
        </Card>
      )}

      <Card>
        {isHTMLResponse ? (
          // Tampilkan HTML response dengan aman
          <SafeHTMLDisplay
            htmlContent={initialData}
            className="report-html-content"
          />
        ) : (
          // Tampilkan tabel jika response adalah data JSON
          <Table
            columns={columns}
            dataSource={data}
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} dari ${total} data`,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default DistributionAssetPerDepartment;
