import { Button, Flex } from '@strapi/design-system';
import styled from 'styled-components';

export const Styled = {
  EditorContainer: styled(Flex)<{ $hasError: boolean }>`
    width: 100%;
    padding: 0;
    border: ${(props) => (props.$hasError ? '1px solid red' : '1px solid transparent')};
  `,

  FieldContainer: styled(Flex)`
    position: relative;
  `,

  ValidationButton: styled(Button)``,
};

export default Styled;
