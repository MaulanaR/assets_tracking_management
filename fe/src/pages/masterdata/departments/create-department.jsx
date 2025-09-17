import { useDataQuery } from '@/utils/hooks/useDataQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { DepartmentFormSchema } from './constant';
import Forms from './forms';

const CreateDepartment = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const {
    // register,
    handleSubmit,
    // getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DepartmentFormSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
    },
  });

  const endpoints = '/api/v1/departments';

  const { isSubmitting, submit } = useDataQuery({
    queryKey: ['departments'],
    getUrl: endpoints,
    method: 'POST',
    queryOptions: {
      enabled: false, // Disable initial fetch
    },
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Department Created',
        description: 'Department has been successfully Created.',
        duration: 3,
      });
      navigate('/masterdata/departments');
    },
    onError: (err) => {
      notification.success({
        message: 'Department Creation Failed',
        description: err.message || 'Failed to create department.',
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
              onClick: () => navigate('/masterdata'),
            },
            {
              title: 'Departments',
              onClick: () => navigate('/masterdata/departments'),
            },
            {
              title: 'Add Department',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Create Department"
        control={control}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default CreateDepartment;