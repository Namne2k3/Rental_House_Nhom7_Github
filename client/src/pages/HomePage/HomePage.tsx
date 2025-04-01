import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { ReactNode } from "react";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import { COLORS } from "../../constants/colors";
import './styles.css';
import Text from "../../components/TextComponent/Text";
import { fonts } from "../../constants/fonts";
import PriceFilterComponent from "../../components/PriceFilterComponent/PriceFilterComponent";
import AreaFilterComponent from "../../components/AreaFilterComponent/AreaFilterComponent";
const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    padding: '0 48px', // Thay đổi padding
    height: '64px', // Thêm chiều cao cố định
    backgroundColor: 'transparent',
    overflow: 'hidden', // Ngăn content tràn ra ngoài
    maxWidth: 1400,
    margin: 'auto'
    // border: '1px solid #000'
};

const contentStyle: React.CSSProperties = {
    minHeight: '100vh',
    color: '#fff',
    margin: 16,
    // border: '1px solid #000'
};

const siderStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: '#fff',
    margin: 16,
    marginLeft: 0,
    border: `1px solid ${COLORS.TAUPE}`,
    borderRadius: 12,
    padding: "6px 12px",
    height: 'fit-content' // Add this li
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    // border: '1px solid #000'
};

const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    margin: '12px auto',
    maxWidth: 1400,
    // border: '1px solid #000'
};

interface HomePageProps {
    children: ReactNode;
    slider?: boolean; // Make slider optional with ?
    navbar?: boolean
}

const HomePage = ({ children, slider = true, navbar = true }: HomePageProps) => {
    // const { currentPage } = useAppSelector((state) => state.page)
    return (
        <div style={{ margin: 12 }}>
            {
                navbar &&
                <Header style={headerStyle}>
                    <NavbarComponent />
                </Header>
            }
            <Layout style={layoutStyle}>
                <Layout>
                    <Content style={contentStyle}>
                        {children}
                    </Content>
                    {
                        slider &&
                        <Sider className="slider-section-rental-page" width="25%" style={siderStyle}>
                            <div>
                                <Text fontSize={16} fontFamily={fonts.medium} text="Lọc theo khoảng giá" />
                                <div>
                                    <PriceFilterComponent />
                                </div>
                            </div>
                            <div>
                                <Text fontSize={16} fontFamily={fonts.medium} text="Lọc theo diện tích" />
                                <AreaFilterComponent />
                            </div>
                        </Sider>
                    }
                </Layout>
                <FooterComponent />
            </Layout>
        </div>
    )
}

export default HomePage