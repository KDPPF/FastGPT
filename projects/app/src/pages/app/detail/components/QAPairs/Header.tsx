import React, { useCallback, useRef, useState } from 'react';
import { Flex, Box, FormControl, FormLabel, Input, Select, Button } from '@chakra-ui/react';
import { debounce } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useSystemStore } from '@/web/common/system/useSystemStore';

import { useContextSelector } from 'use-context-selector';
import { useSystem } from '@fastgpt/web/hooks/useSystem';

import { QAPairsContext, QAPairsUseForQAEnum, QAPairsQASourceEnum } from './context';
import MyFormItem from '@/components/MyFormItem';

const Header = () => {
  const router = useRouter();

  const {
    searchModel,
    setSearchModel,
    pageNum,
    getData,
    Pagination,
    isGetting,
    QAPairsList,
    total,
    setShowModal
  } = useContextSelector(QAPairsContext, (v) => v);

  const [QASourceOptions, setQASourceOptions] = useState([
    {
      label: '用户A提问结果的问答对',
      value: 1
    },
    {
      label: '管理员创建的问答对',
      value: 2
    },
    {
      label: '导入的问答对',
      value: 3
    }
  ]);

  const [QAUseForQAOptions, setQAUseForQAOptions] = useState([
    {
      label: '否',
      value: 0
    },
    {
      label: '是',
      value: 1
    }
  ]);

  function handleChange(field: string, value: string | number) {
    setSearchModel((s) => {
      return {
        ...s,
        [field]: value
      };
    });
  }

  function handleSearchClick() {
    getData(1);
  }

  function handleCreate() {
    setShowModal(true);
  }

  return (
    <Box>
      {/* search input */}
      <Flex mb={'16px'}>
        <Box fontWeight={'bold'} fontSize={['sm', 'md']}>
          问答对（{total}）
        </Box>
      </Flex>
      <Flex mb={'16px'}>
        <MyFormItem mr={8} labelWidth={'50px'} label="问题">
          <Input
            flex={1}
            value={searchModel.questions_like}
            placeholder="请输入"
            onChange={(e) => {
              handleChange('questions_like', e.target.value);
            }}
          />
        </MyFormItem>
        <MyFormItem mr={8} labelWidth={'50px'} label="来源">
          <Select
            value={searchModel.qa_source}
            placeholder="请选择"
            h={34}
            onChange={(e) => {
              handleChange('qa_source', e.target.value);
            }}
          >
            {QASourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </MyFormItem>
        <MyFormItem mr={8} labelWidth={'140px'} label="用于问答流程">
          <Select
            value={searchModel.use_for_qa}
            placeholder="请选择"
            h={34}
            onChange={(e) => {
              handleChange('use_for_qa', e.target.value);
            }}
          >
            {QAUseForQAOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </MyFormItem>
        <Button
          h={'34px'}
          minW={'60px'}
          ml={'auto'}
          size={'sm'}
          onClick={() => handleSearchClick()}
        >
          搜索
        </Button>
      </Flex>
      <Flex>
        <Button w={'60px'} size={'sm'} onClick={handleCreate}>
          新增
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
