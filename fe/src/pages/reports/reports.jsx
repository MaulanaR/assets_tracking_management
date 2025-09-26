import { Card, List, Typography } from 'antd';
import { useNavigate } from 'react-router';

const { Title } = Typography;

const Reports = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Distribution Asset Per Department',
      path: '/reports/filter-distribution-asset',
      description: 'Distribution asset per department reports',
    },
    {
      title: 'Payable Reports',
      path: '/reports/payable',
      description: 'Supplier payments and outstanding payables',
    },
  ];

  return (
    <div>
      <Title level={2}>Reports</Title>
      <Card>
        <List
          dataSource={menuItems}
          size="small"
          renderItem={(item) => (
            <List.Item
              onClick={() => navigate(item.path)}
              style={{
                cursor: 'pointer',
              }}
              className="hover:bg-gray-50"
            >
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Reports;
