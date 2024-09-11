import { ReactNode } from 'react';
import { Flex, Box, FormControl, FormLabel } from '@chakra-ui/react';

export enum LABEL_POSTION_ENUM {
  Top = 'top',
  Left = 'left',
  Right = 'right'
}
const MyFormItem = ({
  children,
  labelWidth,
  labelPositon = LABEL_POSTION_ENUM.Right,
  label,
  ...props
}: {
  children: ReactNode;
  labelWidth: number | string;
  labelPositon?: LABEL_POSTION_ENUM;
  label: string;
  [key: string]: any;
}) => {
  return (
    <FormControl {...props}>
      {labelPositon === LABEL_POSTION_ENUM.Top && (
        <>
          <FormLabel lineHeight={'34px'} minW={labelWidth} fontSize={['sm', 'md']}>
            {label}
          </FormLabel>
          <Box>{children}</Box>
        </>
      )}
      {labelPositon === LABEL_POSTION_ENUM.Left && (
        <Flex>
          <FormLabel lineHeight={'34px'} mb={0} minW={labelWidth} fontSize={['sm', 'md']}>
            {label}
          </FormLabel>
          <Box>{children}</Box>
        </Flex>
      )}
      {labelPositon === LABEL_POSTION_ENUM.Right && (
        <Flex>
          <FormLabel
            lineHeight={'34px'}
            mb={0}
            minW={labelWidth}
            textAlign={'right'}
            fontSize={['sm', 'md']}
          >
            {label}
          </FormLabel>
          <Box flex={1}>{children}</Box>
        </Flex>
      )}
    </FormControl>
  );
};

export default MyFormItem;
