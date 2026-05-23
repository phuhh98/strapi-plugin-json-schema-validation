import type { editor as IEditor } from 'monaco-editor'; // for monaco editor types

import Editor, { EditorProps } from '@monaco-editor/react';
import { Field, Flex, Typography } from '@strapi/design-system';
// import { useField } from '@strapi/strapi/admin';
import { useFetchClient } from '@strapi/strapi/admin';
import { kebabCase } from 'lodash';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { PLUGIN_ID } from '../../../../shared/constants/plugin';
import { FieldAttribute, JSONValidationFieldOptions } from '../../../../shared/types/field';
import { ValidationResult } from '../../../../shared/types/validation';
import { getTranslationKey } from '../../utils/getTranslationKey';
import { THEME } from '../../utils/themeConstant';
import { Styled } from './styled';

interface CustomFieldInputProps<TValue = unknown, TAttributeOptions = unknown> {
  /**
   * The attribute object with custom field's underlying Strapi type and options
   */
  attribute: FieldAttribute<TAttributeOptions>;
  /**
   * The content-type the field belongs to
   */
  contentTypeUID: string;
  /**
   * The field description set in configure the view
   */
  description?: MessageDescriptor;
  /**
   * Whether or not the input is disabled
   */
  disabled: boolean;
  /**
   * Error received after validation
   */
  error?: MessageDescriptor;
  /**
   * The field description set in configure the view along with min/max validation requirements
   */
  hint?: string;
  /**
   * The field name set in the content-type builder or configure the view
   */
  intlLabel?: MessageDescriptor;
  label: string;
  /**
   * The field name set in the content-type builder
   */
  name: string;
  /**
   * The handler for the input change event. The name argument references the field name. The type argument references the underlying Strapi type
   * @param param The event parameter containing the target name, value, and type
   */
  onChange(param: { target: { name: string; type: string; value: unknown } }): void;
  /**
   * The field placeholder set in configure the view
   */
  placeholder?: MessageDescriptor;
  /**
   * Whether or not the field is required
   */
  required: boolean;
  /**
   * The custom field uid
   *
   * for example plugin::color-picker.color
   */
  type: string;
  /**
   * The input value the underlying Strapi type expects
   */
  value: TValue;
}

interface JSONSchemaValidationInputProps extends CustomFieldInputProps<
  object,
  JSONValidationCustomFieldOptions
> {}

interface JSONValidationCustomFieldOptions extends JSONValidationFieldOptions {
  theme: `${THEME}` | THEME;
}

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
  } = props as JSONSchemaValidationInputProps; // these are just some of the props passed by the content-manager

  const editorRef = useRef<null | Parameters<NonNullable<EditorProps['onMount']>>[0]>(null);
  const [isFirstTimeFormatted, setIsFirstTimeFormatted] = useState(false);

  function triggerEditorFormat() {
    if (editorRef.current != null) {
      // Manually trigger the format document action
      editorRef.current.trigger('manual', 'editor.action.formatDocument', null);
    }
  }

  const { formatMessage } = useIntl();
  const { post } = useFetchClient();

  const [internalValue, setInternalValue] = useState<string>(JSON.stringify(value));
  const [internalError, setInternalError] = useState<string | typeof error>(error);

  const validateJSONSchema = async (jsonSchema: object | string, data: object | string) => {
    let parsedSchema: object;
    let parsedData: object;
    try {
      parsedSchema = typeof jsonSchema === 'string' ? JSON.parse(jsonSchema) : jsonSchema;
      parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (_err) {
      return {
        errorString: formatMessage({
          id: getTranslationKey('component.input.error.parse_json_error'),
        }),
        isControlledError: true,
        isValid: false,
      };
    }

    try {
      const response = await post<{ data: ValidationResult }>(`/${PLUGIN_ID}/validateSchema`, {
        data: parsedData,
        schema: parsedSchema,
      });
      return {
        data: response.data.data,
        isControlledError: false,
      };
    } catch (_err) {
      return {
        errorString: formatMessage({
          id: getTranslationKey('component.input.error.validate_json_error'),
        }),
        isControlledError: true,
        isValid: false,
      };
    }
  };

  const handleValidateClick = async () => {
    triggerEditorFormat();

    if (attribute.options.required && !internalValue) {
      setInternalError(
        formatMessage({ id: getTranslationKey('component.input.error.json_data_required') })
      );
      return;
    }

    const result = await validateJSONSchema(attribute.options.jsonSchema, internalValue);

    if (result.isControlledError) {
      setInternalError(
        result.errorString ||
          formatMessage({
            id: getTranslationKey('component.input.error.invalid_json_schema_or_data'),
          })
      );
      return;
    } else {
      if (result.data?.isValid) {
        setInternalError(undefined);
        onChange({ target: { name, type: attribute.type, value: internalValue } });
      } else {
        setInternalError(
          result.data?.errors
            ? `${formatMessage({ id: getTranslationKey('component.input.error.validation_error') })}: ${result.data.errorString}`
            : result.data?.processingError
              ? `${formatMessage({ id: getTranslationKey('component.input.error.processing_error') })}: ${result.data.processingError}`
              : formatMessage({
                  id: getTranslationKey('component.input.error.invalid_json_schema_or_data'),
                })
        );
      }
    }
  };

  // Wire onchange with change of intervalValue to signal host
  useEffect(() => {
    onChange({ target: { name, type: attribute.type, value: internalValue } });
  }, [internalValue, name, onChange]);

  useEffect(() => {
    setInternalError(error);
  }, [error]);

  useEffect(() => {
    if (!isFirstTimeFormatted && editorRef.current) {
      triggerEditorFormat();
      setIsFirstTimeFormatted(true);
    }
  }, [editorRef.current]);

  return (
    <Field.Root
      error={internalError as unknown as string}
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

        <Flex
          alignItems={'flex-start'}
          direction={'row'}
          gap={2}
          ref={ref}
          style={{ width: '100%' }}
        >
          <Styled.EditorContainer $hasError={!!internalError} direction={'column'}>
            <Editor
              beforeMount={async (monaco: typeof import('monaco-editor')) => {
                if (monaco) {
                  monaco.json.jsonDefaults.setDiagnosticsOptions({
                    schemas: [
                      {
                        fileMatch: ['*'], // Apply this schema to the current editor instance
                        schema: JSON.parse(attribute.options.jsonSchema),
                        uri: JSON.parse(attribute.options.jsonSchema).id,
                      },
                    ],
                    validate: true,
                  });

                  await defineTheme(monaco.editor);

                  monaco.editor.setTheme(
                    getValidThemeName(attribute.options.theme || THEME.VS_DARK)
                  );
                }
              }}
              defaultLanguage="json"
              height="40rem"
              loading={
                <Typography>
                  {formatMessage({
                    id: getTranslationKey('component.input.editor_loading_message'),
                  })}
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
          </Styled.EditorContainer>

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
