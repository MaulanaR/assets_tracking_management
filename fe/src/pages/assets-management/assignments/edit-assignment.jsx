import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { AssignmentFormSchema } from './constant';
import Forms from './forms';
import Api from '@/utils/axios/api';

const EditAssignment = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints = `/api/v1/employee_assets/${id}`;

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['assignments', endpoints],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing assignments
    submitType: 'form-data',
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Assignment Updated',
        description: 'Assignment has been successfully updated.',
        duration: 3,
      });
      navigate('/assets-management/assignments');
    },
    onError: (err) => {
      notification.error({
        message: 'Assignment Update Failed',
        description: err.message || 'Failed to update assignment.',
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
    resolver: zodResolver(AssignmentFormSchema),
    defaultValues: {
      code: '',
      asset: null,
      employee: null,
      condition: null,
      assign_date: null,
      attachment: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      const { code, asset, employee, condition, assign_date, attachment } =
        initialData?.results || {};
      reset({
        code: code || '',
        asset: asset || null,
        employee: employee || null,
        condition: condition || null,
        assign_date: assign_date || null,
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
        queryParams.append('assign_date', data.assign_date);

        if (data.asset?.value) queryParams.append('asset_id', data.asset.value);
        if (data.employee?.value)
          queryParams.append('employee_id', data.employee.value);
        if (data.condition?.value)
          queryParams.append('condition_id', data.condition.value);

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
            message: 'Assignment Updated',
            description: 'Assignment has been successfully updated.',
            duration: 3,
          });
          navigate('/assets-management/assignments');
        } catch (error) {
          notification.error({
            message: 'Assignment Update Failed',
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
    } else {
      // Handle form submission without file
      const queryParams = new URLSearchParams();
      queryParams.append('code', data.code);

      if (data.category?.value)
        queryParams.append('category_id', data.category.value);
      if (data.employee?.value)
        queryParams.append('employee_id', data.employee.value);
      if (data.condition?.value)
        queryParams.append('condition_id', data.condition.value);

      const urlWithParams = `${endpoints}?${queryParams.toString()}`;

      try {
        await Api().request({
          url: urlWithParams,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        notification.success({
          message: 'Assignment Updated',
          description: 'Assignment has been successfully updated.',
          duration: 3,
        });
        navigate('/assets-management/assignments');
      } catch (error) {
        notification.error({
          message: 'Assignment Update Failed',
          description: error?.response?.data?.message || error.message,
          duration: 3,
        });
      }
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
              title: 'Assets Management',
              onClick: () => navigate('/assets-management'),
            },
            {
              title: 'Assignments',
              onClick: () => navigate('/assets-management/assignments'),
            },
            {
              title: 'Edit Assignment',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Edit Assignment"
        control={control}
        isLoading={isLoading}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default EditAssignment;
