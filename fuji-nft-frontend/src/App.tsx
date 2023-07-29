import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "./components/Layout";
import { Component } from "react";

function App() {
  return (
    <ChakraProvider>
      <Layout>
        <p>ddd</p>
      </Layout>
    </ChakraProvider>
  );
}

export default App;
