import React from 'react';
import { Flex, Box, useTheme } from '@chakra-ui/react';
import MyBox from '@fastgpt/web/components/common/MyBox';

import dynamic from 'next/dynamic';
import CloseIcon from '@fastgpt/web/components/common/Icon/close';
import { useSystem } from '@fastgpt/web/hooks/useSystem';
const EditQAPairsForm = dynamic(() => import('./EditQAPairsForm'));

const DetailQAPairsModal = ({
  appId,
  id,
  onClose
}: {
  appId: string;
  id?: number;
  onClose: () => void;
}) => {
  const { isPc } = useSystem();
  const theme = useTheme();

  return (
    <>
      <MyBox
        display={'flex'}
        flexDirection={'column'}
        zIndex={11}
        position={['fixed', 'absolute']}
        top={[0, '2%']}
        right={0}
        h={['100%', '96%']}
        w={'100%'}
        maxW={['100%', '600px']}
        bg={'white'}
        boxShadow={'3px 0 20px rgba(0,0,0,0.2)'}
        borderRadius={'md'}
        overflow={'hidden'}
        transition={'.2s ease'}
      >
        {/* Header */}
        {
          <Flex
            alignItems={'center'}
            px={[3, 5]}
            h={['46px', '60px']}
            borderBottom={theme.borders.base}
            borderBottomColor={'gray.200'}
            color={'myGray.900'}
          >
            {isPc ? (
              <>
                <Box mr={3} color={'myGray.1000'}>
                  {id ? '编辑' : '新增'}
                </Box>
                <Box flex={1} />
              </>
            ) : (
              <>
                <Flex px={3} alignItems={'center'} flex={'1 0 0'} w={0} justifyContent={'center'}>
                  <Box ml={1} className="textEllipsis">
                    编辑
                  </Box>
                </Flex>
              </>
            )}
            <CloseIcon onClick={onClose} />
          </Flex>
        }

        {/* Chat container */}
        <Box pt={2} px={5} flex={'1 0 0'} overflowY={'auto'}>
          <EditQAPairsForm id={id} onClose={onClose}></EditQAPairsForm>
        </Box>
      </MyBox>
      <Box zIndex={10} position={'fixed'} top={0} left={0} bottom={0} right={0} onClick={onClose} />
    </>
  );
};
export default DetailQAPairsModal;
