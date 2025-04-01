
import { LoadingOutlined } from "@ant-design/icons";
import { Divider, Spin } from "antd";
import Text from "../../components/TextComponent/Text";
import { COLORS } from "../../constants/colors";
import { usePosts } from "../../hooks";

const NewsPage = () => {
    const { data, isLoading, error } = usePosts();

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin
                    style={{ color: COLORS.DARK_SLATE }}
                    indicator={<LoadingOutlined spin />}
                    size='large'
                />
            </div>
        );
    }

    if (error) {
        return <div>Lỗi: {error.message}</div>;
    }

    return (
        <div>
            <Text text="NewsPage" />

            {data?.map(news => (
                <div key={news.id}>
                    <Text text={news.id.toString()} />
                    <Text text={news.title} />
                    <Text text={news.body} />
                    <Divider />
                </div>
            ))}

        </div>
    );
};

export default NewsPage