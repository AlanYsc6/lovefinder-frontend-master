import { deletePost, listPostByPage, updatePost } from '@/services/postService';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Divider, message, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

/**
 * 帖子管理页面
 * @constructor
 */
const AdminPostPage: React.FC<unknown> = () => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<PostType.Post>(
    {} as PostType.Post,
  );
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const tagMap = initialState?.tagMap || {};

  /**
   * 根据分类获取标签选项数组
   * @param category
   */
  const getValueEnum = (category: string) => {
    if (!category || !tagMap[category]) {
      return [];
    }
    const tempValueEnum: any = {};
    tagMap[category].forEach((tag) => {
      tempValueEnum[tag.tagName] = {
        text: tag.tagName,
      };
    });
    return tempValueEnum;
  };

  /**
   * 删除节点
   * @param post
   */
  const doDelete = async (post: PostType.Post) => {
    const hide = message.loading('正在删除');
    if (!post?.id) {
      return;
    }
    try {
      await deletePost({
        id: post.id,
      });
      message.success('操作成功');
      actionRef.current?.reload();
    } catch (e: any) {
      message.error('操作失败，' + e.message);
    } finally {
      hide();
    }
  };

  /**
   * 更新审核状态
   * @param post
   * @param reviewStatus
   */
  const updateReviewStatus = async (
    post: PostType.Post,
    reviewStatus: number,
  ) => {
    const hide = message.loading('处理中');
    try {
      await updatePost({
        id: post.id,
        reviewStatus,
      });
      message.success('操作成功');
      actionRef.current?.reload();
    } catch (e: any) {
      message.error('操作失败，' + e.message);
    } finally {
      hide();
    }
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<PostType.Post>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: {
        0: { text: '男' },
        1: { text: '女' },
      },
    },
    {
      title: '学历',
      dataIndex: 'education',
      valueEnum: getValueEnum('学历'),
      fieldProps: {
        showSearch: true,
      },
    },
    {
      title: '地点',
      dataIndex: 'place',
      valueEnum: getValueEnum('地点'),
      fieldProps: {
        showSearch: true,
      },
    },
    {
      title: '职业',
      dataIndex: 'job',
      valueEnum: getValueEnum('职业'),
      fieldProps: {
        showSearch: true,
      },
      width: 120,
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
    },
    {
      title: '感情经历',
      dataIndex: 'loveExp',
      valueEnum: getValueEnum('感情经历'),
      fieldProps: {
        showSearch: true,
      },
    },
    {
      title: '个人介绍',
      dataIndex: 'content',
      valueType: 'textarea',
      width: 400,
    },
    {
      title: '照片',
      dataIndex: 'photo',
      valueType: 'image',
      hideInSearch: true,
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
    },
    {
      title: '审核信息',
      dataIndex: 'reviewMessage',
    },
    {
      title: '点赞数',
      dataIndex: 'thumbNum',
      valueType: 'text',
      sorter: true,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '创建者',
      dataIndex: 'userId',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Typography.Link
            onClick={() => {
              setUpdateData(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          {record.reviewStatus !== 1 && (
            <Typography.Link
              onClick={() => {
                updateReviewStatus(record, 1);
              }}
            >
              通过
            </Typography.Link>
          )}
          {record.reviewStatus !== 2 && (
            <Typography.Link
              type="danger"
              onClick={() => {
                updateReviewStatus(record, 2);
              }}
            >
              拒绝
            </Typography.Link>
          )}
          <Popconfirm
            title="您确定要删除么？"
            onConfirm={() => doDelete(record)}
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
      <ProTable<PostType.Post>
        headerTitle="帖子管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
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
          const searchParams: PostType.PostQueryRequest = {
            ...params,
          };
          // eslint-disable-next-line guard-for-in
          for (const key in sorter) {
            searchParams.sortField = key;
            searchParams.sortOrder = sorter[key] as any;
          }
          const { data, code } = await listPostByPage(searchParams);
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
      <UpdateModal
        modalVisible={updateModalVisible}
        oldData={updateData}
        columns={columns}
        onSubmit={() => {}}
        onCancel={() => setUpdateModalVisible(false)}
      />
    </PageContainer>
  );
};

export default AdminPostPage;
