import React, { useState } from 'react';
import styled from 'styled-components';
import avatar from '../../img/avatar.png';
import { signout } from '../../utils/Icons';
import { menuItems } from '../../utils/menuItems';
import { useAuth } from '../auth/AuthPage';
import ChangePassword from '../ChangePassword';

function Navigation({ active, setActive, darkMode, setDarkMode }) {
    const { user, logout } = useAuth();
    const [showChangePassword, setShowChangePassword] = useState(false);

    return (
        <NavStyled>
            <div className="toggle-theme">
                <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                </button>
            </div>
            <div className="user-con">
                <img src={avatar} alt="Avatar" />
                <div>
                    <h2>{user.username}</h2>
                    <p>{user.email}</p>
                </div>
            </div>

            <ul className="menu-items">
                {menuItems.map((item) => (
                    <li 
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={active === item.id ? 'active' : ''}
                    >
                        {item.icon}
                        {item.title}
                    </li>
                ))}
            </ul>

            <div className="bottom-nav-container">
                <div 
                    className="bottom-nav" 
                    onClick={logout}
                    style={{ cursor: 'pointer' }}
                >
                    {signout} Sign Out
                </div>
                <div 
                    className="change-password-item" 
                    onClick={() => setShowChangePassword(true)}
                >
                    🔐 Change Password
                </div>
            </div>

            {/* Change Password Modal */}
            {showChangePassword && (
                <ModalOverlay onClick={() => setShowChangePassword(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <CloseButton onClick={() => setShowChangePassword(false)}>
                            &times;
                        </CloseButton>
                        <ChangePassword onClose={() => setShowChangePassword(false)} />
                    </ModalContent>
                </ModalOverlay>
            )}
        </NavStyled>
    );
}
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 10px;
    padding: 20px;
    position: relative;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
`;
const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background: ${(props) => props.theme.body};
    border: 3px solid ${(props) => (props.theme.body === '#181818' ? '#444' : '#FFF')};
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
    transition: background 0.3s, border 0.3s;
.change-password-item {
        cursor: pointer;
        display: grid;
        grid-template-columns: 40px auto;
        align-items: center;
        margin: 0.6rem 0;
        font-weight: 500;
        color: ${(props) => props.theme.text};
        padding-left: 1rem;
    }
    .user-con {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;
        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: ${(props) => props.theme.body === '#181818' ? '#333' : '#fcf6f9'};
            border: 2px solid ${(props) => props.theme.text};
            padding: 0.2rem;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        }
        h2, p {
            color: ${(props) => props.theme.text};
        }
    }


    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: 0.6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.4s ease-in-out;
            color: ${(props) => props.theme.text};
            padding-left: 1rem;
            position: relative;

            i {
                color: ${(props) => props.theme.text};
                font-size: 1.4rem;
                transition: all 0.4s ease-in-out;
            }
        }
    }

    .active {
        color: ${(props) => props.theme.text} !important;
        i {
            color: ${(props) => props.theme.text} !important;
        }
        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: ${(props) => props.theme.text};
            border-radius: 0 10px 10px 0;
        }
    }

    .bottom-nav {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding-left: 1rem;
        color: ${(props) => props.theme.text};
        cursor: pointer;
    }

    .toggle-theme {
        margin-bottom: 1rem;
        display: flex;
        justify-content: center;

        button {
            background: transparent;
            border: 1px solid ${(props) => props.theme.text};
            color: ${(props) => props.theme.text};
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
                background: ${(props) => props.theme.text};
                color: ${(props) => props.theme.body};
            }
        }
    }
    .bottom-nav-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .bottom-nav {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: ${(props) => props.theme.text};
        cursor: pointer;
    }

    .change-password-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        color: ${(props) => props.theme.text};
    }
`;

export default Navigation;
