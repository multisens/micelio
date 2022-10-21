import {
  Button,
  Flex, Grid, GridItem,
  Text
} from '@chakra-ui/react';
import {AiOutlineGroup} from 'react-icons/ai'
import {useEffect, useState} from "react";
import {ToastContainer, toast} from "react-toastify";
import GroupCard from "../../GroupCard";
import CreateGroupModal from "../../_modals/CreateGroupModal";

export default function GroupTab({gameId, groups}) {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)

  return (
      <>
        <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} gameId={gameId} onCreateGroup={({id, name}) => {
          groups.push({
            session_group_id: id,
            name
          })
        }}/>
        <ToastContainer/>
        <Flex justifyContent={'end'}>
          <Button variant={'primary'} onClick={() => setIsGroupModalOpen(true)}>Criar grupo</Button>
        </Flex>
        <Flex>
          <Grid templateColumns={'1fr 1fr'} gap={5}>
            {groups && groups.map(group => (
                <GridItem key={group.session_group_id}>
                  <GroupCard id={group.session_group_id} name={group.name} />
                </GridItem>
            ))}
          </Grid>
        </Flex>
        <Flex w={'100%'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} mt={20} display={groups ? 'none' : 'flex'}>
          <AiOutlineGroup size={64} color={'#cdcdcd'}/>
          <Text mt={3}>Não há grupos disponíveis</Text>
        </Flex>
      </>
  );
}
