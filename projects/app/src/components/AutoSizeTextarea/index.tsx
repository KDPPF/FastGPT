import { Textarea } from '@chakra-ui/react';
import { useDebounceFn } from 'ahooks';
import React, { useRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

const adjustHeight = (textareaRef: React.RefObject<HTMLTextAreaElement>) => {
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
};

function AutoSizeTextarea({ registerReturn }: { registerReturn: UseFormRegisterReturn }) {
  const { onChange, onBlur, name: registerName, ref: registerRef } = registerReturn;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 使用 lodash 的 debounce 函数创建一个防抖版本的 adjustHeight
  const { run } = useDebounceFn(
    (text) => {
      // 调整高度，防抖控制优化
      adjustHeight(textareaRef);
    },
    {
      wait: 200
    }
  );

  return (
    <Textarea
      rows={10}
      placeholder="请输入"
      onChange={(e) => {
        onChange(e);
        run(e.target.value);
      }} // assign onChange event
      onBlur={onBlur} // assign onBlur event
      name={registerName} // assign name prop
      ref={(ref) => {
        registerRef(ref);
        textareaRef.current = ref;
      }} // assign ref prop
      overflow={'hidden'}
    />
  );
}

export default AutoSizeTextarea;
