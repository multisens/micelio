import {Box, Button, Container, Flex, Heading, List, ListItem, Text} from '@chakra-ui/react';
import {HeaderMenu, HeaderMenuItem} from './Menu';
import {AiFillHome, AiFillInfoCircle, AiOutlineUser} from 'react-icons/ai';
import Link from 'next/link';

export default function Header({pageName = 'home'}) {
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
                  <Link href={'/home'}>
                    <HeaderMenuItem className={pageName === 'home' && 'selected'}>
                      <Flex alignItems={'center'}>
                        <AiFillHome color={'white'}/>
                        <Text ms={1}>Início</Text>
                      </Flex>
                    </HeaderMenuItem>
                  </Link>
                  <Link href={'/about'}>
                    <HeaderMenuItem className={pageName === 'about' && 'selected'}>
                      <Flex alignItems={'center'}>
                        <AiFillInfoCircle color={'white'}/>
                        <Text ms={1}>Sobre</Text>
                      </Flex>
                    </HeaderMenuItem>
                  </Link>
                  <HeaderMenuItem className={pageName === 'profile' && 'selected'}>
                    <AiOutlineUser color={'white'}/>
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
