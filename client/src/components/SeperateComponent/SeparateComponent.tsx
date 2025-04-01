import './styles.css'

type Props = {
    height?: number,
    backgroundColor?: React.CSSProperties['backgroundColor'],
}
const SeparateComponent = ({ height = 12, backgroundColor = 'transparent' }: Props) => {
    return (
        <div
            style={{
                height: `${height}px`,
                width: '100%',
                backgroundColor: backgroundColor
            }}
        />
    )
}

export default SeparateComponent