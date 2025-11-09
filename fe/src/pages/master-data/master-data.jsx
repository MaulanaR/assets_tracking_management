import { Card, Col, Row, Typography } from 'antd';
import { LibraryBig } from 'lucide-react';
import { Box, Building, Building2, PackageX, Users, Wrench } from 'lucide-react';

import { useNavigate } from 'react-router';

const { Title } = Typography;

const MasterData = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Branches',
      icon: <Building2 size={24} />,
      path: '/master-data/branches/list',
    },
    {
      title: 'Departments',
      icon: <Building size={24} />,
      path: '/master-data/departments/list',
    },
    {
      title: 'Employees',
      icon: <Users size={24} />,
      path: '/master-data/employees/list',
    },
    {
      title: 'Categories',
      icon: <LibraryBig size={24} />,
      path: '/master-data/categories/list',
    },
    {
      title: 'Maintenance Types',
      icon: <Wrench size={24} />,
      path: '/master-data/maintenance-types/list',
    },
    {
      title: 'Asset Maintenance',
      icon: <Wrench size={24} />,
      path: '/master-data/maintenance-assets/list',
    },
    {
      title: 'Conditions',
      icon: <PackageX size={24} />,
      path: '/master-data/conditions/list',
    },
    {
      title: 'Assets',
      icon: <Box size={24} />,
      path: '/master-data/assets/list',
    },
  ];

  return (
    <div>
      <Title level={2}>Master Data</Title>
      <Row gutter={[16, 16]}>
        {menuItems.map((item) => (
          <Col xs={24} sm={12} md={6} key={item.title}>
            <Card
              hoverable
              style={{
                borderRadius: '8px',
                textAlign: 'center',
                transition: 'all 0.3s',
              }}
              onClick={() => navigate(item.path)}
              className="hover:shadow-lg"
            >
              <div className="flex justify-center items-center p-4">
                {item.icon}
              </div>
              <Title level={4}>{item.title}</Title>
              <p className="text-gray-500 text-sm mt-2">
                Manage your {item.title.toLowerCase()} information
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MasterData;
