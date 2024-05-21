/**
 * 帖子类型定义
 */
declare namespace ReportType {
  /**
   * 实体
   */
  interface Report {
    id: number;
    content: string;
    reportedId: number;
    reportedUserId: number;
    status: number;
    userId: number;
    createTime: Date;
    updateTime: Date;
  }

  /**
   * 创建请求
   */
  interface ReportAddRequest {
    content: string;
    reportedId: number;
  }

  /**
   * 更新请求
   */
  interface ReportUpdateRequest {
    id: number;
    content?: string;
    reportedId?: number;
    status?: number;
  }

  /**
   * 查询请求
   */
  interface ReportQueryRequest extends PageRequest {
    content?: string;
    reportedId?: number;
    reportedUserId?: number;
    status?: number;
  }
}
