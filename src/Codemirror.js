import * as React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { useState, useEffect } from 'react';
import { Grid, GridItem } from '@chakra-ui/react'
import io from 'socket.io-client'
const socket = io();


function Editor({ roomId }) {
  const [userCode, setUserCode] = useState("");
  const [editorCode, setEditorCode] = useState("")
  const [username, setUsername] = useState("teste")

  const [shouldSendCode, setShouldSendCode] = useState(false);

  const [users, setUsers] = useState([])

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  useEffect(() => {
    console.log(roomId)
    setUsername(window.localStorage.getItem("username"))

  }, [roomId])


  useEffect(() => {
    socket.on('CODE_CHANGED', (code) => {
      setShouldSendCode(false)
      setUserCode(code)

    })

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`)
    })

    socket.on('connect', () => {
      socket.emit('CONNECTED_TO_ROOM', { roomId, username })
    })

    socket.on('disconnect', () => {
      socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username })
    })

    socket.on('ROOM:CONNECTION', (users) => {
      setUsers(users)
      console.log(users)
    })

    return () => {
      socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username })
    }
  }, [])

  useEffect(() => {
    if (shouldSendCode) {
      socket.emit('CODE_CHANGED', userCode)
    }
  }, [userCode])


  const handleCodeMirrorOnChange = (value, viewUpdate) => {
    console.log("value", value)
    console.log("viewUpdate", viewUpdate)
    setShouldSendCode(true)
    setUserCode(value)

    // if (origin !== 'setValue') {
    //   setUserCode(value)
    //   socket.emit('CODE_CHANGED', value)
    // }

    // editor.on('cursorActivity', (instance) => {
    //   // console.log(instance.cursorCoords())
    // })

  }

  return (
    <>
    <Grid templateColumns='repeat(2, 1fr)'>
          <GridItem>
            <CodeMirror
              value={userCode}
              height="700px"
              width="auto"
              theme={dracula}
              extensions={[javascript({ jsx: true })]}
              onChange={handleCodeMirrorOnChange}
            />
          </GridItem>
          <GridItem>
            <iframe
              height={700}
              width={730}
              className="preview"
              srcDoc={userCode}
              title="output"
              sandbox="allow-scripts"
              frameBorder="0"
            />
          </GridItem>
    </Grid>  
    </>
  );
}
export default Editor;