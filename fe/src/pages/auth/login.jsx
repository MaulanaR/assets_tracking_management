import { ENV, logger } from '@/config/env';
import { LoginFormSchema } from '@/schema';
import { useAuthStore } from '@/stores';
import {
  showErrorNotification,
  showSuccessNotification,
} from '@/utils/globalNotification';
import {
  FacebookOutlined,
  GithubOutlined,
  GoogleOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';

const { Text } = Typography;

// Constants
const DEFAULT_CREDENTIALS = {
  email: 'test@mailinator.com',
  password: '123123',
};

const CONTAINER_STYLES = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
};

export default () => {
  // Log environment info
  logger.log(`Running in ${ENV.VITE_APP_ENV} mode`);
  logger.log(`API URL: ${ENV.VITE_API_BASE_URL}`);

  const navigate = useNavigate();
  const location = useLocation();

  // Zustand store
  const { login, isAuthenticated, isLoading } = useAuthStore();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: ENV.IS_LOCAL
      ? DEFAULT_CREDENTIALS
      : { email: '', password: '' },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        showSuccessNotification({
          message: 'Login Successful',
          description: 'Welcome back! Redirecting to dashboard.',
          duration: 3,
        });

        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        showErrorNotification({
          message: 'Login Failed',
          description: result.error,
        });
      }
    } catch (error) {
      logger.error('Login submission error:', error);
      showErrorNotification({
        message: 'Login Failed',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  // Components
  const SocialLoginActions = () => (
    <div className="flex flex-col items-center gap-1">
      <Text type="secondary">Or sign in with</Text>
      <div className="flex gap-4">
        <GoogleOutlined className="p-1 text-2xl text-gray-700 cursor-pointer transition-colors" />
        <GithubOutlined className="p-1 text-2xl text-gray-700 cursor-pointer transition-colors" />
        <FacebookOutlined className="p-1 text-2xl text-gray-700 cursor-pointer transition-colors" />
      </div>
    </div>
  );

  const SignUpPrompt = () => (
    <div className="text-center py-2">
      <Text type="secondary" className="text-xs">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-blue-600 hover:text-blue-800">
          Sign Up
        </Link>
      </Text>
    </div>
  );

  return (
    <div style={CONTAINER_STYLES}>
      <Card>
        <LoginForm
          title={ENV.VITE_APP_NAME}
          subTitle="Sign in to your account"
          onFinish={handleSubmit(onSubmit)}
          submitter={{
            submitButtonProps: {
              disabled: isSubmitting || isLoading,
              loading: isSubmitting || isLoading,
            },
            searchConfig: {
              submitText: 'Sign In',
            },
          }}
          actions={<SocialLoginActions />}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <ProFormText
                {...field}
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className="prefixIcon" />,
                }}
                placeholder="Email"
                validateStatus={errors.email && 'error'}
                extra={
                  errors?.email?.message && (
                    <Text className="text-xs text-red-500">
                      {errors.email.message}
                    </Text>
                  )
                }
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <ProFormText.Password
                {...field}
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className="prefixIcon" />,
                }}
                placeholder="Password"
                validateStatus={errors.password && 'error'}
                extra={
                  errors?.password?.message && (
                    <Text className="text-xs text-red-500">
                      {errors.password.message}
                    </Text>
                  )
                }
              />
            )}
          />
          <SignUpPrompt />
        </LoginForm>
      </Card>
    </div>
  );
};
