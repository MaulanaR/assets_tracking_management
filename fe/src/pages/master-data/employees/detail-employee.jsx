import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { EmployeeFormSchema } from './constant';
import Forms from './forms';

const DetailEmployee = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints =
    id && typeof id === 'string' && id.trim() !== ''
      ? `/api/v1/employees/${id}`
      : '/api/v1/employees';

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['employees'],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing employe
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Employee Updated',
        description: 'Employee has been successfully updated.',
        duration: 3,
      });
      navigate('/master-data/employees');
    },
    onError: (err) => {
      notification.success({
        message: 'Contact Update Failed',
        description: err.message || 'Failed to update contact.',
        duration: 3,
      });
    },
  });

  const {
    // register,
    handleSubmit,
    // getValues,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmployeeFormSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData?.results?.code || '',
        name: initialData?.results?.name || '',
        email: initialData?.results?.email || '',
        position: initialData?.results?.position || '',
        contact_type: initialData?.results?.type || '',
        address: initialData?.results?.address || '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data) => {
    submit(data);
  };

  if (isLoading) {
    return <ProSkeleton type="descriptions" />;
  }

  return (
    <Flex gap={'large'} vertical>
      <Flex justify="space-between" align="center">
        <Breadcrumb
          separator=">"
          style={{
            cursor: 'pointer',
          }}
          items={[
            {
              title: 'Master Data',
              onClick: () => navigate('/master-data'),
            },
            {
              title: 'Employees',
              onClick: () => navigate('/master-data/employees'),
            },
            {
              title: 'Detail Employee',
            },
          ]}
        />
      </Flex>

      <Forms
        title={'Detail Employee'}
        control={control}
        isLoading={isLoading}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
        isDetail={true}
      />
    </Flex>
  );
};

export default DetailEmployee;
