import { ReactNode } from 'react'
import './styles.css'
import { Flex } from 'antd'
import { FlexProps } from 'antd'

const FlexComponent = ({ children, ...props }: { children: ReactNode } & FlexProps) => {
    return (
        <Flex {...props}>
            {children}
        </Flex>
    )
}

export default FlexComponent