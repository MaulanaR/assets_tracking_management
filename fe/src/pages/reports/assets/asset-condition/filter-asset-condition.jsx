import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { Modal, Typography } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import proStyle from '@/styles/proComponentStyle';
import proFormSelectRequestFunction from '@/utils/services/proFormSelectRequestFunction';

const { Title, Text } = Typography;

export default function FilterAssetCondition() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = useForm({
    defaultValues: {
      category_id: [],
      department_id: [],
      branch_id: [],
      condition_id: [],
      job_position_id: [],
      employee_id: [],
    },
  });

  const handleClose = () => {
    navigate('/reports');
  };

  const onSubmit = (data) => {
    console.log('INIII FILTER ASSET CONDITION =>', data);
    const filterParams = {};

    if (data.category_id && data.category_id.length > 0) {
      filterParams['category.id'] = data.category_id.join(',');
    }

    if (data.department_id && data.department_id.length > 0) {
      filterParams['department.id'] = data.department_id.join(',');
    }

    if (data.branch_id && data.branch_id.length > 0) {
      filterParams['branch.id'] = data.branch_id.join(',');
    }

    if (data.condition_id && data.condition_id.length > 0) {
      filterParams['condition.id'] = data.condition_id.join(',');
    }

    if (data.job_position_id && data.job_position_id.length > 0) {
      filterParams['job_position.id'] = data.job_position_id.join(',');
    }

    if (data.employee_id && data.employee_id.length > 0) {
      filterParams['employee.id'] = data.employee_id.join(',');
    }

    const queryParams = new URLSearchParams(filterParams).toString();
    navigate(`/reports/asset-condition?${queryParams}`, {
      replace: true,
    });
  };

  console.log('INIII FILTER ASSET CONDITION =>');
  return (
    <Modal open={true} onCancel={handleClose} footer={null}>
      <Title level={3}>Filter Asset Condition Report</Title>

      <ProForm
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
          name="condition_id"
          control={control}
          render={(form) => (
            <ProFormSelect
              {...form.field}
              label="Condition"
              placeholder="Pilih Condition"
              mode="multiple"
              showSearch
              request={proFormSelectRequestFunction({
                url: '/api/v1/conditions',
                key: 'condition',
                labelKey: 'name',
                valueKey: 'id',
              })}
              debounceTime={300}
              validateStatus={errors.condition_id && 'error'}
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
          name="job_position_id"
          control={control}
          render={(form) => (
            <ProFormSelect
              {...form.field}
              label="Job Position"
              placeholder="Pilih Job Position"
              mode="multiple"
              showSearch
              request={proFormSelectRequestFunction({
                url: '/api/v1/job-positions',
                key: 'job_position',
                labelKey: 'name',
                valueKey: 'id',
              })}
              debounceTime={300}
              validateStatus={errors.job_position_id && 'error'}
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
          name="employee_id"
          control={control}
          render={(form) => (
            <ProFormSelect
              {...form.field}
              label="Employee"
              placeholder="Pilih Employee"
              mode="multiple"
              showSearch
              request={proFormSelectRequestFunction({
                url: '/api/v1/employees',
                key: 'employee',
                labelKey: 'name',
                valueKey: 'id',
              })}
              debounceTime={300}
              validateStatus={errors.employee_id && 'error'}
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
