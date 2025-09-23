import ProSkeleton from '@ant-design/pro-skeleton';
import { Breadcrumb, Flex } from 'antd';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { useDataQuery } from '@/utils/hooks/useDataQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { App } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { BranchFormSchema } from './constant';
import Forms from './forms';

const EditBranch = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = `/api/v1/branches/${id}`;

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['branches', endpoints],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing branch
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Branch Updated',
        description: 'Branch has been successfully updated.',
        duration: 3,
      });
      navigate('/master-data/branches');
    },
    onError: (err) => {
      notification.success({
        message: 'Branch Update Failed',
        description: err.message || 'Failed to update branch.',
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
    resolver: zodResolver(BranchFormSchema),
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
              title: 'Branches',
              onClick: () => navigate('/master-data/branches'),
            },
            {
              title: 'Edit Branch',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Edit Branch"
        control={control}
        isLoading={isLoading}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default EditBranch;
