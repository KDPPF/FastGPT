import { useState, useRef, SetStateAction, ReactNode, Dispatch } from 'react';
import { usePagination } from '@fastgpt/web/hooks/usePaginationV2';
import { AppQAPairsListItemType } from '@/types/app';
import { createContext, useContextSelector } from 'use-context-selector';
import { getQAListApi } from '@/web/core/app/api/qaApi';
import { AppContext } from '../context';
import { useUserStore } from '@/web/support/user/useUserStore';
import { UserType } from '@fastgpt/global/support/user/type';
type QAPairsSeachModelType = {
  questions_like: string;
  qa_source: number | undefined;
  use_for_qa: number | undefined;
  update_user: string;
};

type QAPairsContextType = {
  auth: string;
  searchModel: QAPairsSeachModelType;
  setSearchModel: Dispatch<SetStateAction<QAPairsSeachModelType>>;
  isGetting: boolean;
  pageNum: number;
  pageSize: number;
  total: number;
  Pagination: () => JSX.Element;
  getData: (e: number) => void;
  QAPairsList: AppQAPairsListItemType[];
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  userInfo: UserType | null;
};

export enum QAPairsUseForQAEnum {
  不用于,
  用于
}

export enum QAPairsQASourceEnum {
  用户AI问答对 = 1,
  管理员创建的问答对,
  导入的问答对
}

export const QAPairsContext = createContext<QAPairsContextType>({
  auth: '',
  searchModel: {
    questions_like: '',
    qa_source: undefined,
    use_for_qa: undefined,
    update_user: ''
  },
  setSearchModel: function (value: SetStateAction<QAPairsSeachModelType>): void {
    throw new Error('Function not implemented.');
  },
  isGetting: false,
  Pagination: function (): JSX.Element {
    throw new Error('Function not implemented.');
  },
  total: 0,
  getData: function (e: number): void {
    throw new Error('Function not implemented.');
  },
  pageNum: 0,
  pageSize: 0,
  QAPairsList: [] as AppQAPairsListItemType[],
  showModal: false,
  setShowModal: function (value: SetStateAction<boolean>): void {
    throw new Error('Function not implemented.');
  },
  userInfo: {} as UserType
});

const QAPairsContextProvider = ({ children }: { children: ReactNode }) => {
  const [searchModel, setSearchModel] = useState<QAPairsSeachModelType>({
    questions_like: '',
    qa_source: undefined,
    use_for_qa: undefined,
    update_user: ''
  });
  const auth = useRef('0F755C148C727EFAF09824A6F48E410B');
  const appId = useContextSelector(AppContext, (v) => v.appId);

  const { userInfo } = useUserStore();
  const {
    data: QAPairsList,
    Pagination,
    total,
    getData,
    isLoading: isGetting,
    pageNum,
    pageSize
  } = usePagination<AppQAPairsListItemType>({
    api: getQAListApi,
    pageSize: 20,
    params: {
      auth: auth.current,
      app_id: appId,
      ...searchModel,
      qa_source: searchModel.qa_source ? Number(searchModel.qa_source) : null,
      use_for_qa: searchModel.use_for_qa ? Number(searchModel.use_for_qa) : null
    },
    defaultRequest: true
  });

  const [showModal, setShowModal] = useState(false);

  const contextValue: QAPairsContextType = {
    auth: auth.current,
    searchModel,
    setSearchModel,
    isGetting,
    Pagination,
    getData,
    total,
    pageNum,
    pageSize,
    QAPairsList,
    showModal,
    setShowModal,
    userInfo
  };

  return <QAPairsContext.Provider value={contextValue}>{children}</QAPairsContext.Provider>;
};

export default QAPairsContextProvider;
