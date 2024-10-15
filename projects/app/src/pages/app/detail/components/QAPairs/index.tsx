import React, { useState } from 'react';
import {
  Flex,
  Box,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  useDisclosure,
  ModalBody,
  HStack,
  Button,
  MenuButton,
  Switch
} from '@chakra-ui/react';
import MyMenu from '@fastgpt/web/components/common/MyMenu';
import MyIcon from '@fastgpt/web/components/common/Icon';
import { useConfirm } from '@fastgpt/web/hooks/useConfirm';
import { useTranslation } from 'next-i18next';
import { AppQAPairsListItemType } from '@/types/app';
import { useI18n } from '@/web/context/I18n';
import EmptyTip from '@fastgpt/web/components/common/EmptyTip';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from '../context';
import { cardStyles } from '../constants';
import QAPairsContextProvider, { QAPairsContext, QAPairsQASourceEnum } from './context';
import { useToast } from '@fastgpt/web/hooks/useToast';

import { removeQAApi, upDateQAApi } from '@/web/core/app/api/qaApi';

import dynamic from 'next/dynamic';
const DetailQAPairsModal = dynamic(() => import('./DetailQAPairsModal'));
const Header = dynamic(() => import('./Header'));

const QAPairs = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const appId = useContextSelector(AppContext, (v) => v.appId);
  const { auth, userInfo } = useContextSelector(QAPairsContext, (v) => v);
  const { pageNum, getData, Pagination, isGetting, QAPairsList, showModal, setShowModal } =
    useContextSelector(QAPairsContext, (v) => v);

  const test = [
    {
      id: 1,
      app_id: '1',
      question1: '123',
      question2: 'string',
      question3: 'string',
      question4: 'string',
      question5: 'string',
      answer: 'string',
      use_for_qa: 1,
      update_user: 'string',
      update_time: 'date'
    }
  ];

  const [detailQAPairsId, setDetailQAPairsId] = useState<number>();

  function handleEdit(QAPairData: AppQAPairsListItemType) {
    setDetailQAPairsId(QAPairData.id);
    setShowModal(true);
  }

  async function handleDelete(QAPairData: AppQAPairsListItemType) {
    const sendData = {
      auth,
      app_id: appId,
      id: [QAPairData.id]
    };
    try {
      const res = await removeQAApi(sendData);
      toast({
        title: '提交成功',
        status: 'success'
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: err.msg || '提交失败',
        status: 'error'
      });
    } finally {
    }
    getData(pageNum);
  }

  const { openConfirm: openDeleteConfirm, ConfirmModal: ConfirmDeleteModal } = useConfirm({
    content: '确认删除？',
    type: 'delete'
  });

  function onClose() {
    setShowModal(false);
    setDetailQAPairsId(undefined);
    getData(pageNum);
  }

  async function handleUpdate(rowData: AppQAPairsListItemType, checked: boolean) {
    const sendData = {
      auth,
      app_id: appId,
      id: rowData.id,
      use_for_qa: checked ? 1 : 0,
      user: userInfo?.username
    };
    try {
      await upDateQAApi(sendData);
      toast({
        title: '提交成功',
        status: 'success'
      });
      getData(pageNum);
    } catch (err: any) {
      console.error(err);
      toast({
        title: err.msg || '提交失败',
        status: 'error'
      });
    }
  }

  return (
    <>
      {/* table */}
      <Flex
        flexDirection={'column'}
        {...cardStyles}
        boxShadow={3.5}
        mt={4}
        px={[4, 8]}
        py={[4, 6]}
        flex={'1 0 0'}
      >
        {/* Header */}
        <Header></Header>
        <TableContainer mt={[0, 3]} flex={'1 0 0'} h={0} overflowY={'auto'}>
          <Table variant={'simple'} fontSize={'sm'}>
            <Thead>
              <Tr>
                <Th>问题</Th>
                <Th>问题回答</Th>
                <Th>来源</Th>
                <Th>用于问答流程</Th>
                <Th>更新人</Th>
                <Th>更新时间</Th>
                <Th>操作</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={'xs'}>
              <Tr h={'5px'} />
              {QAPairsList.map((item) => (
                <Tr
                  key={item.id}
                  _hover={{ bg: 'myWhite.600' }}
                  // cursor={'pointer'}
                  // title={t('common:core.view_chat_detail')}
                  // onClick={() => setDetailQAPairsId(item.id)}
                >
                  <Td maxW={'250px'}>{item.questions[0]}</Td>
                  <Td maxW={'300px'}>
                    <Box className="textEllipsis" maxW={'300px'}>
                      {item.answer}
                    </Box>
                  </Td>
                  <Td>{QAPairsQASourceEnum[item.qa_source]}</Td>
                  <Td w={'100px'}>
                    <Switch
                      isChecked={item.use_for_qa === 1}
                      size={'sm'}
                      onChange={(e) => handleUpdate(item, e.target.checked)}
                    />
                  </Td>
                  <Td w={'150px'}>{item.update_user}</Td>
                  <Td w={'150px'}>{item.update_time}</Td>
                  <Td w={'100px'}>
                    <MyMenu
                      width={100}
                      offset={[-70, 5]}
                      Button={
                        <MenuButton
                          w={'22px'}
                          h={'22px'}
                          borderRadius={'md'}
                          _hover={{
                            color: 'primary.500',
                            '& .icon': {
                              bg: 'myGray.200'
                            }
                          }}
                        >
                          <MyIcon
                            className="icon"
                            name={'more'}
                            h={'16px'}
                            w={'16px'}
                            px={1}
                            py={1}
                            borderRadius={'md'}
                            cursor={'pointer'}
                          />
                        </MenuButton>
                      }
                      menuList={[
                        {
                          children: [
                            {
                              label: (
                                <Flex alignItems={'center'}>
                                  <MyIcon name={'edit'} w={'14px'} mr={2} />
                                  编辑
                                </Flex>
                              ),
                              onClick: () => handleEdit(item)
                            }
                          ]
                        },
                        {
                          children: [
                            {
                              label: (
                                <Flex alignItems={'center'}>
                                  <MyIcon
                                    mr={1}
                                    name={'delete'}
                                    w={'14px'}
                                    _hover={{ color: 'red.600' }}
                                  />
                                  <Box>{t('common:common.Delete')}</Box>
                                </Flex>
                              ),
                              type: 'danger',
                              onClick: () =>
                                openDeleteConfirm(
                                  () => {
                                    handleDelete(item);
                                  },
                                  undefined,
                                  '确认删除？'
                                )()
                            }
                          ]
                        }
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {QAPairsList.length === 0 && !isGetting && <EmptyTip text="暂无数据"></EmptyTip>}
        </TableContainer>

        <HStack w={'100%'} mt={3} justifyContent={'flex-end'}>
          <Pagination />
        </HStack>
      </Flex>

      {showModal && <DetailQAPairsModal appId={appId} id={detailQAPairsId} onClose={onClose} />}
      <ConfirmDeleteModal />
    </>
  );
};

const Render = () => {
  return (
    <QAPairsContextProvider>
      <QAPairs />
    </QAPairsContextProvider>
  );
};

export default React.memo(Render);
