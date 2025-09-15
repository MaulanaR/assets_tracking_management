import { ENV } from '@/config/env';
import { LoginFormSchema } from '@/schema';
import {
  FacebookOutlined,
  GithubOutlined,
  GoogleOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router';

const { Text, Title } = Typography;

// Constants
const DEFAULT_CREDENTIALS = {
  email: 'test@mailinator.com',
  password: '123123',
};

export default function LoginFormComponent({ onSubmit, isLoading }) {
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
    <div>
    <Title level={4} style={{marginBottom: 2}}>Sign in to your account</Title>
    <Text type="secondary" className="text-xs">
      Use your email and password to log in. ({ENV.VITE_APP_ENV})
    </Text>
    <LoginForm
      // title={ENV.VITE_APP_NAME}
      // subTitle="Sign in to your account"
      onFinish={handleSubmit(onSubmit)}
      containerStyle={{
        height: 'auto',
        paddingInline: 0
      }}
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
                <Text className="text-xs" type="danger">
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
                <Text className="text-xs" type="danger">
                  {errors.password.message}
                </Text>
              )
            }
          />
        )}
      />
      <SignUpPrompt />
    </LoginForm>
    </div>
  );
}
