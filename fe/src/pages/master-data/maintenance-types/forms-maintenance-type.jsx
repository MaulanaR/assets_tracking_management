import proStyle from '@/styles/proComponentStyle';
import { ProFormSwitch } from '@ant-design/pro-components';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
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
            name="description"
            control={control}
            render={(form) => (
              <ProFormTextArea
                {...form.field}
                label="Description"
                placeholder={''}
                validateStatus={errors.description && 'error'}
                extra={
                  <Text style={{ fontSize: 12 }} type="danger">
                    {errors?.description?.message}
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
            name="is_active"
            control={control}
            render={(form) => (
              <ProFormSwitch
                {...form.field}
                label="Status"
                TextRight="Active"
                colProps={{ xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }}
                validateStatus={errors.is_active && 'error'}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
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