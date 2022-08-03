import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { FaShareAlt } from 'react-icons/fa';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { AiFillCrown } from 'react-icons/ai';
import { COLOR_PRIMARY } from '../../styles/_variables';
import { useRouter } from 'next/router';

export default function GroupCard({ id, name, date }) {


  return (
      <Flex
          bg={'white'}
          borderLeft={`4px solid ${COLOR_PRIMARY}`}
          minH={'100px'}
          minW={'200px'}
          p={4}
          flexDirection={'column'}
          boxShadow={'2px 2px 5px #cdcdcd'}
          borderRadius={8}>
        <Flex justifyContent={'space-between'}>
          <Heading size={'md'}>{name}</Heading>
        </Flex>
        <hr style={{ marginTop: 10, marginBottom: 10 }} />
        <Text>
          <strong>ID:</strong> {id}
        </Text>
      </Flex>
  );
}
