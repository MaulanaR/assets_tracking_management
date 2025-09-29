import { Alert, Card, Col, Row, Spin } from 'antd';
import {
  Building2,
  Package,
  PackageCheck,
  PackageX,
  TrendingUp,
  Users,
} from 'lucide-react';

const DashboardSummaryWidget = ({ summary, isLoading, isError }) => {
  if (isLoading) {
    return (
      <Card title="Dashboard Summary" className="h-full">
        <div className="flex justify-center items-center h-32">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card title="Dashboard Summary" className="h-full">
        <Alert
          message="Error"
          description="Gagal memuat data summary dashboard"
          type="error"
          showIcon
        />
      </Card>
    );
  }

  const summaryItems = [
    {
      title: 'Total Departments',
      value: summary?.departments || 0,
      icon: Building2,
      color: 'blue',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Total Branches',
      value: summary?.branches || 0,
      icon: Building2,
      color: 'green',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-600',
      iconColor: 'text-green-500',
    },
    {
      title: 'Total Employees',
      value: summary?.employees || 0,
      icon: Users,
      color: 'purple',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Available Assets',
      value: summary?.availableAssets || 0,
      icon: PackageCheck,
      color: 'emerald',
      bgColor: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-600',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Unavailable Assets',
      value: summary?.unavailableAssets || 0,
      icon: PackageX,
      color: 'red',
      bgColor: 'from-red-50 to-red-100',
      textColor: 'text-red-600',
      iconColor: 'text-red-500',
    },
    {
      title: 'Total Assets',
      value: summary?.totalAssets || 0,
      icon: Package,
      color: 'indigo',
      bgColor: 'from-indigo-50 to-indigo-100',
      textColor: 'text-indigo-600',
      iconColor: 'text-indigo-500',
    },
  ];

  return (
    <Card title="Dashboard Summary" className="h-full">
      <Row gutter={[16, 16]}>
        {summaryItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
              <div
                className={`bg-gradient-to-br ${item.bgColor} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between mb-4">
                  <IconComponent size={24} className={item.iconColor} />
                  <TrendingUp
                    size={16}
                    className={`${item.iconColor} opacity-70`}
                  />
                </div>
                <div>
                  <p className={`font-medium ${item.textColor} mb-2`}>
                    {item.title}
                  </p>
                  <p className={`text-3xl font-bold ${item.textColor}`}>
                    {item.value.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default DashboardSummaryWidget;
