import {Button, Flex, Heading, Text} from '@chakra-ui/react';
import {FaShareAlt} from 'react-icons/fa';
import {HiOutlineViewGridAdd} from 'react-icons/hi';
import {AiFillCrown} from 'react-icons/ai';
import {COLOR_PRIMARY} from '../../styles/_variables';
import {useRouter} from 'next/router';
import ShareModal from "../_modals/ShareModal";
import {useState} from "react";
import CreateGroupModal from "../_modals/CreateGroupModal";

export default function GameCard({title, groupCount, activeSessionCount, status, id, isOwner}) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const router = useRouter();

  const goToGamePage = async () => {
    await router.push(`/game/${id}`);
  };

  return (
      <>
        <ShareModal gameId={id} onClose={() => setIsShareModalOpen(false)} isOpen={isShareModalOpen}/>
        <CreateGroupModal gameId={id} isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)}/>
        <Flex
            bg={'white'}
            borderLeft={`4px solid ${COLOR_PRIMARY}`}
            minH={'120px'}
            minW={'200px'}
            p={4}
            flexDirection={'column'}
            boxShadow={'2px 2px 5px #cdcdcd'}
            borderRadius={8}
        >
          <Flex cursor={'pointer'} justifyContent={'space-between'} onClick={goToGamePage}>
            <Heading size={'md'}>{title}</Heading>
            <AiFillCrown color={isOwner ? '#ffc300' : 'gray'} size={24}/>
          </Flex>
          <hr style={{marginTop: 10, marginBottom: 10}}/>
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
            <Button size={'sm'} onClick={() => setIsShareModalOpen(true)}>
              <FaShareAlt style={{marginRight: 4}}/>
              Compartilhar
            </Button>
            <Button size={'sm'} ms={2} onClick={() => setIsGroupModalOpen(true)}>
              <HiOutlineViewGridAdd style={{marginRight: 4}}/>
              Criar grupo
            </Button>
          </Flex>
        </Flex>
      </>
  );
}
