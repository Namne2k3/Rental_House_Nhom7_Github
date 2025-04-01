import { Button } from 'antd';
import { COLORS } from '../../constants/colors';
import React, { CSSProperties } from 'react';

interface ButtonProps {
    text: string;
    onClick?: () => void;
    backgroundColor?: CSSProperties["backgroundColor"];
    color?: CSSProperties["color"];
    type?: "primary" | "default" | "dashed" | "link" | "text";
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

const ButtonComponent: React.FC<ButtonProps> = ({
    text,
    onClick,
    backgroundColor = COLORS.DARK_SLATE,
    color = '#fff',
    type = 'default',
    className,
    style,
    disabled = false,
}) => {
    return (
        <Button
            onClick={onClick}
            type={'link'}
            className={className}
            disabled={disabled}
            style={{
                backgroundColor,
                color,
                ...style
            }}
        >
            {text}
        </Button>
    );
};

export default ButtonComponent;