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
      code: null,
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
        code: code || null,
        asset: asset || null,
        employee: employee || null,
        condition: condition || null,
        assign_date: assign_date || null,
        attachment: attachment || null,
      });
    }
  }, [initialData, reset]);

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
