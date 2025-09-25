import proStyle from '@/styles/proComponentStyle';
import proFormSelectRequestFunction from '@/utils/services/proFormSelectRequestFunction';
import {
  ProForm,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Button, Card, Flex, Typography } from 'antd';
import { LucideDownload } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router';

const { Title, Text } = Typography;

const Forms = ({
  title,
  control,
  isLoading,
  isSubmitting,
  handleSubmit,
  isDetail = false,
  errors,
}) => {
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
        readonly={isDetail}
        onFinish={handleSubmit}
        onReset={() => navigate(-1)}
        submitter={{
          submitButtonProps: {
            disabled: isLoading || isSubmitting,
            loading: isLoading || isSubmitting,
            style: {
              display: isDetail ? 'none' : 'inline-block',
            },
          },
          searchConfig: {
            submitText: 'Save',
            resetText: 'Close',
          },
        }}
      >
        <ProForm.Group>
          <Controller
            name="name"
            control={control}
            render={(form) => (
              <ProFormText
                {...form.field}
                label="Name"
                placeholder={''}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.name && 'error'}
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.name?.message}
                  </Text>
                }
                labelCol={{
                  style: {
                    //ant-form-item-label padding
                    paddingBottom: proStyle.ProFormText.labelCol.style.padding,
                  },
                }}
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
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.code?.message}
                  </Text>
                }
                labelCol={{
                  style: {
                    //ant-form-item-label padding
                    paddingBottom: proStyle.ProFormText.labelCol.style.padding,
                  },
                }}
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            render={(form) => (
              <ProFormMoney
                {...form.field}
                label="Price"
                placeholder="Enter price"
                min={0}
                locale="id-ID"
                precision={2}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.price && 'error'}
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.price?.message}
                  </Text>
                }
                labelCol={{
                  style: {
                    //ant-form-item-label padding
                    paddingBottom: proStyle.ProFormText.labelCol.style.padding,
                  },
                }}
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            render={(form) => (
              <ProFormSelect
                {...form.field}
                label="Category"
                placeholder="Select Category"
                showSearch
                request={proFormSelectRequestFunction({
                  url: '/api/v1/categories',
                  key: 'category',
                  labelKey: 'name',
                  valueKey: 'id',
                })}
                debounceTime={300}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.category && 'error'}
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.category?.message}
                  </Text>
                }
                labelCol={{
                  style: {
                    //ant-form-item-label padding
                    paddingBottom: proStyle.ProFormText.labelCol.style.padding,
                  },
                }}
                fieldProps={{
                  allowClear: true,
                  loading: form.field.value === undefined,
                }}
              />
            )}
          />
        </ProForm.Group>

        <ProForm.Group>
          <Controller
            name="status"
            control={control}
            render={(form) => (
              <ProFormSelect
                {...form.field}
                label="Status"
                placeholder="Select Status"
                options={[
                  { label: 'Available', value: 'available' },
                  { label: 'Unavailable', value: 'unavailable' },
                ]}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.status && 'error'}
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.status?.message}
                  </Text>
                }
                labelCol={{
                  style: {
                    //ant-form-item-label padding
                    paddingBottom: proStyle.ProFormText.labelCol.style.padding,
                  },
                }}
              />
            )}
          />
        </ProForm.Group>

        <ProForm.Group>
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
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.attachment?.message}
                  </Text>
                }
                labelCol={{
                  style: {
                    //ant-form-item-label padding
                    paddingBottom: proStyle.ProFormText.labelCol.style.padding,
                  },
                }}
                fieldProps={{
                  name: 'attachment',
                  listType: 'text',
                  accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls',
                  fileList: value || [],
                  onChange: ({ fileList }) => {
                    onChange(fileList);
                  },
                  beforeUpload: () => false, // Prevent auto upload
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
