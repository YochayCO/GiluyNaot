import React from 'react';
import styled from 'styled-components';

const Container = styled.header`
  height: 10vh;
  .title {
    flex: 1 1 auto;
    margin: 0;
    font-size: 50px;
    text-align: center;
  }
`;

export default function Header() {
  return (
    <Container>
      <h1 className="title">גילוי נאות</h1>
    </Container>
  );
}
