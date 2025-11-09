import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { MaintenanceTypeFormSchema } from './constant';
import Forms from './forms-maintenance-type';

const DetailMaintenanceType = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints =
    id && typeof id === 'string' && id.trim() !== ''
      ? `/api/v1/maintenance_types/${id}`
      : '/api/v1/maintenance_types';

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['maintenance_types'],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for consistency with detail view pattern
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Maintenance Type Updated',
        description: 'Maintenance Type has been successfully updated.',
        duration: 3,
      });
      navigate('/master-data/maintenance-types');
    },
    onError: (err) => {
      notification.success({
        message: 'Maintenance Type Update Failed',
        description: err.message || 'Failed to update maintenance type.',
        duration: 3,
      });
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(MaintenanceTypeFormSchema),
    defaultValues: {
      code: null,
      name: null,
      description: null,
      is_active: true,
      created_at: null,
      updated_at: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData?.results?.code || '',
        name: initialData?.results?.name || '',
        description: initialData?.results?.description || '',
        is_active: Boolean(initialData?.results?.is_active),
        created_at: initialData?.results?.created_at || null,
        updated_at: initialData?.results?.updated_at || null,
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
              title: 'Maintenance Types',
              onClick: () => navigate('/master-data/maintenance-types'),
            },
            {
              title: 'Detail Maintenance Type',
            },
          ]}
        />
      </Flex>

      <Forms
        title={'Detail Maintenance Type'}
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

export default DetailMaintenanceType;