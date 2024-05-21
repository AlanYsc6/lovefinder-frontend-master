import { addTag } from '@/services/tagService';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

interface CreateModalProps {
  modalVisible: boolean;
  columns: ProColumns<TagType.Tag>[];
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * 创建数据模态框
 * @param props
 * @constructor
 */
const CreateModal: React.FC<PropsWithChildren<CreateModalProps>> = (props) => {
  const { modalVisible, columns, onSubmit, onCancel } = props;

  /**
   * 添加
   * @param fields
   */
  const handleAdd = async (fields: TagType.Tag) => {
    const hide = message.loading('正在添加');
    try {
      await addTag({ ...fields } as TagType.TagAddRequest);
      message.success('添加成功');
      onSubmit?.();
    } catch (error) {
      message.error('添加失败请重试！');
    } finally {
      hide();
    }
  };

  return (
    <Modal
      destroyOnClose
      title="新建"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProTable<TagType.Tag, TagType.Tag>
        onSubmit={(value) => {
          handleAdd(value);
        }}
        rowKey="id"
        type="form"
        columns={columns}
      />
    </Modal>
  );
};

export default CreateModal;
