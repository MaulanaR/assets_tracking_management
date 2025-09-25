import { setGlobalNotificationApi } from '@/utils/globalNotification';
import { App as AntdApp, ConfigProvider } from 'antd';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import enUS from 'antd/locale/en_US';

import router from './routes/index.jsx';

// Component to initialize global notification API
function AppWithNotification() {
  const { notification } = AntdApp.useApp();

  useEffect(() => {
    // Initialize global notification API
    setGlobalNotificationApi(notification);
  }, [notification]);

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AntdApp>
        <AppWithNotification />
      </AntdApp>
    </ConfigProvider>
  );
}
