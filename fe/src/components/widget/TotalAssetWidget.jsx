import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { theme, Grid } from 'antd';
import { useState, useEffect } from 'react';

const { useToken } = theme;
const { useBreakpoint } = Grid;

// Define colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const data = [
  { name: 'Laptop', value: 10 },
  { name: 'Motor', value: 25 },
  { name: 'Mobil L300', value: 20 },
];

// Label renderer function
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {value}
    </text>
  );
};

const TotalAssetWidget = () => {
  const { token } = useToken();
  const screens = useBreakpoint();

  const isSmallScreen = screens.xs;
  const isMediumScreen = screens.sm || screens.md;

  // Responsive configuration function
  const getResponsiveConfig = () => {
    if (isSmallScreen) {
      return {
        outerRadius: 60,
        innerRadius: 30,
        showLabels: false,
        legendLayout: 'horizontal',
        legendAlign: 'center',
      };
    } else if (isMediumScreen) {
      return {
        outerRadius: 110,
        innerRadius: 70,
        showLabels: true,
        legendLayout: 'horizontal',
        legendAlign: 'center',
      };
    } else {
      return {
        outerRadius: 150,
        innerRadius: 90,
        showLabels: true,
        legendLayout: 'horizontal',
        legendAlign: 'center',
      };
    }
  };

  const config = getResponsiveConfig();
  const totalAssets = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className={`
        w-full 
        ${isSmallScreen ? 'h-80 p-2' : isMediumScreen ? 'h-96 p-4' : 'h-[450px] p-6'}
      `}
      style={{ backgroundColor: token.colorBgContainer }}
    >
      <div className="relative w-full h-[calc(100%-50px)]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={config.showLabels ? renderLabel : false}
              outerRadius={config.outerRadius}
              innerRadius={config.innerRadius}
              fill="#8884d8"
              dataKey="value"
              stroke={token.colorBgContainer}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => {
                const percentage = ((value / totalAssets) * 100).toFixed(1);
                return [`${value} items (${percentage}%)`, `${name}`];
              }}
              wrapperStyle={{ zIndex: 1000 }}
              contentStyle={{
                backgroundColor: token.colorBgContainer,
                border: `1px solid ${token.colorBorder}`,
                borderRadius: token.borderRadius,
                color: token.colorText,
                fontSize: isSmallScreen ? '12px' : '14px',
              }}
            />
            <Legend
              layout={config.legendLayout}
              align={config.legendAlign}
              wrapperStyle={{
                paddingTop: isSmallScreen ? '10px' : '20px',
                fontSize: isSmallScreen ? '12px' : '14px',
                color: token.colorText,
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Summary di tengah donut */}
        <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div
            className={`${isSmallScreen ? 'text-sm' : 'text-base'} font-semibold`}
            style={{ color: token.colorTextSecondary }}
          >
            Total Assets
          </div>
          <div
            className={`${isSmallScreen ? 'text-lg' : isMediumScreen ? 'text-xl' : 'text-2xl'} font-bold`}
            style={{ color: token.colorPrimary }}
          >
            {totalAssets.toLocaleString()}
          </div>
          {!isSmallScreen && (
            <div
              className="text-xs mt-1"
              style={{ color: token.colorTextTertiary }}
            >
              Items
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalAssetWidget;
