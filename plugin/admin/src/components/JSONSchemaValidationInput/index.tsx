import Editor, { EditorProps } from '@monaco-editor/react';
import { Field, Flex, Typography } from '@strapi/design-system';
import { useField } from '@strapi/strapi/admin';
import React, { forwardRef, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFetchClient } from '@strapi/strapi/admin';

import { Styled } from './styled';
import { PLUGIN_ID } from '../../../../shared/constants/plugin';

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
    value,
  } = props; // these are just some of the props passed by the content-manager

  const editorRef = useRef<Parameters<NonNullable<EditorProps['onMount']>>[0]>(null);

  function triggerEditorFormat() {
    if (editorRef.current != null) {
      // Manually trigger the format document action
      editorRef.current.trigger('manual', 'editor.action.formatDocument');
    }
  }

  const { formatMessage } = useIntl();
  const { get, post } = useFetchClient();

  const [internalValue, setInternalValue] = useState<string>(value);
  const [internalError, setInternalError] = useState<string>(error);

  const validateJSONSchema = async (jsonSchema: string | object, data: string | object) => {
    let parsedSchema: object;
    let parsedData: object;
    try {
      parsedSchema = typeof jsonSchema === 'string' ? JSON.parse(jsonSchema) : jsonSchema;
      parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (err) {
      console.error('Error parsing JSON Schema or data:', err);
      return { error: 'Error parsing JSON Schema or data', isValid: false };
    }

    try {
      const response = await post(`/${PLUGIN_ID}/validateSchema`, {
        schema: parsedSchema,
        data: parsedData,
      });
      return response.data;
    } catch (err) {
      console.error('Error while validating JSON Schema:', err);
      return { error: 'Error while validating JSON Schema', isValid: false };
    }
  };
  // const { onChange, value, error } = useField(name);

  const handleValidateClick = async () => {
    triggerEditorFormat();
    console.log('attribute', attribute);

    if (!internalValue) {
      setInternalError('JSON Schema is required');
      return;
    }

    const result = await validateJSONSchema(attribute['options']['jsonSchema'], internalValue);

    console.log('result', result);

    if (result.data.isValid) {
      setInternalError('');
      onChange({ target: { name, value: internalValue } });
    } else {
      setInternalError(
        result.data.errors
          ? `Validation errors: ${result.data.errors.map((e) => e.message).join('\n')}`
          : result.data.processingError
            ? `Processing error: ${result.data.processingError}`
            : 'Invalid JSON Schema or data'
      );
    }
  };

  return (
    <Field.Root
      error={internalError}
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
            value={internalValue}
            onChange={(value) => setInternalValue(value || '')}
            theme="vs-dark"
            beforeMount={(monaco) => {
              if (monaco) {
                monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                  validate: true,
                  schemas: [
                    {
                      // uri: MY_JSON_SCHEMA.id,
                      fileMatch: ['*'], // Apply this schema to the current editor instance
                      schema: JSON.parse(attribute['options']['jsonSchema']),
                    },
                  ],
                });
              }
            }}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
          <Styled.ValidationButton onClick={handleValidateClick} size="S">
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
