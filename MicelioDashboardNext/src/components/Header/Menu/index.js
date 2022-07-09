import styled from 'styled-components';
import { COLOR_PRIMARY } from '../../../styles/_variables';

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

  & + & {
    margin-left: 50px;
  }

  > svg {
    display: none;
    margin-right: 5px;
  }

  &.selected {
    background-color: ${COLOR_PRIMARY};
    border-radius: 20px;
    color: white;

    svg {
      display: block;
    }
  }
`;
