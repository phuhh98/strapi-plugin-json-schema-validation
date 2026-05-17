import Editor from '@monaco-editor/react';
import { Field, Flex, Typography } from '@strapi/design-system';
import { useField } from '@strapi/strapi/admin';
import { forwardRef, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { Styled } from './styled';

export const JSONSchemaValidationInput = forwardRef<HTMLElement, any>((props, ref) => {
  const {
    attribute,
    description,
    disabled,
    error,
    hint,
    intlLabel,
    label,
    name,
    onChange,
    required,
  } = props; // these are just some of the props passed by the content-manager

  const { formatMessage } = useIntl();
  // const { onChange, value, error } = useField(name);

  return (
    <Field.Root
      error={error as string}
      hint={description?.id ? formatMessage(description) : hint}
      name={name}
      required={required}
    >
      <Flex alignItems="stretch" direction="column" gap={1}>
        <Field.Label>{intlLabel?.id ? formatMessage(intlLabel) : label}</Field.Label>
        <Flex alignItems={'flex-start'} direction={'row'} gap={2} ref={ref}>
          <Editor
            defaultLanguage="json"
            height="50rem"
            loading={<Typography>Loading JSON Editor...</Typography>}
            options={{
              fontSize: 13,
              formatOnPaste: true,
              formatOnType: true,
              minimap: { enabled: true },
            }}
            // value={internalValue}
            // onChange={handleEditorChange}
            theme="vs-dark"
          />
          <Styled.ValidationButton onClick={() => {}} size="S">
            Validate
          </Styled.ValidationButton>
        </Flex>
        <Field.Hint />
        <Field.Error />
      </Flex>
    </Field.Root>
  );
});

export default JSONSchemaValidationInput;
