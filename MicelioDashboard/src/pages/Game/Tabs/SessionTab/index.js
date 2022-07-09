import React, {useEffect, useState} from 'react';
import Api from "../../../../services/Api";
import {Box, Flex, Grid, GridItem, Heading, Link, Text} from "@chakra-ui/react";
import Popup from "../../../../components/Popup";

const SessionTab = ({gameToken}) => {

  const [sessionList, setSessionList] = useState([])
  const [currentSession, setCurrentSession] = useState('')

  useEffect(() => {
    Api.get("/session", {
      headers: {
        token: gameToken
      }
    }).then(response => {
      setSessionList(response.data)
    }).catch(error => {
      console.error(error)
    })
  }, [])

  useEffect(() => {
    // Api.get("/ranking")
  }, [currentSession])

  return (
      <>
        <Flex display={currentSession ? 'flex' : 'none'} position={'absolute'} top={0} left={0} bg={'rgba(0,0,0,.3)'} w={'100%'} h={'100%'} zIndex={100000000}
              justifyContent={'center'} alignItems={'center'}>

          <Flex bg={'white'} padding={8}>
            <Heading>Ranking</Heading>
          </Flex>
        </Flex>
        <Grid templateColumns={'1fr 1fr'} gap={6}>
          {
            sessionList.map(session => {
              return (
                  <GridItem>
                    <Flex bg={'#cdcdcd'} borderRadius={8} padding={'10px'} flexDir={'column'}>
                      <Heading size={'md'} display={'block'}>{session.name}</Heading>
                      <hr/>
                      <Text mt={2}><strong>id: </strong>{session.session_id}</Text>
                      <Link mt={10} onClick={() => {setCurrentSession(session.session_id)}}>Ver ranking</Link>
                    </Flex>
                  </GridItem>
              )
            })
          }
          <GridItem>
            <Flex bg={'#cdcdcd'} borderRadius={8} padding={'10px'}>
              <Heading size={'md'}>aaa</Heading>
            </Flex>
          </GridItem>
        </Grid>
      </>
  )
}

export default SessionTab;
