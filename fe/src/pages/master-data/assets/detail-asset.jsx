import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { AssetFormSchema } from './constant';
import Forms from './forms-asset';

const DetailAsset = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints =
    id && typeof id === 'string' && id.trim() !== ''
      ? `/api/v1/assets/${id}`
      : '/api/v1/assets';

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['assets'],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing assets
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Asset Updated',
        description: 'Asset has been successfully updated.',
        duration: 3,
      });
      navigate('/master-data/assets');
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
    resolver: zodResolver(AssetFormSchema),
    defaultValues: {
      code: null,
      name: null,
      price: 0,
      attachment: null,
      category: null,
      status: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData?.results?.code || '',
        name: initialData?.results?.name || '',
        price: initialData?.results?.price || 0,
        attachment: initialData?.results?.attachment || null,
        category: initialData?.results?.category || null,
        status: initialData?.results?.status || null,
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
              title: 'Assets',
              onClick: () => navigate('/master-data/assets'),
            },
            {
              title: 'Detail Asset',
            },
          ]}
        />
      </Flex>

      <Forms
        title={'Detail Asset'}
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

export default DetailAsset;
