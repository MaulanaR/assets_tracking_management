import { useDataQuery } from '@/utils/hooks/useDataQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { App, Breadcrumb, Flex } from 'antd';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { AssetFormSchema } from './constant';
import Forms from './forms';

const CreateAsset = () => {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const {
    // register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AssetFormSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
    },
  });

  const endpoints = '/api/v1/assets';

  const { isSubmitting, submit } = useDataQuery({
    queryKey: ['assets'],
    getUrl: endpoints,
    method: 'POST',
    queryOptions: {
      enabled: false, // Disable initial fetch
    },
    submitUrl: endpoints,
    onSuccess: () => {
      notification.success({
        message: 'Asset Created',
        description: 'Asset has been successfully Created.',
        duration: 3,
      });
      navigate('/masterdata/assets');
    },
    onError: (err) => {
      notification.success({
        message: 'Asset Creation Failed',
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
              title: 'assets',
              onClick: () => navigate('/masterdata/assets'),
            },
            {
              title: 'Add Asset',
            },
          ]}
        />
      </Flex>

      <Forms
        title="Create Asset"
        control={control}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        errors={errors}
      />
    </Flex>
  );
};

export default CreateAsset;
