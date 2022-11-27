import {useState} from "react";
import Api from "../../../services/Api";
import {toast} from "react-toastify";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";

const CreateGroupModal = ({gameId, isOpen, onClose, onCreateGroup}) => {
  const [newGroupName, setNewGroupName] = useState()

  const doCreateGroup = async () => {
    try {
      const response = await Api.post("/group", {game_id: gameId, name: newGroupName})

      const group_id = response.data.group_id

      toast.success(`Grupo ${group_id} criado com sucesso`, {autoClose: 2000})
      onCreateGroup && onCreateGroup({
        id: group_id,
        name: newGroupName
      })

      setNewGroupName('')
      onClose && onClose()
    } catch (e) {
      toast.error('Erro ao criar grupo. Por favor, tente novamente.')
      console.error(e)
    }

  }

  return (
      <Modal isOpen={isOpen} onClose={() => {
        onClose()
        setNewGroupName('')
      }}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Criar grupo</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Input placeholder={'Nome do grupo'} w={'100%'} value={newGroupName}
                   onChange={e => setNewGroupName(e.target.value)}/>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={() => {
              onClose()
              setNewGroupName('')
            }}>Cancelar</Button>
            <Button variant={'primary'} ms={3} onClick={doCreateGroup}>
              Criar grupo
            </Button>

            <br/>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}

export default CreateGroupModal;
