import { POST } from '@/web/common/api/request';

type apiReturnType = {
  [key: string]: any;
};

// 获取问答列表
export const getQAListApi = (data: object) =>
  POST<apiReturnType>('/get_qa', data, {
    baseURL: '/qa_api'
  });

// 获取问答详情
export const getQADetailApi = (data: { app_id: string; id: number }) =>
  POST<apiReturnType>('/get_one_qa', data, {
    baseURL: '/qa_api'
  });

// 创建问答
export const createQAApi = (data: object) =>
  POST<apiReturnType>('/create_qa', data, {
    baseURL: '/qa_api'
  });

// 修改问答详情
export const upDateQAApi = (data: object) =>
  POST<apiReturnType>('/update_qa', data, {
    baseURL: '/qa_api'
  });

// 删除问答详情
export const removeQAApi = (data: { auth: string; app_id: string; id: number[] }) =>
  POST<apiReturnType>('/remove_qa', data, {
    baseURL: '/qa_api'
  });
