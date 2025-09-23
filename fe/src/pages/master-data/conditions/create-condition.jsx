import { useDataQuery } from '@/utils/hooks/useDataQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { ConditionFormSchema } from './constant';
import Forms from './forms';

const CreateCondition = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const {
    // register,
    handleSubmit,
    // getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ConditionFormSchema),
    defaultValues: {
      code: '',
      name: '',
    },
  });

  const endpoints = '/api/v1/conditions';

  const { isSubmitting, submit } = useDataQuery({
    queryKey: ['conditions'],
    getUrl: endpoints,
    method: 'POST',
    queryOptions: {
      enabled: false, // Disable initial fetch
    },
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Condition Created',
        description: 'Condition has been successfully Created.',
        duration: 3,
      });
      navigate('/master-data/conditions');
    },
    onError: (err) => {
      notification.success({
        message: 'Condition Creation Failed',
        description: err.message || 'Failed to create condition.',
        duration: 3,
      });
    },
    filters: {
      per_page: 10,
      page: 1,
      includes: [
        'emails',
        'phones',
        'other_fields',
        'addresses',
        'contact_persons',
        'restricted_departments',
        'restricted_contacts',
        'bank_accounts',
      ],
    },
  });

  const onSubmit = (data) => {
    submit(data);
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
              title: 'Conditions',
              onClick: () => navigate('/master-data/conditions'),
            },
            {
              title: 'Add Condition',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Create Condition"
        control={control}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default CreateCondition;
