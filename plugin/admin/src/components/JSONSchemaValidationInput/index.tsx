import Editor, { EditorProps } from '@monaco-editor/react';
import { Field, Flex, Typography } from '@strapi/design-system';
// import { useField } from '@strapi/strapi/admin';
import { /* type FieldValue, type InputProps,*/ useFetchClient } from '@strapi/strapi/admin';
import { forwardRef, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { PLUGIN_ID } from '../../../../shared/constants/plugin';
import { getTranslationKey } from '../../utils/getTranslationKey';
import { THEME } from '../../utils/themeConstant';
import { Styled } from './styled';

// TODO: add correct type here
// type JSONSchemaValidationInputProps = InputProps &
//   FieldValue<string> & {
//     intlLabel?: string;
//     description?: string;
//     disabled?: boolean;
//     attribute: {
//       options: {
//         jsonSchema: string;
//         theme: string
//       };
//     };
//   };

export const JSONSchemaValidationInput = forwardRef<HTMLElement, any>((props, ref) => {
  const {
    attribute,
    description,
    disabled: _disabled,
    error,
    hint,
    intlLabel,
    label,
    name,
    onChange,
    required,
    value,
  } = props; // these are just some of the props passed by the content-manager

  const editorRef = useRef<null | Parameters<NonNullable<EditorProps['onMount']>>[0]>(null);

  function triggerEditorFormat() {
    if (editorRef.current != null) {
      // Manually trigger the format document action
      editorRef.current.trigger('manual', 'editor.action.formatDocument', null);
    }
  }

  const { formatMessage } = useIntl();
  const { post } = useFetchClient();

  const [internalValue, setInternalValue] = useState<string>(value);
  const [internalError, setInternalError] = useState<string>(error ?? '');

  const validateJSONSchema = async (jsonSchema: object | string, data: object | string) => {
    let parsedSchema: object;
    let parsedData: object;
    try {
      parsedSchema = typeof jsonSchema === 'string' ? JSON.parse(jsonSchema) : jsonSchema;
      parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (err) {
      console.error('Error parsing JSON Schema or data:', err);
      return {
        error: formatMessage({ id: getTranslationKey('component.input.error.parse_json_error') }),
        isValid: false,
      };
    }

    try {
      const response = await post(`/${PLUGIN_ID}/validateSchema`, {
        data: parsedData,
        schema: parsedSchema,
      });
      return response.data;
    } catch (err) {
      console.error('Error while validating JSON Schema:', err);
      return {
        error: formatMessage({
          id: getTranslationKey('component.input.error.validate_json_error'),
        }),
        isValid: false,
      };
    }
  };
  // const { onChange, value, error } = useField(name);

  const handleValidateClick = async () => {
    triggerEditorFormat();
    console.log('attribute', attribute);

    if (!internalValue) {
      setInternalError(
        formatMessage({ id: getTranslationKey('component.input.error.json_data_required') })
      );
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
          ? `${formatMessage({ id: getTranslationKey('component.input.error.validation_error') })}: ${result.data.errors.map((e: { message: string }) => e.message).join('\n')}`
          : result.data.processingError
            ? `${formatMessage({ id: getTranslationKey('component.input.error.processing_error') })}: ${result.data.processingError}`
            : formatMessage({
                id: getTranslationKey('component.input.error.invalid_json_schema_or_data'),
              })
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
        <Flex alignItems={'flex-start'} direction={'row'} gap={2}>
          <Field.Label style={{ display: 'inline' }}>
            {intlLabel?.id ? formatMessage(intlLabel) : label}
          </Field.Label>
          <Field.Hint />
        </Flex>

        <Flex alignItems={'flex-start'} direction={'row'} gap={2} ref={ref}>
          <Editor
            beforeMount={(monaco) => {
              if (monaco) {
                monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                  schemas: [
                    {
                      // uri: MY_JSON_SCHEMA.id,
                      fileMatch: ['*'], // Apply this schema to the current editor instance
                      schema: JSON.parse(attribute['options']['jsonSchema']),
                    },
                  ],
                  validate: true,
                });

                async function defineTheme() {
                  const githubTheme = await import('./themes/GitHub.json');
                  monaco.editor.defineTheme(THEME.GITHUB, githubTheme as unknown as string);

                  const githubLight = await import('./themes/GitHub Light.json');
                  monaco.editor.defineTheme(THEME.GITHUB_LIGHT, githubLight as unknown as string);

                  const githubDarkTheme = await import('./themes/GitHub Dark.json');
                  monaco.editor.defineTheme(
                    THEME.GITHUB_DARK,
                    githubDarkTheme as unknown as string
                  );

                  const monokaiTheme = await import('./themes/Monokai.json');
                  monaco.editor.defineTheme(THEME.MONOKAI, monokaiTheme as unknown as string);

                  const xcodeTheme = await import('./themes/Xcode_default.json');
                  monaco.editor.defineTheme(THEME.XCODE, xcodeTheme as unknown as string);
                }

                defineTheme().then(function () {
                  monaco.editor.setTheme(attribute['options']['theme'] || THEME.VS_DARK);
                });
              }
            }}
            defaultLanguage="json"
            height="40rem"
            loading={
              <Typography>
                {formatMessage({ id: getTranslationKey('component.input.editor_loading_message') })}
              </Typography>
            }
            onChange={(value) => setInternalValue(value || '')}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            options={{
              fontSize: 16,
              formatOnPaste: true,
              formatOnType: true,
              minimap: { enabled: true },
            }}
            value={internalValue}
          />
          <Styled.ValidationButton onClick={handleValidateClick} size="S">
            {formatMessage({
              id: getTranslationKey('component.input.validate_button.label'),
            })}
          </Styled.ValidationButton>
        </Flex>
        <Field.Error />
      </Flex>
    </Field.Root>
  );
});

JSONSchemaValidationInput.displayName = 'JSONSchemaValidationInput';

export default JSONSchemaValidationInput;
