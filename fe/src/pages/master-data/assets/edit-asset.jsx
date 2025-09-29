import Api from '@/utils/axios/api';
import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { AssetFormSchema } from './constant';
import Forms from './forms-asset';
import { uploadAttachment } from '@/utils/globalFunction';

const EditAsset = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = `/api/v1/assets/${id}`;

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['assets', endpoints],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing assets
    submitType:'json',
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
      code: null,
      name: null,
      price: 0,
      attachment: null,
      category: null,
      condition: null,
      status: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      const { code, name, price, attachment, category, condition, status } =
        initialData?.results || {};
      reset({
        code: code || '',
        name: name || '',
        price: price || 0,
        attachment: attachment || null,
        category: category?.id ? {label: category.name, value: category.id} : null,
        condition: condition?.id ? {label: condition.name, value: condition.id} : null,
        status: status || null,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    console.log('Form Data:', data);

    try {
      let attachmentId = null;

      if (data?.attachment?.length > 0) {
        attachmentId = await uploadAttachment(data.attachment[0]);
      }

      const submitData = {
        ...data,
        category: {
          id: data?.category?.value || data?.category || null,
        },
        condition: {
          id: data?.condition?.value || data?.condition || null,
        },
        attachment: attachmentId,
      };

      await submit(submitData);
    } catch (error) {
      console.error('Asset creation failed:', error);
    }
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
