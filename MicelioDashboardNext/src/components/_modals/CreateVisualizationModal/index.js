import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Textarea
} from "@chakra-ui/react";
import {useState} from "react";
import Api from "../../../services/Api";
import {toast} from "react-toastify";

const CreateVisualizationModal = ({gameId, isOpen, onClose}) => {
  const [visualizationName, setVisualizationName] = useState()
  const [visualizationContent, setVisualizationContent] = useState()

  const doCreateVisualization = async (formEvent) => {

    console.log(visualizationContent)


    try {
      await Api.post(`/visualization/${gameId}`, {
        name: visualizationName,
        config: visualizationContent,
      })

      toast.success("Visualização cadastrada com sucesso")
      onClose()
    } catch (e) {
      toast.error(e.response.data.error)
    }

  }

  return (
      <Modal isOpen={isOpen} onClose={() => {
        onClose()
        setVisualizationName('')
        setVisualizationContent('')
      }}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Criar visualização</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Input placeholder={'Nome da visualização'} w={'100%'} value={visualizationName}
                   onChange={e => setVisualizationName(e.target.value)}/>
            <Textarea w={'100%'} minH={'200px'} mt={5} value={visualizationContent} onChange={e => setVisualizationContent(e.target.value)}/>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={() => {
              onClose()
              setVisualizationName('')
              setVisualizationContent('')
            }}>Cancelar</Button>
            <Button variant={'primary'} ms={3} onClick={doCreateVisualization}>
              Criar visualização
            </Button>

            <br/>
          </ModalFooter>
        </ModalContent>
      </Modal>

  )
}

export default CreateVisualizationModal
