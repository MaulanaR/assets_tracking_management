import { useDataQuery } from '@/utils/hooks/useDataQuery';
import Api from '@/utils/axios/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { AssignmentFormSchema } from './constant';
import Forms from './forms';

const CreateAssignment = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const {
    // register,
    handleSubmit,
    getValues,
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

  const endpoints = '/api/v1/employee_assets';

  const { isSubmitting, submit } = useDataQuery({
    queryKey: ['assignments', endpoints],
    getUrl: endpoints,
    method: 'POST',
    submitType: 'json', // Changed to json since we'll handle the file separately
    queryOptions: {
      enabled: false, // Disable initial fetch
    },
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Assignment Created',
        description: 'Assignment has been successfully Created.',
        duration: 3,
      });
      navigate('/assets-management/assignments');
    },
    onError: (err) => {
      notification.error({
        message: 'Assignment Creation Failed',
        description: err.message || 'Failed to create assignment.',
        duration: 3,
      });
    },
  });

  console.log('Default Values:', getValues(), errors);
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
        queryParams.append(
          'assign_date',
          data.assign_date?.toISOString() || '',
        );

        if (data.asset) queryParams.append('asset_id', data.asset);
        if (data.employee) queryParams.append('employee_id', data.employee);
        if (data.condition) queryParams.append('condition_id', data.condition);

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
            message: 'Assignment Created',
            description: 'Assignment has been successfully created.',
            duration: 3,
          });
          navigate('/assets-management/assignments');
        } catch (error) {
          notification.error({
            message: 'Assignment Creation Failed',
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
          message: 'Assignment Created',
          description: 'Assignment has been successfully created.',
          duration: 3,
        });
        navigate('/assets-management/assignments');
      } catch (error) {
        notification.error({
          message: 'Assignment Creation Failed',
          description: error?.response?.data?.message || error.message,
          duration: 3,
        });
      }
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
              title: 'Assets Management',
              onClick: () => navigate('/assets-management'),
            },
            {
              title: 'Assignments',
              onClick: () => navigate('/assets-management/assignments'),
            },
            {
              title: 'Add Assignment',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Create Assignment"
        control={control}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default CreateAssignment;
