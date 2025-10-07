import { formatCurrency } from '@/utils/globalFunction';
import { Card } from 'antd';
import { Alert, Spin } from 'antd';
import { ChevronRight, TrendingDown } from 'lucide-react';
import { Link } from 'react-router';

const TotalAssetDepreciationWidget = ({
  value = 0,
  isLoading = false,
  isError = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center items-center h-32">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <Alert
          message="Error"
          description="Failed to load total asset depreciation value"
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <TrendingDown size={20} className="text-orange-500" />
          <h3 className="font-medium text-gray-500">
            Total Asset Depreciation Value
          </h3>
        </div>
        <span className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-full">
          Depreciation
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-800 mb-4">
        {formatCurrency(value, {
          locale: 'id-ID',
          currency: 'IDR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          style: 'currency',
        })}
      </p>
      <Link
        to="/master-data/assets"
        className="flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
      >
        View details
        <ChevronRight size={16} />
      </Link>
    </Card>
  );
};

export default TotalAssetDepreciationWidget;
