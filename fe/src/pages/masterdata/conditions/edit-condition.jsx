import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { ConditionFormSchema } from './constant';
import Forms from './forms';

const EditCondition = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = `/api/v1/conditions/${id}`;

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['conditions', endpoints],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing conditions
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Condition Updated',
        description: 'Condition has been successfully updated.',
        duration: 3,
      });
      navigate('/masterdata/conditions');
    },
    onError: (err) => {
      notification.success({
        message: 'Condition Update Failed',
        description: err.message || 'Failed to update conditions.',
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
    resolver: zodResolver(ConditionFormSchema),
    defaultValues: {
      code: '',
      name: '',
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
              title: 'Datastore',
              onClick: () => navigate('/masterdata'),
            },
            {
              title: 'Conditions',
              onClick: () => navigate('/masterdata/conditions'),
            },
            {
              title: 'Edit Condition',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Edit Condition"
        control={control}
        isLoading={isLoading}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default EditCondition;
