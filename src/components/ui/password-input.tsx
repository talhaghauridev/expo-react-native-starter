import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import * as React from 'react';
import { Keyboard, Pressable, TextInput, View } from 'react-native';

type PasswordInputProps = React.ComponentProps<typeof TextInput> & {
  containerClassName?: string;
};

const PasswordInput = React.forwardRef<TextInput, PasswordInputProps>(
  ({ className, containerClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const disabled = React.useMemo(
      () => props.value === '' || props.value === undefined || props.editable === false,
      [props.value, props.editable]
    );

    const togglePassword = () => {
      Keyboard.dismiss();
      setShowPassword((prev) => !prev);
    };

    return (
      <View className={cn('relative w-full', containerClassName)}>
        <Input
          secureTextEntry={!showPassword}
          className={cn('pr-10 placeholder:text-[14.5px]', className)}
          ref={ref}
          {...props}
        />
        <Pressable
          className={cn(
            'absolute right-0 top-0 h-full items-center justify-center px-3',
            disabled && 'opacity-50'
          )}
          onPress={togglePassword}
          disabled={disabled}>
          {showPassword ? (
            <Eye
              size={16}
              color={disabled ? '#9CA3AF' : '#6B7280'}
              className="h-4 w-4"
            />
          ) : (
            <EyeOff
              size={16}
              color={disabled ? '#9CA3AF' : '#6B7280'}
              className="h-4 w-4"
            />
          )}
        </Pressable>
      </View>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
