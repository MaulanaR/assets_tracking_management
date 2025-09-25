import { Box } from 'lucide-react';
import { CircleDollarSign } from 'lucide-react';

const SummaryOverview = () => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg shadow-2xs">
        <div className="flex items-center space-x-4">
          <Box size={24} className="text-blue-500" />
          <div>
            <p className="text-gray-700 font-bold">Departments</p>
          </div>
        </div>
        <p className="text-blue-500 font-bold">50</p>
      </div>

      <div className="flex justify-between items-center p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg shadow-2xs">
        <div className="flex items-center space-x-4">
          <Box size={24} className="text-blue-500" />
          <div>
            <p className="text-gray-700 font-bold">Branches</p>
          </div>
        </div>
        <p className="text-blue-500 font-bold">50</p>
      </div>

      <div className="flex justify-between items-center p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg shadow-2xs">
        <div className="flex items-center space-x-4">
          <Box size={24} className="text-blue-500" />
          <div>
            <p className="text-gray-700 font-bold">Employees</p>
          </div>
        </div>
        <p className="text-blue-500 font-bold">50</p>
      </div>

      <div className="flex justify-between items-center p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg shadow-2xs">
        <div className="flex items-center space-x-4">
          <Box size={24} className="text-blue-500" />
          <div>
            <p className="text-gray-700 font-bold">Available Assets</p>
          </div>
        </div>
        <p className="text-blue-500 font-bold">50</p>
      </div>

      <div className="flex justify-between items-center p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg shadow-2xs">
        <div className="flex items-center space-x-4">
          <Box size={24} className="text-blue-500" />
          <div>
            <p className="text-gray-700 font-bold">Unavailable Assets</p>
          </div>
        </div>
        <p className="text-blue-500 font-bold">50</p>
      </div>
    </div>
  );
};

export default SummaryOverview;
