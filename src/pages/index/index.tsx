import ReportModal from '@/components/ReportModal';
import { listPostByPage, postDoThumb } from '@/services/postService';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import {
  LightFilter,
  PageContainer,
  ProFormSelect,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import {
  Button,
  Divider,
  Image,
  Input,
  List,
  message,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';

// 默认分页大小
const DEFAULT_PAGE_SIZE = 10;

/**
 * 主页
 *
 * @constructor
 * @author yupi
 */
const IndexPage: React.FC = () => {
  const [postList, setPostList] = useState<PostType.PostVO[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const initSearchParams: PostType.PostQueryRequest = {
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    // 只展示已审核通过的
    reviewStatus: 1,
    sortField: 'createTime',
    sortOrder: 'descend',
  };
  const [searchParams, setSearchParams] =
    useState<PostType.PostQueryRequest>(initSearchParams);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportedId, setReportedId] = useState(0);
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

  // 加载数据
  useEffect(() => {
    setLoading(true);
    listPostByPage(searchParams)
      .then((res) => {
        setPostList(res.data.records);
        setTotal(res.data.total);
      })
      .catch((e) => {
        message.error('加载失败，' + e.message);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const sortSelect = (
    <Select
      size="large"
      placeholder="排序"
      defaultValue="createTime"
      onChange={(value: string) => {
        setSearchParams({ ...searchParams, sortField: value });
      }}
    >
      <Select.Option value="createTime">最新</Select.Option>
      <Select.Option value="thumbNum">人气</Select.Option>
    </Select>
  );

  /**
   * 点赞 / 取消点赞
   * @param post
   * @param index
   */
  const doThumb = async (post: PostType.PostVO) => {
    try {
      const res = await postDoThumb({ postId: post.id });
      const changeThumbNum = res.data;
      post.hasThumb = !post.hasThumb;
      post.thumbNum += changeThumbNum;
      setPostList([...postList]);
    } catch (e: any) {
      message.error('操作失败，请重试！', e.message);
    }
  };

  return (
    <div id="indexPage">
      <div className="banner">
        <Space direction="vertical" size="large" className="search-wrapper">
          <Typography.Title level={2} className="title">
            快来寻找你的另一半
          </Typography.Title>
          <Input.Search
            size="large"
            placeholder="你理想的另一半是怎样的呢？"
            allowClear
            onSearch={(value) => {
              setSearchParams({
                ...searchParams,
                ...initSearchParams,
                content: value,
              });
            }}
          />
          <LightFilter
            bordered
            onFinish={async (values) => {
              setSearchParams({
                content: searchParams.content,
                ...initSearchParams,
                ...values,
              });
            }}
          >
            <ProFormSelect
              options={getOptions('职业')}
              name="job"
              label="职业"
              required
              showSearch
            />
            <ProFormSelect
              options={getOptions('地点')}
              name="place"
              label="地点"
              required
              showSearch
            />
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
          </LightFilter>
        </Space>
      </div>
      <PageContainer
        title={`爱情信号（${total}）`}
        className="post-list-wrapper"
        extra={sortSelect}
      >
        <List
          itemLayout="vertical"
          size="large"
          loading={loading}
          pagination={{
            total,
            onChange: (current) => {
              setSearchParams({ ...searchParams, current });
              window.scrollTo({
                top: 0,
              });
            },
            pageSize: DEFAULT_PAGE_SIZE,
          }}
          dataSource={postList}
          renderItem={(post, index) => (
            <List.Item
              key={index}
              extra={<Image height={240} src={post.photo} />}
            >
              <Space direction="vertical">
                <div style={{ marginBottom: '1em' }}>
                  <Tag>{post.age} 岁</Tag>
                  <Tag>{post.gender ? '女' : '男'}</Tag>
                  <Tag>{post.job}</Tag>
                  <Tag>{post.education}</Tag>
                  <Tag>{post.place}</Tag>
                  <Tag>{post.loveExp}</Tag>
                  <Tag>{post.contact}</Tag>
                </div>
                <Typography.Paragraph
                  ellipsis={{ rows: 12, expandable: true, symbol: '展开' }}
                >
                  {post.content}
                </Typography.Paragraph>
                <Space
                  split={<Divider type="vertical" />}
                  style={{ fontSize: 14 }}
                >
                  <Typography.Text type="secondary">
                    {post.createTime.toString().split('T')[0]}
                  </Typography.Text>
                  <Button type="text" onClick={() => doThumb(post)}>
                    <Space>
                      {post.hasThumb ? <LikeFilled /> : <LikeOutlined />}
                      {post.thumbNum}
                    </Space>
                  </Button>
                  <Button
                    type="text"
                    onClick={() => {
                      setReportedId(post.id);
                      setReportModalVisible(true);
                    }}
                  >
                    反馈
                  </Button>
                </Space>
              </Space>
            </List.Item>
          )}
        />
      </PageContainer>
      <ReportModal
        visible={reportModalVisible}
        reportedId={reportedId}
        onClose={() => {
          setReportModalVisible(false);
        }}
      />
    </div>
  );
};

export default IndexPage;
