import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Card, Col, Row } from 'antd';
import { Flex } from 'antd';
import { Typography } from 'antd';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router';

import proStyle from '@/styles/proComponentStyle';
import { LucideDownload } from 'lucide-react';

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
      <ProForm
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
        <Flex justify="space-between">
          <Title level={3}>{title}</Title>
          <Button variant="outlined" color="primary">
            <LucideDownload size={16} />
            Import From CSV
          </Button>
        </Flex>
        <Row gutter={[16]}>
          <Col xs={24} md={24} lg={6}>
            <Controller
              name="code"
              control={control}
              render={(form) => (
                <div>
                  <ProFormText
                    {...form.field}
                    label="Code"
                    placeholder={''}
                    validateStatus={errors.code && 'error'}
                    extra={
                      <Text style={{ fontSize: 12 }} type="danger">
                        {errors?.code?.message}
                      </Text>
                    }
                    labelCol={{
                      style: {
                        //ant-form-item-label padding
                        paddingBottom:
                          proStyle.ProFormText.labelCol.style.padding,
                      },
                    }}
                  />
                </div>
              )}
            />
          </Col>
          <Col xs={24} md={24} lg={6}>
            <Controller
              name="name"
              control={control}
              render={(form) => (
                <div>
                  <ProFormText
                    {...form.field}
                    label="Name"
                    placeholder={''}
                    validateStatus={errors.name && 'error'}
                    extra={
                      <Text style={{ fontSize: 12 }} type="danger">
                        {errors?.name?.message}
                      </Text>
                    }
                    labelCol={{
                      style: {
                        //ant-form-item-label padding
                        paddingBottom:
                          proStyle.ProFormText.labelCol.style.padding,
                      },
                    }}
                  />
                </div>
              )}
            />
          </Col>
          <Col xs={24} md={24} lg={6}>
            <Controller
              name="email"
              control={control}
              render={(form) => (
                <div>
                  <ProFormText
                    {...form.field}
                    label="Email"
                    placeholder={''}
                    validateStatus={errors.email && 'error'}
                    extra={
                      <Text style={{ fontSize: 12 }} type="danger">
                        {errors?.email?.message}
                      </Text>
                    }
                    labelCol={{
                      style: {
                        //ant-form-item-label padding
                        paddingBottom:
                          proStyle.ProFormText.labelCol.style.padding,
                      },
                    }}
                  />
                </div>
              )}
            />
          </Col>
          <Col xs={24} md={24} lg={6}>
            <Controller
              name="position"
              control={control}
              render={(form) => (
                <div>
                  <ProFormText
                    {...form.field}
                    label="Position"
                    placeholder={''}
                    validateStatus={errors.position && 'error'}
                    extra={
                      <Text style={{ fontSize: 12 }} type="danger">
                        {errors?.position?.message}
                      </Text>
                    }
                    labelCol={{
                      style: {
                        //ant-form-item-label padding
                        paddingBottom:
                          proStyle.ProFormText.labelCol.style.padding,
                      },
                    }}
                  />
                </div>
              )}
            />
          </Col>
          <Col xs={24} md={24} lg={6}>
            <Controller
              name="contact_type"
              control={control}
              render={(form) => (
                <div>
                  <ProFormSelect
                    {...form.field}
                    label="Contact Type"
                    placeholder="Select contact type"
                    validateStatus={errors.contact_type && 'error'}
                    extra={
                      <Text style={{ fontSize: 12 }} type="danger">
                        {errors?.contact_type?.message}
                      </Text>
                    }
                    options={[
                      { label: 'Customer', value: 'customer' },
                      { label: 'Supplier', value: 'supplier' },
                      { label: 'Employee', value: 'employee' },
                      { label: 'Salesman', value: 'salesman' },
                    ]}
                    labelCol={{
                      style: {
                        //ant-form-item-label padding
                        paddingBottom:
                          proStyle.ProFormText.labelCol.style.padding,
                      },
                    }}
                  />
                </div>
              )}
            />
          </Col>
          <Col xs={24} md={24} lg={18}>
            <Controller
              name="address"
              control={control}
              render={(form) => (
                <div>
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
                        paddingBottom:
                          proStyle.ProFormText.labelCol.style.padding,
                      },
                    }}
                  />
                </div>
              )}
            />
          </Col>
        </Row>
      </ProForm>
    </Card>
  );
};

export default Forms;
