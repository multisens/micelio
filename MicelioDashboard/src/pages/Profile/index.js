import React, {useEffect, useState} from "react";

import PageFormat from "../../components/PageFormat";
import {Text, Flex, FormControl, FormLabel, FormErrorMessage, Box} from '@chakra-ui/react';

import './style.css'
import Api from "../../services/Api";
import {ToastContainer, toast} from "react-toastify";

function Profile() {

  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)

  useEffect(() => {
    Api.get('/user').then((response) => {
      const currentUser = response.data.data
      setUsername(currentUser.username)
      setEmail(currentUser.email)
    })
  }, [])

  const doUpdateProfile = (event) => {
    event.preventDefault();

    Api.patch('/user', {username, email}).then(response => {
      console.log(response)
      toast.success("Atualizado com sucesso", {
        style: { boxShadow: "1px 1px 5px rgba(0,0,0,.4)" },
        autoClose: 1200,
      })
    }).catch(error => {
      alert(error)
    })

  }

  const doUpdatePassword = event => {
    event.preventDefault();
  }

  return (
    <>
      <ToastContainer />
      <PageFormat menuSelected={'profile'}>
        <Flex paddingLeft={10} paddingTop={5} direction={'column'}>
          <Text fontSize={'3xl'} display={'block'} paddingBottom={10}>Meu perfil</Text>
          <Flex direction={'row'}>
            <Box bg={'#ececec'} borderRadius={8} padding={5} display={'flex'} alignItems={'center'}
                 flexDirection={'column'} justifyContent={'center'}>
              <Text fontSize={'lg'} paddingBottom={6} fontWeight={'bold'}>Informações do perfil</Text>
              <form onSubmit={doUpdateProfile}>
                <FormControl>
                  <FormLabel htmlFor={'username'} fontWeight={'bold'}>Username</FormLabel>
                  <input name={'username'} type={'text'} className={'primary'} value={username}
                         onChange={e => setUsername(e.target.value)}/>
                </FormControl>
                <FormControl paddingTop={5} w={400}>
                  <FormLabel htmlFor={'email'} fontWeight={'bold'}>E-mail</FormLabel>
                  <input name={'email'} type={'email'} className={'primary'} value={email}/>
                  <FormErrorMessage>E-mail inválido</FormErrorMessage>
                </FormControl>
                <FormControl paddingTop={5} w={400}>
                  <button className={'primary'}>Atualizar perfil</button>
                </FormControl>
              </form>
            </Box>
            <Box bg={'#ececec'} borderRadius={8} padding={5} marginLeft={5} display={'flex'} alignItems={'center'}
                 flexDirection={'column'}>
              <Text fontSize={'lg'} fontWeight={'bold'}>Atualizar senha</Text>
              <form onSubmit={doUpdatePassword}>
                <FormControl paddingTop={5} w={400}>
                  <FormLabel htmlFor={'password'} fontWeight={'bold'}>Nova senha</FormLabel>
                  <input name={'password'} type={'password'} className={'primary'}/>
                </FormControl>
                <FormControl paddingTop={5} w={400}>
                  <FormLabel htmlFor={'passwordConfirm'} fontWeight={'bold'}>Confirme sua nova senha</FormLabel>
                  <input name={'passwordConfirm'} type={'password'} className={'primary'}/>
                </FormControl>
                <FormControl paddingTop={5} w={400}>
                  <button className={'primary'}>Atualizar senha</button>
                </FormControl>
              </form>
            </Box>
          </Flex>
        </Flex>
      </PageFormat>
    </>
  )
}

export default Profile
