import { uploadAttachment } from '@/utils/globalFunction';
import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { AssignmentFormSchema } from './constant';
import FormsAssignmentTransfer from './forms-assignment-transfer';

const TransferAssignment = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const getEndpoints = `/api/v1/assets/${id}`;
  const putEndpoints = `/api/v1/employee_assets`;

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['assignments', getEndpoints],
    getUrl: getEndpoints,
    method: 'POST', // Use POST for creating new assignments
    submitType: 'json',
    handleFileUpload: true, // Enable automatic file upload handling
    fileUploadFields: ['attachment'], // Specify which fields need file upload
    submitUrl: putEndpoints,
    onSuccess: () => {
      notification.success({
        message: 'Assignment Transferred',
        description: 'Assignment has been successfully transferred.',
        duration: 3,
      });
      navigate('/assets-management/assignments');
    },
    onError: (err) => {
      notification.error({
        message: 'Assignment Transfer Failed',
        description: err.message || 'Failed to transfer assignment.',
        duration: 3,
      });
    },
  });

  console.log('INII DATAA =>', initialData);

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
      // code: null,
      asset: null,
      employee: null,
      condition: null,
      assign_date: null,
      attachment: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      const { code, employee, condition, assign_date, attachment, ...props } =
        initialData?.results || {};

      reset({
        asset: { label: props?.name, value: props?.id } || null,
        current_employee:
          { label: employee?.name, value: employee?.id } || null,
        employee: null,
        condition: { label: condition?.name, value: condition?.id } || null,
        history_assign_date: moment(assign_date).format('YYYY-MM-DD') || null,
        assign_date: moment().format('YYYY-MM-DD') || null,
        attachment: attachment || null,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    console.log('Form Data:', data);

    try {
      const submitData = {
        ...data,
        asset: {
          id: id || null,
        },
        employee: {
          id: data?.employee?.value || data?.employee || null,
        },
        condition: {
          id: data?.condition?.value || data?.condition || null,
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
              title: 'Assets Management',
              onClick: () => navigate('/assets-management'),
            },
            {
              title: 'Assignments',
              onClick: () => navigate('/assets-management/assignments'),
            },
            {
              title: 'Transfer Assignment',
            },
          ]}
        />
      </Flex>

      <FormsAssignmentTransfer
        title="Transfer Assignment"
        control={control}
        isLoading={isLoading}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default TransferAssignment;
