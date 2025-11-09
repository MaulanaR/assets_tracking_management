import { useDataQuery } from '@/utils/hooks/useDataQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { MaintenanceAssetFormSchema } from './constant';
import Forms from './forms-maintenance-asset';

const CreateMaintenanceAsset = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(MaintenanceAssetFormSchema),
    defaultValues: {
      date: moment().format('YYYY-MM-DD'),
      code: null,
      description: null,
      amount: 0,
      asset: null,
      employee: null,
      maintenance_type: null,
      attachment: [],
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
    },
  });

  const endpoints = '/api/v1/maintenance_assets';

  const { isSubmitting, submit } = useDataQuery({
    queryKey: ['maintenance_assets'],
    getUrl: endpoints,
    method: 'POST',
    queryOptions: { enabled: false },
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({ message: 'Maintenance Saved', description: 'Asset maintenance has been saved.', duration: 3 });
      navigate('/master-data/maintenance-assets');
    },
    onError: (err) => {
      notification.success({ message: 'Maintenance Save Failed', description: err.message || 'Failed to save maintenance.', duration: 3 });
    },
  });

  const toPayload = (data) => {
    const assetId = typeof data.asset === 'object' ? data.asset?.value : data.asset;
    const employeeId = typeof data.employee === 'object' ? data.employee?.value : data.employee;
    const maintenanceTypeId = typeof data.maintenance_type === 'object' ? data.maintenance_type?.value : data.maintenance_type;
    const attach = Array.isArray(data.attachment) && data.attachment[0]
      ? {
          id: data.attachment[0]?.uid || undefined,
          name: data.attachment[0]?.name,
          path: data.attachment[0]?.path || data.attachment[0]?.name,
          url: data.attachment[0]?.url || '',
        }
      : undefined;

    return {
      amount: Number(data.amount) || 0,
      asset: assetId ? { id: assetId } : undefined,
      attachment: attach,
      code: data.code || undefined,
      created_at: data.created_at,
      date: data.date ? moment(data.date).format('YYYY-MM-DD') : null,
      description: data.description || undefined,
      employee: employeeId ? { id: employeeId } : undefined,
      maintenance_type: maintenanceTypeId ? { id: maintenanceTypeId } : undefined,
      updated_at: data.updated_at,
    };
  };

  const onSubmit = (form) => {
    submit(toPayload(form));
  };

  return (
    <Flex gap={'large'} vertical>
      <Flex justify="space-between" align="center">
        <Breadcrumb
          separator=">"
          style={{ cursor: 'pointer' }}
          items={[
            { title: 'Master Data', onClick: () => navigate('/master-data') },
            { title: 'Asset Maintenance', onClick: () => navigate('/master-data/maintenance-assets') },
            { title: 'Add Asset Maintenance' },
          ]}
        />
      </Flex>

      <Forms title="Create Asset Maintenance" control={control} handleSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting} errors={errors} />
    </Flex>
  );
};

export default CreateMaintenanceAsset;