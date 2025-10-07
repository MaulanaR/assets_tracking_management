import { formatCurrency } from '@/utils/globalFunction';
import { Card } from 'antd';
import { Alert, Spin } from 'antd';
import { ChevronRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router';

const TotalAssetValueWidget = ({
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
          description="Failed to load total asset value data"
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
          <DollarSign size={20} className="text-emerald-500" />
          <h3 className="font-medium text-gray-500">
            Total Asset Acquisition Value
          </h3>
        </div>
        <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
          Acquisition
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
        className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        View details
        <ChevronRight size={16} />
      </Link>
    </Card>
  );
};

export default TotalAssetValueWidget;
