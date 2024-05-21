/**
 * 帖子类型定义
 */
declare namespace PostType {
  type Gender = 0 | 1;

  /**
   * 实体
   */
  interface Post {
    id: number;
    age: number;
    gender: Gender;
    education: string;
    place: string;
    job: string;
    contact: string;
    loveExp: string;
    content: string;
    photo: string;
    reviewStatus: number;
    reviewMessage?: string;
    viewNum: number;
    thumbNum: number;
    userId: number;
    createTime: Date;
    updateTime: Date;
  }

  /**
   * 视图
   */
  interface PostVO extends Post {
    hasThumb: boolean;
  }

  /**
   * 创建请求
   */
  interface PostAddRequest {
    age: number;
    gender: Gender;
    education: string;
    place: string;
    job: string;
    contact: string;
    loveExp: string;
    content: string;
    photo: string;
  }

  /**
   * 删除请求
   */
  interface PostDeleteRequest {
    id: number;
  }

  /**
   * 更新请求
   */
  interface PostUpdateRequest {
    id: number;
    age?: number;
    gender?: Gender;
    education?: string;
    place?: string;
    job?: string;
    contact?: string;
    loveExp?: string;
    content?: string;
    photo?: string;
    reviewStatus?: number;
    reviewMessage?: string;
  }

  /**
   * 查询请求
   */
  interface PostQueryRequest extends PageRequest {
    education?: string;
    place?: string;
    job?: string;
    contact?: string;
    loveExp?: string;
    content?: string;
    userId?: number;
    reviewStatus?: number;
  }

  /**
   * 帖子点赞请求
   */
  interface PostDoThumbRequest {
    postId: number;
  }
}
