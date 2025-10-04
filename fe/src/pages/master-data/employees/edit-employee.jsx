import Api from '@/utils/axios/api';
import { uploadAttachment } from '@/utils/globalFunction';
import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { EmployeeFormSchema } from './constant';
import Forms from './forms-employee';

const EditEmployee = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = `/api/v1/employees/${id}`;

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['employees', endpoints],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing employee
    submitType: 'json', // Changed to json
        handleFileUpload: true, // Enable automatic file upload handling
    fileUploadFields: ['attachment'], // Specify which fields need file upload
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Employee Updated',
        description: 'Employee has been successfully updated.',
        duration: 3,
      });
      navigate('/master-data/employees');
    },
    onError: (err) => {
      notification.error({
        message: 'Employee Update Failed',
        description: err.message || 'Failed to update employee.',
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
      code: null,
      name: null,
      address: '',
      department: null,
      branch: null,
      phone: '',
      email: '',
      attachment: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      const {
        code,
        name,
        address,
        department,
        branch,
        phone,
        email,
        attachment,
      } = initialData?.results || {};
      reset({
        code: code || null,
        name: name || null,
        address: address || null,
        department: department || null,
        branch: branch || null,
        phone: phone || null,
        email: email || null,
        attachment: attachment || null,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    console.log('Form Data:', data);

    try {

      const submitData = {
        ...data,
        department: {
          id: data?.department?.value || data?.department || null,
        },
        branch: {
          id: data?.branch?.value || data?.branch || null,
        },
        // attachment will be handled automatically by useDataQuery
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
              title: 'Employees',
              onClick: () => navigate('/master-data/employees'),
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
