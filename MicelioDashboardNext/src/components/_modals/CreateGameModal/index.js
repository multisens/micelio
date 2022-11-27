import { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Api from '../../../services/Api';

const CreateGameModal = ({ isOpen, onClose, onCreateGame }) => {
  const [gameName, setGameName] = useState('');
  const [gameVersion, setGameVersion] = useState('');

  const doCreateGame = async () => {
    try {
      await Api.post('/game', {
        name: gameName,
        version: gameVersion,
      });

      toast.success('Jogo criado com sucesso');
    } catch (e) {
      toast.error(e.message);
    }

    onCreateGame && onCreateGame();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setGameName('');
        setGameVersion('');
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Novo jogo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder={'Nome do jogo'}
            w={'100%'}
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
          <Input
            mt={2}
            placeholder={'Versão'}
            w={'100%'}
            value={gameVersion}
            onChange={(e) => setGameVersion(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => {
              onClose();
              setGameName('');
              setGameVersion('');
            }}>
            Cancelar
          </Button>
          <Button variant={'primary'} ms={3} onClick={doCreateGame}>
            Criar jogo
          </Button>
          <br />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateGameModal;
