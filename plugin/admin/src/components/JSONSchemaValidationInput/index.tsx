import type { editor as IEditor } from 'monaco-editor'; // for monaco editor types

import Editor, { EditorProps } from '@monaco-editor/react';
import { Field, Flex, Typography } from '@strapi/design-system';
// import { useField } from '@strapi/strapi/admin';
import { /* type FieldValue, type InputProps,*/ useFetchClient } from '@strapi/strapi/admin';
import { kebabCase } from 'lodash';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { PLUGIN_ID } from '../../../../shared/constants/plugin';
import { getTranslationKey } from '../../utils/getTranslationKey';
import { THEME } from '../../utils/themeConstant';
import { Styled } from './styled';

async function defineTheme(monacoEditor: typeof IEditor) {
  type ThemeLoadConfig = Array<{
    name: THEME;
    themeData: Promise<any>;
  }>;

  const themesToLoad: ThemeLoadConfig = [
    { name: THEME.GITHUB, themeData: import('./themes/GitHub.json') },
    { name: THEME.GITHUB_LIGHT, themeData: import('./themes/GitHub Light.json') },
    { name: THEME.GITHUB_DARK, themeData: import('./themes/GitHub Dark.json') },
    { name: THEME.MONOKAI, themeData: import('./themes/Monokai.json') },
    { name: THEME.XCODE, themeData: import('./themes/Xcode_default.json') },
    { name: THEME.DRACULA, themeData: import('./themes/Dracula.json') },
  ];

  for (const theme of themesToLoad) {
    const themeData = await theme.themeData;
    monacoEditor.defineTheme(getValidThemeName(theme.name), themeData);
  }
}
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
function getValidThemeName(themeName: string): string {
  return kebabCase(themeName);
}

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

  const [internalValue, setInternalValue] = useState<string>(JSON.stringify(value));
  const [internalError, setInternalError] = useState<string>(error ?? '');

  const validateJSONSchema = async (jsonSchema: object | string, data: object | string) => {
    let parsedSchema: object;
    let parsedData: object;
    try {
      parsedSchema = typeof jsonSchema === 'string' ? JSON.parse(jsonSchema) : jsonSchema;
      parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (_err) {
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
    } catch (_err) {
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

    if (!internalValue) {
      setInternalError(
        formatMessage({ id: getTranslationKey('component.input.error.json_data_required') })
      );
      return;
    }

    const result = await validateJSONSchema(attribute['options']['jsonSchema'], internalValue);

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

  // Wire onchange with change of intervalValue to signal host
  useEffect(() => {
    onChange({ target: { name, value: internalValue, type: attribute.type } });
  }, [internalValue, name, onChange]);

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
            beforeMount={async (monaco: typeof import('monaco-editor')) => {
              if (monaco) {
                monaco.json.jsonDefaults.setDiagnosticsOptions({
                  schemas: [
                    {
                      fileMatch: ['*'], // Apply this schema to the current editor instance
                      schema: JSON.parse(attribute['options']['jsonSchema']),
                      uri: JSON.parse(attribute['options']['jsonSchema']).id,
                    },
                  ],
                  validate: true,
                });

                await defineTheme(monaco.editor);

                monaco.editor.setTheme(
                  getValidThemeName(attribute['options']['theme'] || THEME.VS_DARK)
                );
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
              editor.trigger('manual', 'editor.action.formatDocument', null);
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
