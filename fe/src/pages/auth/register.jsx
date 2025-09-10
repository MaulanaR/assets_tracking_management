import { ENV, logger } from '@/config/env';
import { RegisterFormSchema } from '@/schema';
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
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Typography } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';

const { Text } = Typography;

// Constants
const DEFAULT_CREDENTIALS = {
  username: ENV.IS_LOCAL ? 'testuser' : '',
  email: ENV.IS_LOCAL ? 'test@mailinator.com' : '',
  password: ENV.IS_LOCAL ? '12345678' : '',
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
  const { register, isAuthenticated, isLoading } = useAuthStore();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: DEFAULT_CREDENTIALS,
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
      const result = await register(data.username, data.email, data.password);

      if (result.success) {
        showSuccessNotification({
          message: 'Registration Successful',
          description:
            result.message || 'Account created successfully! Please login.',
          duration: 3,
        });

        navigate('/auth/login');
      } else {
        showErrorNotification({
          message: 'Registration Failed',
          description: result.error,
        });
      }
    } catch (error) {
      logger.error('Registration submission error:', error);
      showErrorNotification({
        message: 'Registration Failed',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  // Components
  const SocialLoginActions = () => (
    <div className="flex flex-col items-center gap-1">
      <Text type="secondary">Or sign up with</Text>
      <div className="flex gap-4">
        <GoogleOutlined className="p-1 text-2xl text-gray-700 cursor-pointer hover:text-red-500 transition-colors" />
        <GithubOutlined className="p-1 text-2xl text-gray-700 cursor-pointer hover:text-gray-900 transition-colors" />
        <FacebookOutlined className="p-1 text-2xl text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" />
      </div>
    </div>
  );

  const SignInPrompt = () => (
    <div className="text-center py-2">
      <Text type="secondary" className="text-xs">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-blue-600 hover:text-blue-800">
          Sign In
        </Link>
      </Text>
    </div>
  );

  return (
    <div style={CONTAINER_STYLES}>
      <Card>
        <LoginForm
          title={ENV.VITE_APP_NAME}
          subTitle="Create your account"
          onFinish={handleSubmit(onSubmit)}
          submitter={{
            submitButtonProps: {
              disabled: isSubmitting || isLoading,
              loading: isSubmitting || isLoading,
            },
            searchConfig: {
              submitText: 'Sign Up',
            },
          }}
          actions={<SocialLoginActions />}
        >
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <ProFormText
                {...field}
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className="prefixIcon" />,
                }}
                placeholder="Username (min 3 characters)"
                validateStatus={errors.username && 'error'}
                extra={
                  errors?.username?.message && (
                    <Text className="text-xs text-red-500">
                      {errors.username.message}
                    </Text>
                  )
                }
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <ProFormText
                {...field}
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className="prefixIcon" />,
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
                placeholder="Password (min 8 characters)"
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
          <SignInPrompt />
        </LoginForm>
      </Card>
    </div>
  );
};
