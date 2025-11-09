import { useDataQuery } from '@/utils/hooks/useDataQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { MaintenanceTypeFormSchema } from './constant';
import Forms from './forms-maintenance-type';

const CreateMaintenanceType = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(MaintenanceTypeFormSchema),
    defaultValues: {
      code: null,
      name: null,
      description: null,
      is_active: true,
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
  });

  const endpoints = '/api/v1/maintenance_types';

  const { isSubmitting, submit } = useDataQuery({
    queryKey: ['maintenance_types'],
    getUrl: endpoints,
    method: 'POST',
    queryOptions: {
      enabled: false, // Disable initial fetch
    },
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Maintenance Type Created',
        description: 'Maintenance Type has been successfully created.',
        duration: 3,
      });
      navigate('/master-data/maintenance-types');
    },
    onError: (err) => {
      notification.success({
        message: 'Maintenance Type Creation Failed',
        description: err.message || 'Failed to create maintenance type.',
        duration: 3,
      });
    },
    filters: {
      ['$per_page']: 10,
      ['$page']: 1,
    },
  });

  const onSubmit = (data) => {
    submit(data);
  };

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
              title: 'Add Maintenance Type',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Create Maintenance Type"
        control={control}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default CreateMaintenanceType;