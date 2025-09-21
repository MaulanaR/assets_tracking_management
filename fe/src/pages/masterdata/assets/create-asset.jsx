import { useDataQuery } from '@/utils/hooks/useDataQuery';
import Api from '@/utils/axios/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { AssetFormSchema } from './constant';
import Forms from './forms';

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
      code: '',
      name: '',
      price: 0,
      attachment: null,
      category: null,
      condition: null,
      department: null,
      branch: null,
      status: null,
    },
  });

  const endpoints = '/api/v1/assets';

  const { isSubmitting, submit } = useDataQuery({
    queryKey: ['assets'],
    getUrl: endpoints,
    method: 'POST',
    submitType: 'json', // Changed to json since we'll handle the file separately
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
      navigate('/masterdata/assets');
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
    // Handle file upload if present
    if (
      data?.attachment &&
      Array.isArray(data.attachment) &&
      data.attachment.length > 0
    ) {
      const file = data.attachment[0];

      // Find the actual File object
      let actualFile = null;
      if (file.originFileObj && file.originFileObj instanceof File) {
        actualFile = file.originFileObj;
      } else if (file instanceof File) {
        actualFile = file;
      } else if (file.file && file.file instanceof File) {
        actualFile = file.file;
      }

      if (actualFile && actualFile instanceof File) {
        // Build query parameters for file upload
        const queryParams = new URLSearchParams();
        queryParams.append('code', data.code);
        queryParams.append('name', data.name);
        queryParams.append('price', data.price);

        if (data.category?.value)
          queryParams.append('category_id', data.category.value);
        if (data.condition?.value)
          queryParams.append('condition_id', data.condition.value);
        if (data.department?.value)
          queryParams.append('department_id', data.department.value);
        if (data.branch?.value)
          queryParams.append('branch_id', data.branch.value);
        if (data.status) queryParams.append('status', data.status);

        const urlWithParams = `${endpoints}?${queryParams.toString()}`;
        const formData = new FormData();
        formData.append('attachment', actualFile);

        try {
          await Api().request({
            url: urlWithParams,
            method: 'POST',
            data: formData,
          });

          notification.success({
            message: 'Asset Created',
            description: 'Asset has been successfully created.',
            duration: 3,
          });
          navigate('/masterdata/assets');
        } catch (error) {
          notification.error({
            message: 'Asset Creation Failed',
            description: error?.response?.data?.message || error.message,
            duration: 3,
          });
        }
        return;
      } else {
        notification.error({
          message: 'File Upload Error',
          description:
            'Invalid file object. Please try uploading the file again.',
          duration: 3,
        });
        return;
      }
    }

    // Handle form submission without file
    const queryParams = new URLSearchParams();
    queryParams.append('code', data.code);
    queryParams.append('name', data.name);
    queryParams.append('price', data.price);

    if (data.category?.value)
      queryParams.append('category_id', data.category.value);
    if (data.condition?.value)
      queryParams.append('condition_id', data.condition.value);
    if (data.department?.value)
      queryParams.append('department_id', data.department.value);
    if (data.branch?.value) queryParams.append('branch_id', data.branch.value);
    if (data.status) queryParams.append('status', data.status);

    const urlWithParams = `${endpoints}?${queryParams.toString()}`;

    try {
      await Api().request({
        url: urlWithParams,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      notification.success({
        message: 'Asset Created',
        description: 'Asset has been successfully created.',
        duration: 3,
      });
      navigate('/masterdata/assets');
    } catch (error) {
      notification.error({
        message: 'Asset Creation Failed',
        description: error?.response?.data?.message || error.message,
        duration: 3,
      });
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
              onClick: () => navigate('/masterdata'),
            },
            {
              title: 'assets',
              onClick: () => navigate('/masterdata/assets'),
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
