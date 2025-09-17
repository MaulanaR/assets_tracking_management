import SelectWithReactQuery from '@/components/SelectWithReactQuery';
import proStyle from '@/styles/proComponentStyle';
import { fetchSelect } from '@/utils/services/fetchSelect';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
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
            name="department"
            control={control}
            render={(form) => (
              <SelectWithReactQuery
                {...form.field}
                url="/api/v1/departments"
                label="Department"
                placeholder="Select Department"
                queryKey={['departments']}
                customFetcher={fetchSelect}
                labelKey="name"
                valueKey="name"
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.department && 'error'}
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.department?.message}
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
            name="branch"
            control={control}
            render={(form) => (
              <SelectWithReactQuery
                {...form.field}
                url="/api/v1/branches"
                label="Branch"
                placeholder="Select Branch"
                queryKey={['branches']}
                customFetcher={fetchSelect}
                labelKey="name"
                valueKey="id"
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.branch && 'error'}
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.branch?.message}
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
            name="phone"
            control={control}
            render={(form) => (
              <ProFormText
                {...form.field}
                label="Phone"
                placeholder={''}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.phone && 'error'}
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.phone?.message}
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
            name="email"
            control={control}
            render={(form) => (
              <ProFormText
                {...form.field}
                label="Email"
                placeholder={''}
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.email && 'error'}
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.email?.message}
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

        <ProForm.Group>
          <Controller
            name="address"
            control={control}
            render={(form) => (
              <ProFormTextArea
                {...form.field}
                label="Address"
                placeholder={''}
                validateStatus={errors.address && 'error'}
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.address?.message}
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
      </ProForm>
    </Card>
  );
};

export default Forms;
