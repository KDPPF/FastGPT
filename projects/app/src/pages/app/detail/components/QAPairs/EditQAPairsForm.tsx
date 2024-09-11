import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Flex,
  Center
} from '@chakra-ui/react';
import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@fastgpt/web/hooks/useToast';
import { AppContext } from '../context';
import { useContextSelector } from 'use-context-selector';
import { QAPairsContext } from './context';
import MyFormItem, { LABEL_POSTION_ENUM } from '@/components/MyFormItem';

import { getQADetailApi, upDateQAApi, createQAApi } from '@/web/core/app/api/qaApi';
import MyBox from '@fastgpt/web/components/common/MyBox';
import AutoSizeTextarea from '@/components/AutoSizeTextarea';

export type QAPairsFormType = {
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
  answer: string;
};

const EditQAPairsForm = ({ onClose, id }: { onClose: () => void; id?: number }) => {
  const { toast } = useToast();

  const appId = useContextSelector(AppContext, (v) => v.appId);
  const { auth, userInfo } = useContextSelector(QAPairsContext, (v) => v);

  const [requesting, setRequesting] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const labelWidth = '60px';

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    setValue,
    formState: { errors }
  } = useForm<QAPairsFormType>({
    mode: 'onBlur'
  });

  const getQustions = useCallback(() => {
    const formValues = getValues();
    const questions: string[] = [];
    (Object.keys(formValues) as (keyof QAPairsFormType)[]).forEach((key) => {
      if (key.indexOf('question') !== -1 && formValues[key]) {
        questions.push(formValues[key] as string);
      }
    });
    return questions;
  }, [getValues]);

  const onClickSave = useCallback(
    async (data: QAPairsFormType) => {
      const questions = getQustions();
      if (!questions.length) {
        toast({
          title: '必须填写一个问题',
          status: 'error'
        });
        return;
      }
      const formValues = getValues();
      setRequesting(true);
      const apiMethod = id ? upDateQAApi : createQAApi;
      const sendData: { [key: string]: any } = {
        questions,
        answer: formValues.answer,
        auth,
        app_id: appId,
        id,
        user: userInfo?.username
      };
      if (!sendData.id) {
        Reflect.deleteProperty(sendData, 'id');
        sendData.use_for_qa = 1;
      }
      try {
        await apiMethod(sendData);
        toast({
          title: '提交成功',
          status: 'success'
        });
        onClose();
      } catch (error: any) {
        toast({
          title: error.message || '提交失败',
          status: 'error'
        });
      }
      setRequesting(false);
    },
    [onClose, toast, id, getValues, appId, auth, getQustions, userInfo]
  );

  const getDetail = useCallback(async () => {
    setDetailLoading(true);
    const sendData = {
      auth,
      app_id: appId,
      id: id!
    };
    try {
      const res: any = await getQADetailApi(sendData);
      console.log(res);
      const data = {
        question1: res.questions[0],
        question2: res.questions[1],
        question3: res.questions[2],
        question4: res.questions[3],
        question5: res.questions[4],
        answer: res.answer
      };

      (Object.keys(data) as (keyof QAPairsFormType)[]).forEach((key) => {
        setValue(key, data[key]);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  }, [appId, id, auth, setValue]);

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, [id, getDetail]);

  return (
    <MyBox isLoading={detailLoading}>
      <MyFormItem
        mb={5}
        label="问题1"
        labelPositon={LABEL_POSTION_ENUM.Right}
        labelWidth={labelWidth}
      >
        <Input
          placeholder="请输入"
          {...register('question1', {
            required: false
          })}
        />
      </MyFormItem>
      <MyFormItem
        mb={5}
        label="问题2"
        labelPositon={LABEL_POSTION_ENUM.Right}
        labelWidth={labelWidth}
      >
        <Input
          placeholder="请输入"
          {...register('question2', {
            required: false
          })}
        />
      </MyFormItem>
      <MyFormItem
        mb={5}
        label="问题3"
        labelPositon={LABEL_POSTION_ENUM.Right}
        labelWidth={labelWidth}
      >
        <Input
          placeholder="请输入"
          {...register('question3', {
            required: false
          })}
        />
      </MyFormItem>
      <MyFormItem
        mb={5}
        label="问题4"
        labelPositon={LABEL_POSTION_ENUM.Right}
        labelWidth={labelWidth}
      >
        <Input
          placeholder="请输入"
          {...register('question4', {
            required: false
          })}
        />
      </MyFormItem>
      <MyFormItem
        mb={5}
        label="问题5"
        labelPositon={LABEL_POSTION_ENUM.Right}
        labelWidth={labelWidth}
      >
        <Input
          placeholder="请输入"
          {...register('question5', {
            required: false
          })}
        />
      </MyFormItem>
      <MyFormItem
        isRequired
        isInvalid={!!errors.answer}
        mb={5}
        label="回答"
        labelPositon={LABEL_POSTION_ENUM.Right}
        labelWidth={labelWidth}
      >
        <AutoSizeTextarea
          registerReturn={register('answer', {
            required: '答案不能为空'
          })}
        ></AutoSizeTextarea>
        {!!errors.answer && <FormErrorMessage>答案不能为空</FormErrorMessage>}
      </MyFormItem>
      <Button
        type="submit"
        my={10}
        w={'100%'}
        size={['md', 'md']}
        colorScheme="blue"
        isLoading={requesting}
        onClick={handleSubmit(onClickSave)}
      >
        保存
      </Button>
    </MyBox>
  );
};

export default EditQAPairsForm;
