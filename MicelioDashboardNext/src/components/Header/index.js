import { Container, Flex, Heading, List, ListItem, Text } from '@chakra-ui/react';
import { HeaderMenu, HeaderMenuItem } from './Menu';
import { AiFillHome, AiFillInfoCircle, AiOutlineUser } from 'react-icons/ai';

export default function Header() {
  return (
    <>
      <Flex flexDirection={'column'}>
        <Container maxW={'container.2xl'} mt={4}>
          <Flex>
            <Heading flex={1}>Micelio</Heading>
            <Flex flex={3}>
              <HeaderMenu>
                <HeaderMenuItem className={'selected'}>
                  <AiFillHome color={'white'} />
                  Início
                </HeaderMenuItem>
                <HeaderMenuItem>
                  <AiFillInfoCircle color={'white'} />
                  Sobre
                </HeaderMenuItem>
                <HeaderMenuItem>
                  <AiOutlineUser color={'white'} />
                  Perfil
                </HeaderMenuItem>
              </HeaderMenu>
            </Flex>
            <Flex flex={1} justifyContent={'end'} alignItems={'center'}>
              <Text>Sair</Text>
            </Flex>
          </Flex>
          <hr style={{ marginTop: 4, backgroundColor: '#cdcdcd' }} />
        </Container>
      </Flex>
    </>
  );
}
