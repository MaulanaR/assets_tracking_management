import { useDataQuery } from '@/utils/hooks/useDataQuery';
import Api from '@/utils/axios/api';
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
    method: 'PUT', // Use PUT for updating existing employee
    submitType: 'json', // Changed to json
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
      code: '',
      name: '',
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
        code: code || '',
        name: name || '',
        address: address || '',
        department: department || null,
        branch: branch || null,
        phone: phone || '',
        email: email || '',
        attachment: attachment || null,
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

        if (data.address) queryParams.append('address', data.address);
        if (data.phone) queryParams.append('phone', data.phone);
        if (data.email) queryParams.append('email', data.email);
        if (data.department?.value)
          queryParams.append('department_id', data.department.value);
        if (data.branch?.value)
          queryParams.append('branch_id', data.branch.value);

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
            message: 'Employee Created',
            description: 'Employee has been successfully created.',
            duration: 3,
          });
          navigate('/master-data/employees');
        } catch (error) {
          notification.error({
            message: 'Employee Creation Failed',
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

    if (data.address) queryParams.append('address', data.address);
    if (data.phone) queryParams.append('phone', data.phone);
    if (data.email) queryParams.append('email', data.email);
    if (data.department?.value)
      queryParams.append('department_id', data.department.value);
    if (data.branch?.value) queryParams.append('branch_id', data.branch.value);

    const urlWithParams = `${endpoints}?${queryParams.toString()}`;

    try {
      await Api().request({
        url: urlWithParams,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      notification.success({
        message: 'Employee Created',
        description: 'Employee has been successfully created.',
        duration: 3,
      });
      navigate('/master-data/employees');
    } catch (error) {
      notification.error({
        message: 'Employee Creation Failed',
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
