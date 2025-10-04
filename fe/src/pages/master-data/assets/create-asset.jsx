import Api from '@/utils/axios/api';
import { uploadAttachment } from '@/utils/globalFunction';
import { useDataQuery } from '@/utils/hooks/useDataQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { attempt } from 'lodash';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { id } from 'zod/v4/locales';
import { AssetFormSchema } from './constant';
import Forms from './forms-asset';

const CreateAsset = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const {
    // register,
    handleSubmit,
    getValues,
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

  const endpoints = '/api/v1/assets';

  const { isSubmitting, submit } = useDataQuery({
    queryKey: ['assets'],
    getUrl: endpoints,
    method: 'POST',
    submitType: 'json', // Changed to json since we'll handle the file separately
    handleFileUpload: true, // Enable automatic file upload handling
    fileUploadFields: ['attachment'], // Specify which fields need file upload
    queryOptions: {
      enabled: false, // Disable initial fetch
    },
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Asset Created',
        description: 'Asset has been successfully Created.',
        duration: 3,
      });
      navigate('/master-data/assets');
    },
    onError: (err) => {
      notification.error({
        message: 'Asset Creation Failed',
        description: err.message || 'Failed to create asset.',
        duration: 3,
      });
    },
  });

  const onSubmit = async (data) => {
    console.log('Form Data:', data);

    try {
      const submitData = {
        ...data,
        category: {
          id: data?.category?.value || data?.category || null,
        },
        condition: {
          id: data?.condition?.value || data?.condition || null,
        },
        // attachment will be handled automatically by useDataQuery
      };

      await submit(submitData);
    } catch (error) {
      console.error('Asset creation failed:', error);
    }
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
              title: 'assets',
              onClick: () => navigate('/master-data/assets'),
            },
            {
              title: 'Add Asset',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Create Asset"
        control={control}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default CreateAsset;
