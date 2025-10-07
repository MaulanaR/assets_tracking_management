import { formatCurrency } from '@/utils/globalFunction';
import { Card } from 'antd';
import { Alert, Spin } from 'antd';
import { Calculator, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

const TotalAssetEconomicValueWidget = ({
  totalAssetValue = 0,
  totalAssetDepreciation = 0,
  isLoading = false,
  isError = false,
}) => {
  const calculateEconomicValue = () => {
    const totalValue = totalAssetValue || 0;
    const totalDepreciation = totalAssetDepreciation || 0;
    return totalValue - totalDepreciation;
  };

  const economicValue = calculateEconomicValue();

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
          description="Failed to load total economic value data"
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
          <Calculator size={20} className="text-blue-500" />
          <h3 className="font-medium text-gray-500">Total Economic Value</h3>
        </div>
        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
          Economic
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-800 mb-4">
        {formatCurrency(economicValue, {
          locale: 'id-ID',
          currency: 'IDR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          style: 'currency',
        })}
      </p>
      <Link
        to="/master-data/assets"
        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        View details
        <ChevronRight size={16} />
      </Link>
    </Card>
  );
};

export default TotalAssetEconomicValueWidget;
