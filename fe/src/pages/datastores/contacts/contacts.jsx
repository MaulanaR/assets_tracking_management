import {
  Breadcrumb,
  Button,
  Card,
  Flex,
  Input,
  Space,
  Table,
  Typography,
} from 'antd';
import { createStyles } from 'antd-style';
import {
  ListFilterIcon,
  LucideDownload,
  MoreVertical,
  RefreshCcw,
} from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

import ContextMenuOption from '@/blocs/ContextMenuOption';
import { useDataQuery } from '@/utils/hooks/useDataQuery';
import { useDebouncedSearchParams } from '@/utils/hooks/useDebouncedSearchParams';
import useExportCSV from '@/utils/hooks/useExportCSV';
import renderTags from '@/utils/renderTags';
import { Trash2 } from 'lucide-react';

// styles variables
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

//default variables
const ENDPOINTS = '/api/v1/contacts';
const DEFAULT_PER_PAGE = 10;
const DEFAULT_PAGE = 1;
const DEFAULT_FILTERS = {
  per_page: DEFAULT_PER_PAGE,
  page: DEFAULT_PAGE,
  search_fields: 'first_name,last_name,code',
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
};

// setting table columns
const columns = [
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    width: 100,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    render: (email) => email ?? '-',
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
    render: (position) => position ?? '-',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    render: (type) => {
      const typeColors = {
        customer: 'blue',
        supplier: 'green',
        employee: 'orange',
        salesman: 'purple',
      };
      return renderTags(type, { tags: [type], color: typeColors[type] });
    },
  },
  {
    title: 'Status',
    dataIndex: 'is_active',
    key: 'is_active',
    width: 100,
    justify: 'center',
    render: (_, record) => {
      const status = record.is_active ? 'active' : 'inactive';
      return renderTags(_, { tags: [status] });
    },
  },
  {
    title: '',
    dataIndex: '',
    key: 'x',
    align: 'right',
    width: 50,
    render: (_, record) => (
      <ContextMenuOption
        editPath={`/datastores/contacts/edit/${record.id}`}
        detailPath={`/datastores/contacts/detail/${record.id}`}
        deletePath={`/datastores/contacts/delete/${record.id}`}
      >
        <Button
          variant="text"
          type="text"
          shape="circle"
          icon={<MoreVertical size={12} />}
          size={'middle'}
        />
      </ContextMenuOption>
    ),
  },
];

const { Title, Text } = Typography;
const { Search } = Input;

const TitleTableRender = ({ selectedLength }) => {
  if (selectedLength === 0) {
    return null;
  }
  return (
    <Space size={'small'}>
      <Text color="primary">Total Selected Items</Text>
      <Text color="primary">{selectedLength}</Text>
    </Space>
  );
};

// Function to render filter button
const renderFilterButton = (hasActiveFilters, clearAllParams, navigate) => {
  if (hasActiveFilters) {
    return (
      <Button
        variant="outlined"
        color="primary"
        shape="default"
        icon={<Trash2 size={12} />}
        size={'middle'}
        onClick={() => clearAllParams?.()}
      >
        Clear Filter
      </Button>
    );
  }
  return (
    <Button
      variant="outlined"
      color="primary"
      shape="default"
      icon={<ListFilterIcon size={12} />}
      size={'middle'}
      onClick={() => navigate('filter')}
    />
  );
};

// main component
const Contacts = () => {
  const navigate = useNavigate();
  const { styles } = useStyle();
  const [selectedRow, setSelectedRow] = useState([]);
  const { searchParam, updateParam, clearAllParams } =
    useDebouncedSearchParams(600);

  const allParams = Object.fromEntries(searchParam.entries());
  const currentPage = Number.parseInt(allParams.page, 10) || DEFAULT_PAGE;
  const perPage = Number.parseInt(allParams.per_page, 10) || DEFAULT_PER_PAGE;
  const searchValue = allParams.search || '';

  const currentFilters = {
    ...DEFAULT_FILTERS,
    ...allParams,
    page: currentPage,
    per_page: perPage,
  };

  const hasActiveFilters = Object.keys(allParams).length > 0;
  const { exportToCSV, isExporting } = useExportCSV({
    endpoint: ENDPOINTS,
    selectedKeys: ['id', 'name', 'code', 'emails.0.value', 'phones.0.value'],
    filename: `contacts_${moment().format('YYYY-MM-DD')}`,
    defaultParams: {
      is_skip_pagination: true,
      [`includes[${DEFAULT_FILTERS.includes.join(',')}]`]: true,
    },
  });

  const { initialData, isLoading, refetch } = useDataQuery({
    queryKey: ['contacts'],
    getUrl: ENDPOINTS,
    filters: currentFilters,
  });

  const handleSearch = (e) => {
    updateParam({ search: e.target.value, page: 1 });
  };

  const onShowSizeChange = (_, newPerPage) => {
    updateParam({ per_page: newPerPage, page: 1 });
  };

  const handleSelectRow = (selectedRowKeys, selectedRows) => {
    console.info('selectedRowKeys =>', selectedRowKeys);
    console.info('selectedRows =>', selectedRows);
    setSelectedRow(selectedRowKeys);
  };

  const onChange = (page) => {
    updateParam('page', page);
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
              title: 'Datastore',
              onClick: () => navigate('/datastore'),
            },
            {
              title: 'Contacts',
            },
          ]}
        />
        <Search
          size="large"
          placeholder="Search"
          color="primary"
          onChange={handleSearch}
          defaultValue={searchValue}
          style={{
            width: 300,
          }}
          enterButton
        />
      </Flex>
      <Card>
        <Space size={'small'} direction="vertical" style={{ display: 'flex' }}>
          <Flex justify="space-between" wrap="wrap">
            <Space size={'small'}>
              <Title level={2}>Contacts</Title>
              <Title level={3} type="secondary" strong>
                {initialData?.count}
              </Title>
            </Space>

            <Space size={'small'}>
              <Button
                variant="outlined"
                color="primary"
                shape="default"
                icon={<RefreshCcw size={12} />}
                size={'middle'}
                onClick={refetch}
              />

              {renderFilterButton(hasActiveFilters, clearAllParams, navigate)}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => exportToCSV()}
                loading={isExporting}
              >
                <LucideDownload size={16} />
                Export to CSV
              </Button>
              <Button
                variant="solid"
                color="primary"
                onClick={() => navigate('/datastores/contacts/create')}
              >
                Create
              </Button>
            </Space>
          </Flex>

          <Table
            size="middle"
            loading={isLoading}
            className={`${styles.customTable} striped-table`}
            // scroll={{ y: 55 * 10 }}
            dataSource={initialData?.results?.list ?? []}
            rowKey={'id'}
            rowSelection={{
              preserveSelectedRowKeys: true,
              type: 'checkbox',
              onChange: handleSelectRow,
              checkStrictly: true,
            }}
            columns={columns}
            title={() =>
              TitleTableRender({ selectedLength: selectedRow.length, navigate })
            }
            pagination={{
              responsive: true,
              current: currentPage,
              onChange: onChange,
              showSizeChanger: true,
              onShowSizeChange: onShowSizeChange,
              defaultPageSize: DEFAULT_PER_PAGE,
              pageSize: perPage,
              total: initialData?.count ?? 0,
              position: ['bottomLeft'],
              size: 'default',
            }}
          />
        </Space>
      </Card>
      <Outlet />
    </Flex>
  );
};

export default Contacts;
