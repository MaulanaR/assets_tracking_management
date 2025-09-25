import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { DepartmentFormSchema } from './constant';
import Forms from './forms-department';

const EditDepartment = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = `/api/v1/departments/${id}`;

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['departments', endpoints],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing departments
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Department Updated',
        description: 'Department has been successfully updated.',
        duration: 3,
      });
      navigate('/master-data/departments');
    },
    onError: (err) => {
      notification.success({
        message: 'Department Update Failed',
        description: err.message || 'Failed to update departments.',
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
      code: null,
      name: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      const { code, name } = initialData?.results || {};
      reset({
        code: code || '',
        name: name || '',
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
              title: 'Departments',
              onClick: () => navigate('/master-data/departments'),
            },
            {
              title: 'Edit Department',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Edit Department"
        control={control}
        isLoading={isLoading}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default EditDepartment;
