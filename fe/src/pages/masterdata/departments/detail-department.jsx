import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { DepartmentFormSchema } from './constant';
import Forms from './forms';

const DetailDepartment = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints =
    id && typeof id === 'string' && id.trim() !== ''
      ? `/api/v1/departments/${id}`
      : '/api/v1/departments';

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['departments'],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing departments
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Department Updated',
        description: 'Department has been successfully updated.',
        duration: 3,
      });
      navigate('/masterdata/departments');
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
    resolver: zodResolver(DepartmentFormSchema),
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
              title: 'Datastore',
              onClick: () => navigate('/masterdata'),
            },
            {
              title: 'Departments',
              onClick: () => navigate('/masterdata/departments'),
            },
            {
              title: 'Detail Department',
            },
          ]}
        />
      </Flex>

      <Forms
        title={'Detail Department'}
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

export default DetailDepartment;