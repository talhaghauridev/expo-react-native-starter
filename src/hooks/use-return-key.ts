import type { RefObject } from 'react';
import { useCallback } from 'react';
import type { TextInput } from 'react-native';

type ReturnKeyProps<T extends TextInput> = {
  ref: RefObject<T>;
  returnKeyType: 'next' | 'done';
  onSubmitEditing: () => void;
};

export function useReturnKey<T extends TextInput>(
  ref: RefObject<T>,
  nextRef?: RefObject<T>,
  onDone?: () => void
): ReturnKeyProps<T> {
  const onSubmitEditing = useCallback(() => {
    if (nextRef?.current) {
      nextRef.current.focus();
    } else {
      onDone?.();
    }
  }, [nextRef, onDone]);

  return {
    ref,
    returnKeyType: nextRef ? 'next' : 'done',
    onSubmitEditing,
  };
}
