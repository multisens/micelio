import React from "react"
import ReactDOM from "react-dom"

import Routes from "./Routes"

import "./css/global.css"

import { AuthProvider } from "./context/AuthContext"

import { ChakraProvider, extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#F6F6F6",
      },
      input: {
        padding: "8px",
        border: "2px solid #bfbfbf",
        borderRadius: "8px",
        minHeight: "40px",
        transition: "all .5s",
        outline: "none",
        width: "100%",

        "&:disabled": {
          backgroundColor: "#e6e6e6",
        },
      },
      h2: {
        fontSize: "1.5em",
        fontWeight: "bold",
      },
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Routes />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
