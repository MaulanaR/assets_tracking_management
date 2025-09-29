import proStyle from '@/styles/proComponentStyle';
import proFormSelectRequestFunction from '@/utils/services/proFormSelectRequestFunction';
import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { Modal, Typography } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

const { Title, Text } = Typography;

export default function FilterDistributionAsset() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = useForm({
    defaultValues: {
      branch_id: [],
      department_id: [],
      category_id: [],
    },
  });

  const handleClose = () => {
    navigate('/reports');
  };

  const onSubmit = (data) => {
    console.log('INIII FILTER DISTRIBUTION ASSET =>', data);
    const filterParams = {};

    if (data.branch_id && data.branch_id.length > 0) {
      filterParams['branch.id'] = data.branch_id.join(',');
    }

    if (data.department_id && data.department_id.length > 0) {
      filterParams['department.id'] = data.department_id.join(',');
    }

    if (data.category_id && data.category_id.length > 0) {
      filterParams['category.id'] = data.category_id.join(',');
    }

    const queryParams = new URLSearchParams(filterParams).toString();
    navigate(`/reports/distribution-asset-per-department?${queryParams}`, {
      replace: true,
    });
  };

  console.log('INIII FILTER DISTRIBUTION ASSET =>');
  return (
    <Modal open={true} onCancel={handleClose} footer={null}>
      <Title level={3}>Filter Distribution Asset Report</Title>

      <ProForm
        // grid={true}
        disabled={isLoading || isSubmitting}
        onFinish={handleSubmit(onSubmit)}
        onReset={() => navigate('/reports')}
        submitter={{
          submitButtonProps: {
            disabled: isLoading || isSubmitting,
            loading: isLoading || isSubmitting,
          },
          searchConfig: {
            submitText: 'Generate Report',
            resetText: 'Cancel',
          },
        }}
      >
        <Controller
          name="branch_id"
          control={control}
          render={(form) => (
            <ProFormSelect
              {...form.field}
              label="Branch"
              placeholder="Pilih Branch"
              mode="multiple"
              showSearch
              request={proFormSelectRequestFunction({
                url: '/api/v1/branches',
                key: 'branch',
                labelKey: 'name',
                valueKey: 'id',
              })}
              debounceTime={300}
              validateStatus={errors.branch_id && 'error'}
              labelCol={{
                style: {
                  paddingBottom: proStyle.ProFormText.labelCol.style.padding,
                },
              }}
              fieldProps={{
                allowClear: true,
                loading: form.field.value === undefined,
                onSelect: () => {
                  // Dropdown akan otomatis tertutup setelah memilih
                },
              }}
            />
          )}
        />

        <Controller
          name="department_id"
          control={control}
          render={(form) => (
            <ProFormSelect
              {...form.field}
              label="Department"
              placeholder="Pilih Department"
              mode="multiple"
              showSearch
              request={proFormSelectRequestFunction({
                url: '/api/v1/departments',
                key: 'department',
                labelKey: 'name',
                valueKey: 'id',
              })}
              debounceTime={300}
              validateStatus={errors.department_id && 'error'}
              labelCol={{
                style: {
                  paddingBottom: proStyle.ProFormText.labelCol.style.padding,
                },
              }}
              fieldProps={{
                allowClear: true,
                loading: form.field.value === undefined,
                onSelect: () => {
                  // Dropdown akan otomatis tertutup setelah memilih
                },
              }}
            />
          )}
        />

        <Controller
          name="category_id"
          control={control}
          render={(form) => (
            <ProFormSelect
              {...form.field}
              label="Category"
              placeholder="Pilih Category"
              mode="multiple"
              showSearch
              request={proFormSelectRequestFunction({
                url: '/api/v1/categories',
                key: 'category',
                labelKey: 'name',
                valueKey: 'id',
              })}
              debounceTime={300}
              validateStatus={errors.category_id && 'error'}
              labelCol={{
                style: {
                  paddingBottom: proStyle.ProFormText.labelCol.style.padding,
                },
              }}
              fieldProps={{
                allowClear: true,
                loading: form.field.value === undefined,
                onSelect: () => {
                  // Dropdown akan otomatis tertutup setelah memilih
                },
              }}
            />
          )}
        />
      </ProForm>
    </Modal>
  );
}
