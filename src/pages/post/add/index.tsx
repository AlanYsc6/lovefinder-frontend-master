import { POST_GENDER_ENUM } from '@/constants/post';
import { addPost } from '@/services/postService';
import {
  PageContainer,
  ProForm,
  ProFormDigit,
  ProFormItem,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { AutoComplete, message } from 'antd';
import React from 'react';

/**
 * 帖子创建页面
 * @constructor
 */
const PostAddPage: React.FC<unknown> = () => {
  const { initialState } = useModel('@@initialState');
  const tagMap = initialState?.tagMap || {};

  /**
   * 根据分类获取标签选项数组
   * @param category
   */
  const getOptions = (category: string) => {
    if (!category || !tagMap[category]) {
      return [];
    }
    return tagMap[category].map((tag) => {
      return {
        value: tag.tagName,
        label: tag.tagName,
      };
    });
  };

  /**
   * 创建
   * @param fields
   */
  const doAdd = async (fields: PostType.PostAddRequest) => {
    const hide = message.loading('正在提交');
    try {
      await addPost(fields);
      message.success('创建成功');
    } catch (e: any) {
      message.error('创建失败，请重试！', e.message);
    } finally {
      hide();
    }
  };

  /**
   * AutoComplete 过滤函数
   * @param inputValue
   * @param option
   */
  const filterOption = (inputValue: string, option: any) =>
    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

  return (
    <PageContainer title="请留下您的寻爱信号">
      <ProForm<PostType.PostAddRequest>
        onFinish={async (values) => {
          doAdd(values);
        }}
        requiredMark={false}
        labelAlign="left"
        labelCol={{
          xs: 24,
          sm: 4,
          md: 3,
          xl: 2,
        }}
        wrapperCol={{
          xs: 24,
          sm: 20,
          md: 16,
          xl: 14,
        }}
        submitter={{
          submitButtonProps: {
            style: {
              minWidth: 160,
            },
          },
          render: (props, dom) => [...dom.reverse()],
        }}
      >
        <ProFormDigit min={18} max={100} name="age" label="年龄" required />
        <ProFormSelect
          options={POST_GENDER_ENUM}
          name="gender"
          label="性别"
          required
          showSearch
        />
        <ProFormItem label="地点" name="place" required>
          <AutoComplete
            placeholder="请输入"
            options={getOptions('地点')}
            filterOption={filterOption}
          />
        </ProFormItem>
        <ProFormItem label="职业" name="job" required>
          <AutoComplete
            placeholder="请输入"
            options={getOptions('职业')}
            filterOption={filterOption}
          />
        </ProFormItem>
        <ProFormSelect
          options={getOptions('学历')}
          name="education"
          label="学历"
          required
          showSearch
        />
        <ProFormSelect
          options={getOptions('感情经历')}
          name="loveExp"
          label="感情经历"
          required
          showSearch
        />
        <ProFormText
          name="contact"
          label="联系方式"
          placeholder="请输入手机或微信号"
          required
        />
        <ProFormText
          name="photo"
          label="照片"
          placeholder="请输入 url 地址"
          rules={[{ type: 'url' }]}
          required
        />
        <ProFormTextArea
          name="content"
          label="个人介绍"
          required
          fieldProps={{
            autoSize: { minRows: 4 },
          }}
        />
      </ProForm>
    </PageContainer>
  );
};

export default PostAddPage;
