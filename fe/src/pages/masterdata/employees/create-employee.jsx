import { useDataQuery } from '@/utils/hooks/useDataQuery';
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
    },
  });

  const endpoints = '/api/v1/employees';

  const { isSubmitting, submit } = useDataQuery({
    queryKey: ['employees'],
    getUrl: endpoints,
    method: 'POST',
    queryOptions: {
      enabled: false, // Disable initial fetch
    },
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Employe Created',
        description: 'Employe has been successfully Created.',
        duration: 3,
      });
      navigate('/masterdata/employees');
    },
    onError: (err) => {
      notification.success({
        message: 'Employe Creation Failed',
        description: err.message || 'Failed to create contact.',
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
    console.log('INII DATAAA =>', data);
    submit(data);
  };

  console.log('ERRORS =>', errors, getValues());

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
              title: 'Employees',
              onClick: () => navigate('/masterdata/employees'),
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
