import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { AssignmentFormSchema } from './constant';
import Forms from './forms';

const DetailAssignment = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints =
    id && typeof id === 'string' && id.trim() !== ''
      ? `/api/v1/employee_assets/${id}`
      : '/api/v1/employee_assets';

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['employee_assets'],
    getUrl: endpoints,
    method: 'PUT', // Use PUT for updating existing assignment
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
      notification.success({
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
      reset({
        code: initialData?.results?.code || '',
        asset: initialData?.results?.asset || null,
        employee: initialData?.results?.employee || null,
        condition: initialData?.results?.condition || null,
        assign_date: initialData?.results?.assign_date || null,
        attachment: initialData?.results?.attachment || null,
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
              title: 'Assets Management',
              onClick: () => navigate('/assets-management'),
            },
            {
              title: 'Assignments',
              onClick: () => navigate('/assets-management/assets'),
            },
            {
              title: 'Detail Asset',
            },
          ]}
        />
      </Flex>

      <Forms
        title={'Detail Asset'}
        control={control}
        isLoading={isLoading}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
        isDetail={true}
      />
    </Flex>
  );
};

export default DetailAssignment;
