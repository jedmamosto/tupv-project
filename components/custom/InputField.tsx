import { useState } from 'react';
import { TextInputProps, View, Text, TextInput } from 'react-native';
import { cn } from '@/lib/utils';

interface InputFieldProps extends TextInputProps {
    label: string;
    error?: string;
    helperText?: string;
    containerClass?: string;
    editable?: boolean;
    onChangeText?: (text: string) => void;
}

export default function InputField({
    label,
    error,
    helperText,
    containerClass,
    editable = true,
    onChangeText,
    value,
    placeholder,
    secureTextEntry,
}: InputFieldProps) {
    const [isFocused, setIsFocused] = useState(false);

    const focusMode = 'outline-primary border-2';
    const errorMode = 'outline-danger bg-warning text';

    const inputClasses = cn(
        'w-full min-h-12 px-4 text-base rounded-lg bg-white',
        editable
            ? isFocused
                ? focusMode
                : 'border-secondary-100 border-2'
            : 'bg-secondary-50 border-secondary-100 border-2',
        error ? errorMode : ''
    );

    const viewClass = cn(
        'mb-4 w-full gap-1 flex justify-center',
        containerClass
    );

    return (
        <View className={viewClass}>
            <Text className="mb-2 text-base font-medium text-primary">
                {label}
            </Text>

            <TextInput
                className={inputClasses}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                placeholderTextColor={error ? '#ffffff' : '#77874d'}
                editable={editable}
            />

            {error ? (
                <Text className="mt-1 text-sm text-danger">{error}</Text>
            ) : helperText ? (
                <Text className="text-sm text-primary-900">{helperText}</Text>
            ) : null}
        </View>
    );
}
