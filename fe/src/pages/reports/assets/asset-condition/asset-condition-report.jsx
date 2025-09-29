import Api from '@/utils/axios/api';
import SafeInnerHTMLDisplay from '@/utils/sanitizeInnerHTML';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Space, Table, Tag, Typography } from 'antd';
import { useSearchParams } from 'react-router';

const { Title } = Typography;

// Function untuk fetch data report
const fetchReport = async (filters) => {
  try {
    const params = {};

    if (filters.categoryId) {
      params['category.id'] = filters.categoryId;
    }

    if (filters.departmentId) {
      params['department.id'] = filters.departmentId;
    }

    if (filters.branchId) {
      params['branch.id'] = filters.branchId;
    }

    if (filters.conditionId) {
      params['condition.id'] = filters.conditionId;
    }

    if (filters.jobPositionId) {
      params['job_position.id'] = filters.jobPositionId;
    }

    if (filters.employeeId) {
      params['employee.id'] = filters.employeeId;
    }

    const response = await Api().get('/api/v1/reports/asset_conditions', {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching asset condition report:', error);
    throw error;
  }
};

const AssetConditionReport = () => {
  const [searchParams] = useSearchParams();

  // Ambil parameter filter dari URL
  const categoryId = searchParams.get('category.id');
  const departmentId = searchParams.get('department.id');
  const branchId = searchParams.get('branch.id');
  const conditionId = searchParams.get('condition.id');
  const jobPositionId = searchParams.get('job_position.id');
  const employeeId = searchParams.get('employee.id');

  // Data fetching menggunakan useQuery dari TanStack React Query
  const {
    data: initialData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'reports',
      'asset_conditions',
      categoryId,
      departmentId,
      branchId,
      conditionId,
      jobPositionId,
      employeeId,
    ],
    queryFn: () =>
      fetchReport({
        categoryId,
        departmentId,
        branchId,
        conditionId,
        jobPositionId,
        employeeId,
      }),
    staleTime: 5 * 60 * 1000, // Data dianggap fresh selama 5 menit
    cacheTime: 10 * 60 * 1000, // Data di-cache selama 10 menit
  });
  console.log('INIII ASSET CONDITION REPORT =>', initialData);

  // Check jika response adalah HTML string
  const isHTMLResponse =
    typeof initialData === 'string' && initialData.includes('<');

  // Transform data untuk tabel (jika bukan HTML)
  const data = !isHTMLResponse
    ? initialData?.results?.list || initialData?.data || initialData || []
    : [];

  const handleExport = () => {
    // Implementasi export ke Excel/PDF
    console.log('Export data:', data);
  };

  const columns = [
    {
      title: 'Asset Name',
      dataIndex: 'assetName',
      key: 'assetName',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      render: (condition) => {
        const colorMap = {
          Good: 'green',
          Fair: 'orange',
          Poor: 'red',
          Damaged: 'red',
          Lost: 'red',
        };

        return <Tag color={colorMap[condition] || 'default'}>{condition}</Tag>;
      },
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
    },
    {
      title: 'Job Position',
      dataIndex: 'jobPosition',
      key: 'jobPosition',
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
    },
  ];

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
        <Title level={2}>Asset Condition Report</Title>
        <Space>
          <Button type="primary" onClick={handleExport}>
            Export Report
          </Button>
        </Space>
      </div>

      {/* Tampilkan filter yang aktif */}
      {(categoryId ||
        departmentId ||
        branchId ||
        conditionId ||
        jobPositionId ||
        employeeId) && (
        <Card style={{ marginBottom: 16 }}>
          <Title level={4}>Filter Aktif:</Title>
          <Space wrap>
            {categoryId && <Tag color="blue">Category ID: {categoryId}</Tag>}
            {departmentId && (
              <Tag color="green">Department ID: {departmentId}</Tag>
            )}
            {branchId && <Tag color="orange">Branch ID: {branchId}</Tag>}
            {conditionId && (
              <Tag color="purple">Condition ID: {conditionId}</Tag>
            )}
            {jobPositionId && (
              <Tag color="cyan">Job Position ID: {jobPositionId}</Tag>
            )}
            {employeeId && <Tag color="magenta">Employee ID: {employeeId}</Tag>}
          </Space>
        </Card>
      )}

      <Card>
        {isHTMLResponse ? (
          // Tampilkan HTML response dengan aman
          <SafeInnerHTMLDisplay
            htmlContent={initialData}
            classNameWrapper="report-html-content"
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

export default AssetConditionReport;
