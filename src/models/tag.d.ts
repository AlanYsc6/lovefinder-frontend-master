/**
 * 标签类型定义
 */
declare namespace TagType {
  /**
   * 实体
   */
  interface Tag {
    id?: number;
    category: string;
    tagName: string;
    userId: number;
    createTime?: Date;
    updateTime?: Date;
  }

  /**
   * 创建请求
   */
  interface TagAddRequest {
    category: string;
    tagName: string;
  }

  /**
   * 分页查询请求
   */
  interface TagQueryRequest extends PageRequest {
    category?: string;
    tagName?: string;
    userId?: number;
  }

  /**
   * 标签分组
   */
  type TagMap = Record<string, Tag[]>;
}
