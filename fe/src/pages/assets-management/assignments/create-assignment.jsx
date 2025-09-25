import { useDataQuery } from '@/utils/hooks/useDataQuery';
import Api from '@/utils/axios/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { AssignmentFormSchema } from './constant';
import Forms from './forms';
import { uploadAttachment } from '@/utils/globalFunction';

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
      code: null,
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

  const onSubmit = async (data) => {
    console.log('Form Data:', data);

    try {
      let attachmentId = null;

      if (data?.attachment?.length > 0) {
        attachmentId = await uploadAttachment(data.attachment[0]);
      }

      const submitData = {
        ...data,
        asset: {
          id: data?.asset || null,
        },
        employee: {
          id: data?.employee || null,
        },
        condition: {
          id: data?.condition || null,
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
