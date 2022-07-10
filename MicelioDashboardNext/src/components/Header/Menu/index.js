import styled from 'styled-components';
import { COLOR_PRIMARY_DARK } from '../../../styles/_variables';

export const HeaderMenu = styled.ul`
  list-style: none;

  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  font-weight: bold;
`;

export const HeaderMenuItem = styled.li`
  padding: 5px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s;

  & + & {
    margin-left: 50px;
  }

  > svg {
    display: none;
    margin-right: 5px;
  }

  &:hover {
    transform: translateY(-1px);
  }

  &.selected {
    background-color: ${COLOR_PRIMARY_DARK};
    border-radius: 20px;
    color: white;

    svg {
      display: block;
    }
  }
`;
