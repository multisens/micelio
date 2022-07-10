import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { FaShareAlt } from 'react-icons/fa';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { AiFillCrown } from 'react-icons/ai';
import { COLOR_PRIMARY } from '../../styles/_variables';
import { useRouter } from 'next/router';

export default function GameCard({ title, groupCount, activeSessionCount, status, id, isOwner }) {
  const router = useRouter();

  const goToGamePage = async () => {
    await router.push(`/game/${id}`);
  };

  return (
    <Flex
      bg={'white'}
      borderLeft={`4px solid ${COLOR_PRIMARY}`}
      minH={'120px'}
      minW={'200px'}
      p={4}
      cursor={'pointer'}
      flexDirection={'column'}
      boxShadow={'2px 2px 5px #cdcdcd'}
      borderRadius={8}
      onClick={goToGamePage}>
      <Flex justifyContent={'space-between'}>
        <Heading size={'md'}>{title}</Heading>
        <AiFillCrown color={isOwner ? '#ffc300' : 'gray'} size={24} />
      </Flex>
      <hr style={{ marginTop: 10, marginBottom: 10 }} />
      <Text>
        <strong>Grupos criados:</strong> {groupCount}
      </Text>
      <Text>
        <strong>Sessões ativas:</strong> {activeSessionCount}
      </Text>
      <Text>
        <strong>Status:</strong> {status}
      </Text>
      <Flex justifyContent={'end'} mt={5}>
        <Button size={'sm'}>
          <FaShareAlt style={{ marginRight: 4 }} />
          Compartilhar
        </Button>
        <Button size={'sm'} ms={2}>
          <HiOutlineViewGridAdd style={{ marginRight: 4 }} />
          Criar grupo
        </Button>
      </Flex>
    </Flex>
  );
}
