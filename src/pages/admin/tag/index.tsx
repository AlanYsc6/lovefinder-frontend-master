import {
  deleteTag,
  listTagByPage,
  listTagCategory,
} from '@/services/tagService';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message, Popconfirm, Space, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CreateModal from './components/CreateModal';

/**
 *  删除节点
 * @param selectedRows
 */
const doDelete = async (selectedRows: TagType.Tag[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteTag({
      id: selectedRows.find((row) => row.id)?.id || 0,
    });
    message.success('操作成功');
  } catch (e: any) {
    message.error('操作失败，' + e.message);
  } finally {
    hide();
  }
};

/**
 * 标签管理页面
 * @constructor
 */
const AdminTagPage: React.FC<unknown> = () => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [categoryValueEnum, setCategoryValueEnum] = useState<any>({});

  useEffect(() => {
    listTagCategory()
      .then((res) => {
        const tempValueEnum: any = {};
        res.data.forEach((category) => {
          tempValueEnum[category] = {
            text: category,
          };
        });
        setCategoryValueEnum(tempValueEnum);
      })
      .catch((e) => {
        message.error('获取标签分类列表失败，' + e.message);
      });
  }, []);

  /**
   * 表格列配置
   */
  const columns: ProColumns<TagType.Tag>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: '分类',
      dataIndex: 'category',
      valueEnum: categoryValueEnum,
    },
    {
      title: '名称',
      dataIndex: 'tagName',
      valueType: 'text',
    },
    {
      title: '帖子数',
      dataIndex: 'postNum',
      sorter: true,
      defaultSortOrder: "descend",
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Popconfirm
            title="您确定要删除么？"
            onConfirm={() => doDelete([record])}
            okText="确认"
            cancelText="取消"
          >
            <Typography.Link type="danger">删除</Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TagType.Tag>
        headerTitle="标签管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (params, sorter) => {
          const searchParams: TagType.TagQueryRequest = {
            ...params,
          };
          // eslint-disable-next-line guard-for-in
          for (const key in sorter) {
            searchParams.sortField = key;
            searchParams.sortOrder = sorter[key] as any;
          }
          const { data, code } = await listTagByPage(searchParams);
          return {
            data: data?.records || [],
            success: code === 0,
            total: data.total,
          } as any;
        }}
        columns={columns}
      />
      <CreateModal
        modalVisible={createModalVisible}
        columns={columns}
        onSubmit={() => {}}
        onCancel={() => setCreateModalVisible(false)}
      />
    </PageContainer>
  );
};

export default AdminTagPage;
