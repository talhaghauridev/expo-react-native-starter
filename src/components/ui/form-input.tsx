import { cn } from '@/lib/utils';
import React from 'react';
import { Control, FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { PasswordInput } from './password-input';

const FormContext = React.createContext<{
  control: Control<FieldValues> | null;
}>({
  control: null,
});

interface InputFormProps<TFieldValues extends FieldValues> extends Omit<
  React.ComponentProps<typeof Input>,
  'error'
> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  inputClassName?: string;
  renderInput?: (props: {
    field: {
      onChange: (...event: unknown[]) => void;
      onBlur: () => void;
      value: unknown;
    };
    fieldState: {
      invalid: boolean;
      isTouched: boolean;
      isDirty: boolean;
      error?: {
        type: string;
        message?: string;
      };
    };
  }) => React.ReactElement;
}

const AnimatedFormMessage = ({ fieldState }: { fieldState: { error?: { message?: string } } }) => {
  const isError = !!(fieldState.error && fieldState.error?.message);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isError ? 1 : 0, { duration: 200 }),
      height: withTiming(isError ? 'auto' : 0, { duration: 200 }),
      marginTop: withTiming(isError ? 4 : 0, { duration: 200 }),
      overflow: 'hidden' as const,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <FormMessage className="text-[12px]" />
    </Animated.View>
  );
};

function InputFormInner<TFieldValues extends FieldValues>({
  control: controlProp,
  name,
  renderInput,
  label,
  className,
  secureTextEntry,
  inputClassName,
  ...inputProps
}: InputFormProps<TFieldValues>) {
  const context = useFormContext();
  const control = controlProp || context.control;

  if (!control) {
    throw new Error(
      'InputForm must be used within a Form component or have a control prop provided.'
    );
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, ...rest }, fieldState }) =>
        renderInput ? (
          renderInput({
            field: { onChange, onBlur, value, ...rest },
            fieldState,
          })
        ) : (
          <FormItem className={cn('gap-0', className)}>
            {label && <Label nativeID={name}>{label}</Label>}
            <FormControl>
              {secureTextEntry ? (
                <PasswordInput
                  containerClassName="mt-[5px] "
                  className={cn(
                    inputClassName,
                    fieldState.error && 'font-inter border-destructive'
                  )}
                  ref={inputProps.ref}
                  nativeID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value as string}
                  {...inputProps}
                />
              ) : (
                <Input
                  className={cn(
                    'font-inter mt-[5px] h-auto py-[10px] placeholder:text-[14.5px]',
                    inputClassName,
                    fieldState.error && 'border-destructive'
                  )}
                  ref={inputProps.ref}
                  nativeID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value as string}
                  {...inputProps}
                />
              )}
            </FormControl>
            <AnimatedFormMessage fieldState={fieldState} />
          </FormItem>
        )
      }
    />
  );
}

const FormInput = InputFormInner as <TFieldValues extends FieldValues>(
  props: InputFormProps<TFieldValues>
) => React.ReactElement;

interface FormButtonProps {
  title: string;
  onPress?: () => void;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

const FormButton = ({
  title,
  onPress,
  isLoading,
  loadingText,
  disabled,
  className,
  textClassName,
  ...props
}: FormButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn(
        'h-12 w-full items-center justify-center rounded-lg bg-primary active:opacity-80',
        (disabled || isLoading) && 'opacity-70',
        className
      )}
      {...props}>
      <View className="flex-row items-center justify-center gap-2">
        {isLoading && (
          <ActivityIndicator
            size="small"
            color="white"
          />
        )}
        <Text
          className={cn('font-inter-semibold text-base text-primary-foreground', textClassName)}>
          {isLoading && loadingText ? loadingText : title}
        </Text>
      </View>
    </Pressable>
  );
};

FormButton.displayName = 'FormButton';

export { FormButton, FormContext, FormInput };
