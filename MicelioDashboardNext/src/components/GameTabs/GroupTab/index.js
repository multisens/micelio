import {
  Box,
  Button,
  Flex, Grid, GridItem, Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react';
import {AiOutlineGroup} from 'react-icons/ai'
import {useEffect, useState} from "react";
import {ToastContainer, toast} from "react-toastify";
import Api from "../../../services/Api";
import GroupCard from "../../GroupCard";

export default function GroupTab({gameId, groups}) {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)

  return (
      <>
        <NewGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} gameId={gameId}/>
        <ToastContainer/>
        <Flex justifyContent={'end'}>
          <Button variant={'primary'} onClick={() => setIsGroupModalOpen(true)}>Criar grupo</Button>
        </Flex>
        <Flex>
          <Grid templateColumns={'1fr 1fr'} gap={5}>
            {groups && groups.map(group => (
                <GridItem>
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

const NewGroupModal = ({gameId, isOpen, onClose}) => {
  const [newGroupName, setNewGroupName] = useState()

  const doCreateGroup = async () => {
    try {
      const response = await Api.post("/group", {game_id: gameId, name: newGroupName})

      const group_id = response.data.group_id
      setGroupCreated(group_id)

      toast.success(`Grupo ${group_id} criado com sucesso`)
    } catch (e) {
      toast.error('Erro ao criar grupo. Por favor, tente novamente.')
      console.error(e)
    }

  }

  return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Criar grupo</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Input placeholder={'Nome do grupo'} w={'100%'} value={newGroupName}
                   onChange={e => setNewGroupName(e.target.value)}/>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={onClose}>Cancelar</Button>
            <Button variant={'primary'} ms={3} onClick={doCreateGroup}>
              Criar grupo
            </Button>

            <br/>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}
