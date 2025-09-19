import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { AssetFormSchema } from './constant';
import Forms from './forms';

const EditAsset = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = `/api/v1/assets/${id}`;

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['assets', endpoints],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing assets
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Asset Updated',
        description: 'Asset has been successfully updated.',
        duration: 3,
      });
      navigate('/masterdata/assets');
    },
    onError: (err) => {
      notification.success({
        message: 'Asset Update Failed',
        description: err.message || 'Failed to update asset.',
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
      code: '',
      name: '',
      address: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      const { code, name, email, position, contact_type, address } =
        initialData?.results || {};
      reset({
        code: code || '',
        name: name || '',
        email: email || '',
        position: position || '',
        contact_type: contact_type || '',
        address: address || '',
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
              title: 'Contacts',
              onClick: () => navigate('/masterdata/assets'),
            },
            {
              title: 'Edit Asset',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Edit Asset"
        control={control}
        isLoading={isLoading}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default EditAsset;
