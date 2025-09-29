import Api from '@/utils/axios/api';
import { useDataQuery } from '@/utils/hooks/useDataQuery';
import ProSkeleton from '@ant-design/pro-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { App, Breadcrumb, Flex } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { AssignmentFormSchema } from './constant';
import Forms from './forms-assignment';

const fetchHistory = async ({ url }) => {
  const response = await Api().get(url);
  const results = response.data?.results || [];
  // Hapus data pertama dari response
  const rebuildChildren = results.list.map((result) => {
    return {
      ...result,
      color: 'blue',
      children: (
        <>
          <p>Date: {moment(result.date).format('DD MMM YYYY')}</p>
          <p>Employee: {result.employee.name}</p>
          <p>Condition: {result.condition.name}</p>
        </>
      ),
    };
  });
  return rebuildChildren;
};

const DetailAssignment = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoints =
    id && typeof id === 'string' && id.trim() !== ''
      ? `/api/v1/assets/${id}`
      : '/api/v1/assets';

  const endpointHistory = `/api/v1/employee_assets?asset.id=${id}&$sort=-date`;

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    enabled: !!id,
    queryKey: ['employee_assets_history', endpointHistory],
    queryFn: () => fetchHistory({ url: endpointHistory }),
    select: (data) => data.slice(1),
  });

  const { initialData, isLoading, isSubmitting, submit } = useDataQuery({
    queryKey: ['assets'],
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
      const {
        code,
        asset,
        employee,
        condition,
        assign_date,
        attachment,
        ...props
      } = initialData?.results || {};

      reset({
        code: code || null,
        asset: { label: props.name, value: props.id } || null,
        employee: { label: employee.name, value: employee.id } || null,
        condition: { label: condition.name, value: condition.id } || null,
        assign_date: assign_date || null,
        attachment: attachment || null,
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
        formType="detail"
        historyData={historyData}
        isLoadingHistory={isLoadingHistory}
      />
    </Flex>
  );
};

export default DetailAssignment;
