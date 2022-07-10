import { Button, Container, Flex, Heading, List, ListItem, Text } from '@chakra-ui/react';
import { HeaderMenu, HeaderMenuItem } from './Menu';
import { AiFillHome, AiFillInfoCircle, AiOutlineUser } from 'react-icons/ai';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      <Flex flexDirection={'column'} bg={'micelio.primary'} pt={3} pb={3}>
        <Container maxW={'container.xl'}>
          <Flex>
            <Heading flex={1} color={'white'}>
              <Link href={'/home'}>Micelio</Link>
            </Heading>
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
              <Button>Sair</Button>
            </Flex>
          </Flex>
        </Container>
      </Flex>
    </>
  );
}
