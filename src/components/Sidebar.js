import React, { useState } from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  background-color: #007bff;
  color: white;
  padding: 20px;
  width: 250px;
  height: 100vh;
  position: fixed;
  transition: 0.3s;
  left: ${(props) => (props.isOpen ? '0' : '-250px')};
`;

const ToggleButton = styled.button`
  background-color: #033C73;
  border: none;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  position: fixed;
  top: 20px;
  left: ${(props) => (props.isOpen ? '250px' : '0')};
  transition: 0.3s;
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        {/* Sidebar content */}
      </SidebarContainer>
      <ToggleButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
        {isOpen ? 'Hide' : 'Show'}
      </ToggleButton>
    </>
  );
};

export default Sidebar;