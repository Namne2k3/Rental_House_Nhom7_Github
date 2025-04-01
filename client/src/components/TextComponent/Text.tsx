import { fonts } from '../../constants/fonts'
import { COLORS } from '../../constants/colors'

type TextProps = {
    text: string,
    fontSize?: string | number,
    color?: string,
    fontFamily?: string,
    className?: string,
    style?: React.CSSProperties
}

const defaultStyle: React.CSSProperties = {
    margin: '8px 0',
    padding: '4px',
    lineHeight: '1.5',
    textAlign: 'left',
    color: 'black',
    fontFamily: fonts.regular,
    display: 'flex',     // Add this
    alignItems: 'center'
}

const Text = ({
    text,
    fontSize = '14px',
    color,
    fontFamily,
    className,
    style
}: TextProps) => {
    return (
        <p
            className={className}
            style={{
                ...defaultStyle,
                fontSize,
                color: color || defaultStyle.color,
                fontFamily: fontFamily || defaultStyle.fontFamily,
                ...style,
            }}
        >
            {text}
        </p>
    )
}

export default Text