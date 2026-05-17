import React, { forwardRef, useMemo } from 'react';
import { Button, Field, Flex, JSONInput, Typography } from '@strapi/design-system';
import { useField } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { Styled } from './styled';
import Editor from '@monaco-editor/react';

export const JSONSchemaValidationInput = forwardRef<HTMLElement, any>((props, ref) => {
  const {
    description,
    error,
    hint,
    label,
    attribute,
    disabled,
    intlLabel,
    name,
    onChange,
    required,
  } = props; // these are just some of the props passed by the content-manager

  const { formatMessage } = useIntl();
  // const { onChange, value, error } = useField(name);

  return (
    <Field.Root
      hint={description?.id ? formatMessage(description) : hint}
      error={error as string}
      name={name}
      required={required}
    >
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Field.Label>{intlLabel?.id ? formatMessage(intlLabel) : label}</Field.Label>
        <Flex ref={ref} direction={'row'} gap={2} alignItems={'flex-start'}>
          <Editor
            height="50rem"
            defaultLanguage="json"
            // value={internalValue}
            // onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 13,
              formatOnType: true,
              formatOnPaste: true,
            }}
            loading={<Typography>Loading JSON Editor...</Typography>}
          />
          <Styled.ValidationButton size="S" onClick={() => {}}>
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
