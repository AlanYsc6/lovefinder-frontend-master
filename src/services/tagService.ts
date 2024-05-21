/**
 * 标签服务
 */
import { request } from '@umijs/max';

/**
 * 创建
 * @param params
 */
export async function addTag(params: TagType.TagAddRequest) {
  return request<BaseResponse<number>>('/tag/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

/**
 * 获取标签分组
 */
export async function getTagMap() {
  return request<BaseResponse<TagType.TagMap>>(`/tag/get/map`, {
    method: 'GET',
    params: {},
  });
}

/**
 * 分页获取列表
 * @param params
 */
export async function listTagByPage(params: TagType.TagQueryRequest) {
  return request<BaseResponse<PageInfo<TagType.Tag[]>>>('/tag/list/page', {
    method: 'GET',
    params,
  });
}

/**
 * 删除
 * @param params
 */
export async function deleteTag(params: DeleteRequest) {
  return request<BaseResponse<boolean>>(`/tag/delete`, {
    method: 'POST',
    params: { ...params },
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

/**
 * 获取标签所有的分组列表
 */
export async function listTagCategory() {
  return request<BaseResponse<string[]>>(`/tag/category/list`, {
    method: 'GET',
    params: {},
  });
}
