import React from 'react';
import { Pressable, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface ButtonProps {
    label: string;
    onPress: () => void;
    pressableClassName?: string;
    textClassName?: string;
    type?: string;
}

export const Button: React.FC<ButtonProps> = ({
    label,
    onPress,
    pressableClassName,
    textClassName,
    type,
}) => {
    const isSecondary = type === 'secondary';

    const pressableStyle = cn(
        isSecondary
            ? 'flex w-full justify-center items-center rounded-lg border-primary border-2 bg-gray-50 py-4'
            : 'flex w-full items-center justify-center rounded-lg bg-primary py-4',
        pressableClassName
    );

    const textStyle = cn(
        'font-bold',
        isSecondary ? 'text-primary' : 'text-light',
        textClassName
    );

    return (
        <Pressable className={pressableStyle} onPress={onPress}>
            <Text className={textStyle}>{label.toUpperCase()}</Text>
        </Pressable>
    );
};
