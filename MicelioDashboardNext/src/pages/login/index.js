import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Flex>
      <Flex flex={1} justifyContent={'center'} alignItems={'center'} h={'100vh'}>
        <Flex boxShadow={'0 0 5px gray'} padding={8} borderRadius={8} w={'100%'} maxW={'400px'} flexDir={'column'}>
          <Heading textAlign={'center'}>Micelio</Heading>
          <Box mt={10}>
            <Heading size={'sm'} textAlign={'center'}>
              Entre com sua conta
            </Heading>
            <Input w={'100%'} placeholder={'Usuário'} mt={4} />
            <Input type={'password'} w={'100%'} placeholder={'Senha'} mt={2} />
            <Button w={'100%'} mt={5} variant={'primary'}>
              Entrar
            </Button>
          </Box>
          <hr style={{ margin: 20 }} />
          <Text display={'flex'} flexDirection={'column'} textAlign={'center'}>
            Não possui uma conta? <br />
            <Link href={'/register'}>Cadastre-se</Link>
          </Text>
        </Flex>
      </Flex>
      <Flex flex={1} h={'100vh'} bg={'micelio.primary'}>
        xxx
      </Flex>
    </Flex>
  );
}
