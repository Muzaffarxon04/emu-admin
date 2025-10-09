import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "redux/store";
import "assets/style/app.css";
import "assets/style/fonts.css";
import 'react-day-picker/dist/style.css';
import 'react-photo-view/dist/react-photo-view.css';
import 'react-international-phone/style.css';
import { createStandaloneToast } from '@chakra-ui/react'
import {
  QueryClient, QueryClientProvider
} from 'react-query';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const { ToastContainer } = createStandaloneToast()

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ChakraProvider>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <App />
              <ToastContainer />
            </PersistGate>
          </Provider>
        </ChakraProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
