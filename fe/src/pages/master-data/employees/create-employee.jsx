import { useDataQuery } from '@/utils/hooks/useDataQuery';
import Api from '@/utils/axios/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { EmployeeFormSchema } from './constant';
import Forms from './forms';

const CreateEmployee = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const {
    // register,
    handleSubmit,
    getValues,
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

  const endpoints = '/api/v1/employees';

  const { isSubmitting, submit } = useDataQuery({
    queryKey: ['employees'],
    getUrl: endpoints,
    method: 'POST',
    submitType: 'json', // Changed to json since we'll handle the file separately
    queryOptions: {
      enabled: false, // Disable initial fetch
    },
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Employee Created',
        description: 'Employee has been successfully Created.',
        duration: 3,
      });
      navigate('/master-data/employees');
    },
    onError: (err) => {
      notification.error({
        message: 'Employee Creation Failed',
        description: err.message || 'Failed to create employee.',
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
              title: 'Add Employe',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Create Employe"
        control={control}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default CreateEmployee;
