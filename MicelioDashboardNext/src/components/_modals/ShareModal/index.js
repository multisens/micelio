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

const ShareModal = ({gameId, isOpen, onClose}) => {
  const [username, setUsername] = useState()

  const doShare = async (formEvent) => {
    formEvent.preventDefault()

    try {
      await Api.post("/game/share", {
        game_id: gameId,
        user_share: username,
      })

      toast.success("Compartilhado com sucesso", {autoClose: 2000})

      setUsername('')
      onClose && onClose()
    } catch (e) {
      toast.error(e.response.data.error, {autoClose: 2000})
    }
  }

  return (
      <Modal isOpen={isOpen} onClose={() => {
        onClose()
        setUsername('')
      }}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Compartilhar jogo</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Input placeholder={'Nome de usuário'} w={'100%'} value={username}
                   onChange={e => setUsername(e.target.value)}/>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={() => {
              onClose()
              setUsername('')
            }}>Cancelar</Button>
            <Button variant={'primary'} ms={3} onClick={doShare}>
              Compartilhar
            </Button>

            <br/>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}

export default ShareModal;
