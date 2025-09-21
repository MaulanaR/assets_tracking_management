import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { EmployeeFormSchema } from './constant';
import Forms from './forms';

const EditEmployee = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = `/api/v1/employees/${id}`;

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['employees', endpoints],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing employe
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Employee Updated',
        description: 'Employee has been successfully updated.',
        duration: 3,
      });
      navigate('/masterdata/employees');
    },
    onError: (err) => {
      notification.success({
        message: 'Employee Update Failed',
        description: err.message || 'Failed to update employe.',
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
    resolver: zodResolver(EmployeeFormSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
      department_id: '',
      branch_id: '',
      phone: '',
      attachment: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      const {
        code,
        name,
        address,
        department_id,
        branch_id,
        phone,
        attachment,
      } = initialData?.results || {};
      reset({
        code: code || '',
        name: name || '',
        address: address || '',
        department_id: department_id || '',
        branch_id: branch_id || '',
        phone: phone || '',
        attachment: attachment || null,
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data) => {
    const formData = new FormData();

    // Append each field to the FormData object manual
    formData.append('code', data.code);
    formData.append('name', data.name);
    formData.append('department_id', data.department?.id || '');
    formData.append('branch_id', data.branch?.id || '');
    formData.append('address', data.address || '');
    formData.append('phone', data.phone || '');

    if (data?.attachment && data.attachment instanceof File) {
      formData.append('attachment', data.attachment);
    }
    submit(formData);
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
              onClick: () => navigate('/masterdata/employees'),
            },
            {
              title: 'Edit Employee',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Edit Employee"
        control={control}
        isLoading={isLoading}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default EditEmployee;
