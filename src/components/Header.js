import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #007bff;
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-weight: bold;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
`;

const Button = styled.button`
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #033C73;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  outline: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #022C5A;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>THE HALO TRUST-IRAQ</Logo>
      <Nav>
        <Button>Home</Button>
        <Button>USERS</Button>
        <Button>REQUESTS</Button>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;