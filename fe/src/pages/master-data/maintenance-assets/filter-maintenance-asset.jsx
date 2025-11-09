import { ProForm } from '@ant-design/pro-components';
import { Col, DatePicker, Modal, Row, Typography } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

const { Title } = Typography;

export default function FilterMaintenanceAsset() {
  const navigate = useNavigate();

  const { handleSubmit, control, formState: { isSubmitting, isLoading } } = useForm({
    defaultValues: { date: null },
  });

  const handleClose = () => { navigate(-1); };

  const onSubmit = (data) => {
    const filterParams = {};
    if (data.date) { filterParams.date = data.date.format('YYYY-MM-DD'); }
    const queryParams = new URLSearchParams(filterParams).toString();
    navigate(`/master-data/maintenance-assets/list?${queryParams}`, { replace: true });
  };

  return (
    <Modal open={true} onCancel={handleClose} footer={null}>
      <Title level={3}>{'Filter'}</Title>
      <ProForm
        disabled={isLoading || isSubmitting}
        onFinish={handleSubmit(onSubmit)}
        onReset={() => navigate(-1)}
        submitter={{
          submitButtonProps: { disabled: isLoading || isSubmitting, loading: isLoading || isSubmitting },
          searchConfig: { submitText: 'Save', resetText: 'Close' },
        }}
      >
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} placeholder="Select date" style={{ width: '100%' }} format="YYYY-MM-DD" />
              )}
            />
          </Col>
        </Row>
      </ProForm>
    </Modal>
  );
}