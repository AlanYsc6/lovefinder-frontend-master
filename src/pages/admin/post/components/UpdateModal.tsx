import { updatePost } from '@/services/postService';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

interface UpdateModalProps {
  oldData: PostType.Post;
  modalVisible: boolean;
  columns: ProColumns<PostType.Post>[];
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * 更新数据模态框
 * @param fields
 */
const handleUpdate = async (fields: PostType.Post) => {
  const hide = message.loading('正在更新');
  try {
    await updatePost(fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

/**
 * 更新数据模态框
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<PropsWithChildren<UpdateModalProps>> = (props) => {
  const { oldData, columns, modalVisible, onSubmit, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="更新"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProTable<PostType.Post, PostType.Post>
        onSubmit={async (value) => {
          const success = await handleUpdate({
            ...value,
            id: oldData.id,
          });
          if (success) {
            onSubmit?.();
          }
        }}
        rowKey="id"
        type="form"
        form={{
          initialValues: oldData,
        }}
        columns={columns}
      />
    </Modal>
  );
};

export default UpdateModal;
