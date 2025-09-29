import { Alert, Spin } from 'antd';
import { Building2, PackageCheck, PackageX, Users } from 'lucide-react';

const SummaryOverview = ({ summary, isLoading, isError }) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center items-center h-32">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex flex-col space-y-4">
        <Alert
          message="Error"
          description="Gagal memuat data summary"
          type="error"
          showIcon
        />
      </div>
    );
  }

  const summaryItems = [
    {
      title: 'Departments',
      value: summary?.departments || 0,
      icon: Building2,
      color: 'blue',
      bgColor: 'from-sky-50 to-blue-50',
      textColor: 'text-blue-500',
    },
    {
      title: 'Branches',
      value: summary?.branches || 0,
      icon: Building2,
      color: 'blue',
      bgColor: 'from-sky-50 to-blue-50',
      textColor: 'text-blue-500',
    },
    {
      title: 'Employees',
      value: summary?.employees || 0,
      icon: Users,
      color: 'blue',
      bgColor: 'from-sky-50 to-blue-50',
      textColor: 'text-blue-500',
    },
    {
      title: 'Available Assets',
      value: summary?.availableAssets || 0,
      icon: PackageCheck,
      color: 'blue',
      bgColor: 'from-sky-50 to-blue-50',
      textColor: 'text-blue-500',
    },
    {
      title: 'Unavailable Assets',
      value: summary?.unavailableAssets || 0,
      icon: PackageX,
      color: 'blue',
      bgColor: 'from-sky-50 to-blue-50',
      textColor: 'text-blue-500',
    },
  ];

  return (
    <div className="flex flex-col space-y-4">
      {summaryItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className={`flex justify-between items-center p-4 bg-gradient-to-br ${item.bgColor} rounded-lg shadow-2xs hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-center space-x-4">
              <IconComponent size={24} className={item.textColor} />
              <div>
                <p className="text-gray-700 font-bold">{item.title}</p>
              </div>
            </div>
            <p className="text-gray-700 font-bold">
              {item.value.toLocaleString('id-ID')}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryOverview;
