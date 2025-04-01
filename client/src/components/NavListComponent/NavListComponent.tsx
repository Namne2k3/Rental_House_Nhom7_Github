import { Row } from "antd"
import Text from "../TextComponent/Text"

const NavListComponent = () => {
    return (
        <Row style={{ margin: '0 24px', gap: 24, alignContent: 'center' }}>
            <Text text="Thuê Nhà Trọ" />
            <Text text="Tin Tức" />
        </Row>
    )
}

export default NavListComponent