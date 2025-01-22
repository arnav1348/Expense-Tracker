import React, { useState, useMemo } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import { useGlobalContext } from './context/globalContext';
import { AuthPage, AuthProvider, useAuth } from './Components/auth/AuthPage';
import Transactions from './Components/Transactions/Transactions.js';
import Chatbot from './Components/ChatBot/Gemini.jsx'; // Add this import

// Light and Dark Mode Themes
const lightTheme = {
  body: "#FFFFFF",
  text: "#333333",
  backgroundMain: "rgba(252, 246, 249, 0.78)"
};

const darkTheme = {
  body: "#181818",
  text: "#FFFFFF",
  backgroundMain: "rgba(30, 30, 30, 0.9)"
};

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
    transition: background-color 0.3s, color 0.3s;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
  }
`;

function AppContent() {
  const [active, setActive] = useState(1);
  const [darkMode, setDarkMode] = useState(false); // Dark Mode state
  const global = useGlobalContext();
  const { user } = useAuth();

  // Function to display components
  const displayData = () => {
    if (!user) return <AuthPage />;

    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Transactions />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      default:
        return <Dashboard />;
    }
  };

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AppStyled bg={bg}>
        {orbMemo}
        <MainLayout>
          {user && (
            <Navigation
              active={active}
              setActive={setActive}
              darkMode={darkMode}
              setDarkMode={setDarkMode} // Pass props to Navigation
            />
          )}
          <main>{displayData()}</main>
          {user && <Chatbot />}
        </MainLayout>
      </AppStyled>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: ${(props) => props.theme.backgroundMain};
    border: 3px solid ${(props) => (props.theme.body === "#181818" ? "#444" : "#FFF")};
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    transition: background 0.3s, border 0.3s;

    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;
export default App;
