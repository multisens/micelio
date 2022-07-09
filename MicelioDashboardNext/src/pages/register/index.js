import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Flex>
      <Flex flex={1} justifyContent={'center'} alignItems={'center'} h={'100vh'}>
        <Flex boxShadow={'0 0 5px #a5a5a5'} padding={8} borderRadius={8} w={'100%'} maxW={'400px'} flexDir={'column'}>
          <Heading textAlign={'center'}>Micelio</Heading>
          <Box mt={10}>
            <Heading size={'sm'} textAlign={'center'}>
              Cadastre-se
            </Heading>
            <Input w={'100%'} placeholder={'Nome de usuário'} mt={4} />
            <Input w={'100%'} placeholder={'E-mail'} mt={2} />
            <Input type={'password'} w={'100%'} placeholder={'Senha'} mt={2} />
            <Input type={'password'} w={'100%'} placeholder={'Digite novamente a senha'} mt={2} />
            <Button w={'100%'} mt={5} variant={'primary'}>
              Cadastrar
            </Button>
          </Box>
          <hr style={{ margin: 20 }} />
          <Text display={'flex'} flexDirection={'column'} textAlign={'center'}>
            Já possui uma conta? <br />
            <Link href={'/login'}>Faça Login</Link>
          </Text>
        </Flex>
      </Flex>
      <Flex flex={1} h={'100vh'} bg={'micelio.primary'}>
        xxx
      </Flex>
    </Flex>
  );
}
