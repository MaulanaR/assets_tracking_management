import { useDataQuery } from '@/utils/hooks/useDataQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { CategoryFormSchema } from './constant';
import Forms from './forms';

const CreateCategory = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const {
    // register,
    handleSubmit,
    // getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
    },
  });

  const endpoints = '/api/v1/categories';

  const { isSubmitting, submit } = useDataQuery({
    queryKey: ['categories'],
    getUrl: endpoints,
    method: 'POST',
    queryOptions: {
      enabled: false, // Disable initial fetch
    },
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Category Created',
        description: 'Category has been successfully Created.',
        duration: 3,
      });
      navigate('/master-data/categories');
    },
    onError: (err) => {
      notification.success({
        message: 'Category Creation Failed',
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
              title: 'Categories',
              onClick: () => navigate('/master-data/categories'),
            },
            {
              title: 'Add Category',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Create Category"
        control={control}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default CreateCategory;
