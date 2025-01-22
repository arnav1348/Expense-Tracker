import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Create AuthContext with default value
const AuthContext = React.createContext({
  user: null,
  token: null,
  login: () => {},
  signup: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Verify token on app load
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          // Create an axios instance with the token
          const authAxios = axios.create({
            baseURL: 'http://localhost:5000/api',
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });

          // Endpoint to verify token and get user info
          const response = await authAxios.get('/v1/verify');
          
          setUser(response.data.user);
          setToken(storedToken);
        } catch (error) {
          // If token is invalid, log out
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/login', { 
        email, 
        password 
      });
      
      const { token, user } = response.data;
      console.log(token, user);
      
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      return user;
    } catch (error) {
      console.error('Login failed:', error.response?.data);
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/signup', { 
        username, 
        email, 
        password 
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return user;
    } catch (error) {
      console.error('Signup failed:', error.response?.data);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // If still loading, you might want to show a loading screen
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);

      } else {
        await signup(username, email, password);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <AuthContainer>
    <AuthWrapper>
      <AuthCard>
        <AuthTitle>{isLogin ? 'Welcome Back' : 'Create Account'}</AuthTitle>
        
        <AuthForm onSubmit={handleSubmit}>
          {!isLogin && (
            <AuthInput
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          
          <AuthInput
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <AuthInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <SubmitButton type="submit">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </SubmitButton>
        </AuthForm>
        
        <ToggleLink onClick={() => setIsLogin(!isLogin)}>
          {isLogin 
            ? "Don't have an account? Create one" 
            : "Already have an account? Sign In"}
        </ToggleLink>
        
        <Divider>
          <DividerLine />
          <DividerText>or</DividerText>
          <DividerLine />
        </Divider>
        
        <SocialLoginContainer>
          <SocialButton color="#DB4437">
            Google
          </SocialButton>
          <SocialButton color="#3B5998">
            Facebook
          </SocialButton>
        </SocialLoginContainer>
      </AuthCard>
    </AuthWrapper>
  </AuthContainer>
);
};

const AuthContainer = styled.div`
min-height: 100vh;
background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
display: flex;
justify-content: center;
align-items: center;
padding: 20px;
`;

const AuthWrapper = styled.div`
width: 100%;
max-width: 450px;
`;

const AuthCard = styled.div`
background: white;
border-radius: 16px;
box-shadow: 0 10px 25px rgba(0,0,0,0.1);
padding: 40px;
`;

const AuthTitle = styled.h2`
text-align: center;
color: #333;
margin-bottom: 30px;
font-size: 24px;
font-weight: bold;
`;

const AuthForm = styled.form`
display: flex;
flex-direction: column;
gap: 15px;
`;

const AuthInput = styled.input`
width: 100%;
padding: 12px 15px;
border: 2px solid #e0e0e0;
border-radius: 8px;
font-size: 16px;
transition: all 0.3s ease;

&:focus {
  outline: none;
  border-color: #6a11cb;
  box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
}
`;

const SubmitButton = styled.button`
width: 100%;
padding: 12px;
background: linear-gradient(to right, #6a11cb, #2575fc);
color: white;
border: none;
border-radius: 8px;
font-size: 16px;
cursor: pointer;
transition: all 0.3s ease;

&:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
`;

const ToggleLink = styled.p`
text-align: center;
color: #666;
margin-top: 15px;
cursor: pointer;
transition: color 0.3s ease;

&:hover {
  color: #6a11cb;
}
`;

const Divider = styled.div`
display: flex;
align-items: center;
margin: 25px 0;
`;

const DividerLine = styled.div`
flex-grow: 1;
height: 1px;
background-color: #e0e0e0;
`;

const DividerText = styled.span`
margin: 0 15px;
color: #888;
font-size: 14px;
`;

const SocialLoginContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 15px;
`;

const SocialButton = styled.button`
background-color: ${props => props.color};
color: white;
border: none;
border-radius: 8px;
padding: 12px;
font-size: 16px;
cursor: pointer;
transition: all 0.3s ease;

&:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
`;