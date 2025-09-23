import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { AssetFormSchema } from './constant';
import Forms from './forms';
import Api from '@/utils/axios/api';

const EditAsset = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = `/api/v1/assets/${id}`;

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['assets', endpoints],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing assets
    submitType: 'form-data',
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

  useEffect(() => {
    if (initialData) {
      const {
        code,
        name,
        price,
        attachment,
        category,
        condition,
        department,
        branch,
        status,
      } = initialData?.results || {};
      reset({
        code: code || '',
        name: name || '',
        price: price || 0,
        attachment: attachment || null,
        category: category || null,
        condition: condition || null,
        department: department || null,
        branch: branch || null,
        status: status || null,
      });
    }
  }, [initialData, reset]);

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
          navigate('/master-data/assets');
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
      navigate('/master-data/assets');
    } catch (error) {
      notification.error({
        message: 'Asset Creation Failed',
        description: error?.response?.data?.message || error.message,
        duration: 3,
      });
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
