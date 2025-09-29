import Api from '@/utils/axios/api';
import { uploadAttachment } from '@/utils/globalFunction';
import { useDataQuery } from '@/utils/hooks/useDataQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { EmployeeFormSchema } from './constant';
import Forms from './forms-employee';

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
      code: null,
      name: null,
      address: null,
      department: null,
      branch: null,
      phone: null,
      email: null,
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
    console.log('Form Data:', data);

    try {
      let attachmentId = null;

      if (data?.attachment?.length > 0) {
        attachmentId = await uploadAttachment(data.attachment[0]);
      }

      const submitData = {
        ...data,
        department: {
          id: data?.department || null,
        },
        branch: {
          id: data?.branch || null,
        },
        attachment: attachmentId,
      };

      await submit(submitData);
    } catch (error) {
      console.error('Asset creation failed:', error);
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
