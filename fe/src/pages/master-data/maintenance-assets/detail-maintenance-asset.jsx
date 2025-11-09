import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { MaintenanceAssetFormSchema } from './constant';
import Forms from './forms-maintenance-asset';

const DetailMaintenanceAsset = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = id && typeof id === 'string' && id.trim() !== '' ? `/api/v1/maintenance_assets/${id}` : '/api/v1/maintenance_assets';

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['maintenance_assets'],
    getUrl: endpoints,
    method: 'PUT',
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({ message: 'Maintenance Updated', description: 'Asset maintenance has been successfully updated.', duration: 3 });
      navigate('/master-data/maintenance-assets');
    },
    onError: (err) => {
      notification.success({ message: 'Maintenance Update Failed', description: err.message || 'Failed to update maintenance.', duration: 3 });
    },
  });

  const { handleSubmit, reset, control, formState: { errors } } = useForm({
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
    },
  });

  useEffect(() => {
    if (initialData?.results) {
      const r = initialData.results;
      reset({
        date: r?.date ? moment(r.date).format('YYYY-MM-DD') : null,
        code: r?.code || null,
        description: r?.description || null,
        amount: r?.amount ?? 0,
        asset: r?.asset?.id || null,
        employee: r?.employee?.id || null,
        maintenance_type: r?.maintenance_type?.id || null,
        attachment: r?.attachment ? [{ name: r.attachment.name, uid: r.attachment.id, url: r.attachment.url }] : [],
      });
    }
  }, [initialData, reset]);

  const toPayload = (data) => {
    const assetId = typeof data.asset === 'object' ? data.asset?.value : data.asset;
    const employeeId = typeof data.employee === 'object' ? data.employee?.value : data.employee;
    const maintenanceTypeId = typeof data.maintenance_type === 'object' ? data.maintenance_type?.value : data.maintenance_type;
    const attach = Array.isArray(data.attachment) && data.attachment[0]
      ? { id: data.attachment[0]?.uid || undefined, name: data.attachment[0]?.name, path: data.attachment[0]?.path || data.attachment[0]?.name, url: data.attachment[0]?.url || '' }
      : undefined;

    return {
      amount: Number(data.amount) || 0,
      asset: assetId ? { id: assetId } : undefined,
      attachment: attach,
      code: data.code || undefined,
      date: data.date ? moment(data.date).format('YYYY-MM-DD') : null,
      description: data.description || undefined,
      employee: employeeId ? { id: employeeId } : undefined,
      maintenance_type: maintenanceTypeId ? { id: maintenanceTypeId } : undefined,
    };
  };

  const onSubmit = (form) => { submit(toPayload(form)); };

  if (isLoading) { return <ProSkeleton type="descriptions" />; }

  return (
    <Flex gap={'large'} vertical>
      <Flex justify="space-between" align="center">
        <Breadcrumb
          separator=">"
          style={{ cursor: 'pointer' }}
          items={[
            { title: 'Master Data', onClick: () => navigate('/master-data') },
            { title: 'Asset Maintenance', onClick: () => navigate('/master-data/maintenance-assets') },
            { title: 'Detail Asset Maintenance' },
          ]}
        />
      </Flex>

      <Forms title={'Detail Asset Maintenance'} control={control} isLoading={isLoading} handleSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting} errors={errors} formType="detail" />
    </Flex>
  );
};

export default DetailMaintenanceAsset;