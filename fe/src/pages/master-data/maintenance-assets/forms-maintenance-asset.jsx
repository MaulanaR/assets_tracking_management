import proStyle from '@/styles/proComponentStyle';
import proFormSelectRequestFunction from '@/utils/services/proFormSelectRequestFunction';
import { ProForm, ProFormDatePicker, ProFormMoney, ProFormSelect, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-components';
import { Button, Card, Flex, Typography } from 'antd';
import { LucideDownload } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router';

const { Title, Text } = Typography;

const Forms = ({ title, control, isLoading, isSubmitting, handleSubmit, formType = 'create' || 'edit' || 'detail', errors }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <Flex justify="space-between">
        <Title level={3}>{title}</Title>
        <Button variant="outlined" color="primary">
          <LucideDownload size={16} />
          Import From CSV
        </Button>
      </Flex>
      <ProForm
        grid={true}
        disabled={isLoading || isSubmitting}
        readonly={formType === 'detail'}
        onFinish={handleSubmit}
        onReset={() => navigate(-1)}
        submitter={{
          submitButtonProps: {
            disabled: isLoading || isSubmitting,
            loading: isLoading || isSubmitting,
            style: { display: formType === 'detail' ? 'none' : 'inline-block' },
          },
          searchConfig: { submitText: 'Save', resetText: 'Close' },
        }}
      >
        <ProForm.Group>
          <Controller
            name="date"
            control={control}
            render={(form) => (
              <ProFormDatePicker
                {...form.field}
                label="Date"
                placeholder="Select Date"
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.date && 'error'}
                format="YYYY-MM-DD"
                extra={<Text style={{ fontSize: 12 }} type="danger">{errors?.date?.message}</Text>}
                labelCol={{ style: { paddingBottom: proStyle.ProFormText.labelCol.style.padding } }}
              />
            )}
          />

          <Controller
            name="code"
            control={control}
            render={(form) => (
              <ProFormText
                {...form.field}
                label="Code"
                placeholder={''}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.code && 'error'}
                extra={<Text style={{ fontSize: 12 }} type="danger">{errors?.code?.message}</Text>}
                labelCol={{ style: { paddingBottom: proStyle.ProFormText.labelCol.style.padding } }}
              />
            )}
          />

          <Controller
            name="amount"
            control={control}
            render={(form) => (
              <ProFormMoney
                {...form.field}
                label="Amount"
                locale="id-ID"
                placeholder={'Amount'}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.amount && 'error'}
                extra={<Text style={{ fontSize: 12 }} type="danger">{errors?.amount?.message}</Text>}
                labelCol={{ style: { paddingBottom: proStyle.ProFormText.labelCol.style.padding } }}
              />
            )}
          />

          <Controller
            name="asset"
            control={control}
            render={(form) => (
              <ProFormSelect
                {...form.field}
                label="Asset"
                placeholder="Select Asset"
                showSearch
                request={proFormSelectRequestFunction({ url: '/api/v1/assets', key: 'assets', labelKey: 'name', valueKey: 'id' })}
                debounceTime={300}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.asset && 'error'}
                extra={<Text style={{ fontSize: 12 }} type="danger">{errors?.asset?.message}</Text>}
                labelCol={{ style: { paddingBottom: proStyle.ProFormText.labelCol.style.padding } }}
                fieldProps={{ allowClear: true, loading: form.field.value === undefined }}
              />
            )}
          />

          <Controller
            name="employee"
            control={control}
            render={(form) => (
              <ProFormSelect
                {...form.field}
                label="Employee"
                placeholder="Select Employee"
                showSearch
                request={proFormSelectRequestFunction({ url: '/api/v1/employees', key: 'employees', labelKey: 'name', valueKey: 'id' })}
                debounceTime={300}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.employee && 'error'}
                extra={<Text style={{ fontSize: 12 }} type="danger">{errors?.employee?.message}</Text>}
                labelCol={{ style: { paddingBottom: proStyle.ProFormText.labelCol.style.padding } }}
                fieldProps={{ allowClear: true, loading: form.field.value === undefined }}
              />
            )}
          />

          <Controller
            name="maintenance_type"
            control={control}
            render={(form) => (
              <ProFormSelect
                {...form.field}
                label="Maintenance Type"
                placeholder="Select Maintenance Type"
                showSearch
                request={proFormSelectRequestFunction({ url: '/api/v1/maintenance_types', key: 'maintenance_types', labelKey: 'name', valueKey: 'id' })}
                debounceTime={300}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.maintenance_type && 'error'}
                extra={<Text style={{ fontSize: 12 }} type="danger">{errors?.maintenance_type?.message}</Text>}
                labelCol={{ style: { paddingBottom: proStyle.ProFormText.labelCol.style.padding } }}
                fieldProps={{ allowClear: true, loading: form.field.value === undefined }}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={(form) => (
              <ProFormTextArea
                {...form.field}
                label="Description"
                placeholder={''}
                validateStatus={errors.description && 'error'}
                extra={<Text style={{ fontSize: 12 }} type="danger">{errors?.description?.message}</Text>}
                labelCol={{ style: { paddingBottom: proStyle.ProFormText.labelCol.style.padding } }}
              />
            )}
          />

          <Controller
            name="attachment"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <ProFormUploadButton
                {...field}
                label="Attachment"
                title="Upload File"
                max={1}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.attachment && 'error'}
                extra={<Text style={{ fontSize: 12 }} type="danger">{errors?.attachment?.message}</Text>}
                labelCol={{ style: { paddingBottom: proStyle.ProFormText.labelCol.style.padding } }}
                fieldProps={{
                  name: 'attachment',
                  listType: 'text',
                  accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls',
                  fileList: Array.isArray(value) ? value : [],
                  onChange: ({ fileList }) => { onChange(fileList); },
                  beforeUpload: () => false,
                }}
              />
            )}
          />
        </ProForm.Group>
      </ProForm>
    </Card>
  );
};

export default Forms;