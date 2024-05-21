/**
 * 帖子服务
 */
import { request } from '@umijs/max';

/**
 * 分页获取列表
 * @param params
 */
export async function listPostByPage(params: PostType.PostQueryRequest) {
  return request<BaseResponse<PageInfo<PostType.PostVO>>>('/post/list/page', {
    method: 'GET',
    params,
  });
}

/**
 * 创建
 * @param params
 */
export async function addPost(params: PostType.PostAddRequest) {
  return request<BaseResponse<number>>('/post/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

/**
 * 根据 id 查询
 * @param id
 */
export async function getPostById(id: number) {
  return request<BaseResponse<PostType.Post>>(`/post/get`, {
    method: 'GET',
    params: { id },
  });
}

/**
 * 更新
 * @param params
 */
export async function updatePost(params: PostType.PostUpdateRequest) {
  return request<BaseResponse<boolean>>(`/post/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

/**
 * 删除
 * @param params
 */
export async function deletePost(params: PostType.PostDeleteRequest) {
  return request<BaseResponse<boolean>>(`/post/delete`, {
    method: 'POST',
    params: { ...params },
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

/**
 * 点赞 / 取消点赞
 * @param params
 */
export async function postDoThumb(params: PostType.PostDoThumbRequest) {
  return request<BaseResponse<number>>(`/post/thumb`, {
    method: 'POST',
    params: { ...params },
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}
