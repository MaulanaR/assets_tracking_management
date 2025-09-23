import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { CategoryFormSchema } from './constant';
import Forms from './forms';

const EditCategory = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = `/api/v1/categories/${id}`;

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['categories', endpoints],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing categori
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Category Updated',
        description: 'Category has been successfully updated.',
        duration: 3,
      });
      navigate('/master-data/categories');
    },
    onError: (err) => {
      notification.success({
        message: 'Category Update Failed',
        description: err.message || 'Failed to update categori.',
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
    resolver: zodResolver(CategoryFormSchema),
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
              title: 'Master Data',
              onClick: () => navigate('/master-data'),
            },
            {
              title: 'Categories',
              onClick: () => navigate('/master-data/categories'),
            },
            {
              title: 'Edit Category',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Edit Category"
        control={control}
        isLoading={isLoading}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default EditCategory;
