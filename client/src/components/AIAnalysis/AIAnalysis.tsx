import React, { useState } from "react";
import { Card, Button, Alert, Spin, List, Typography } from "antd";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";
import { RentalViewStats } from "../../types/rental";
import { RobotOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const API_KEY = "AIzaSyDCFljDw4lIAdxhwkdrQEnb-0XvYS97Xuw";

interface AIAnalysisProps {
    viewStats: RentalViewStats[];
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ viewStats }) => {
    const [aiAnalysis, setAiAnalysis] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(false);

    const analyzeWithAI = async () => {
        setLoading(true);
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `
            Dưới đây là dữ liệu về lượt xem nhà trọ:
            ${JSON.stringify(viewStats, null, 2)}
            Hãy phân tích dữ liệu và trả lời ngắn gọn với 3 mục:
            1. Loại diện tích nhà trọ được xem nhiều nhất
            2. Khu vực có nhà trọ được xem nhiều nhất
            3. Mức giá nhà trọ được xem nhiều nhất
            Và hãy đưa ra kết luận chung.
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const formattedResult = response.text().split("\n").filter(line => line.trim() !== "");
            setAiAnalysis(formattedResult);
        } catch (error) {
            console.error("Lỗi khi gọi API Gemini:", error);
            setAiAnalysis(["Không thể phân tích dữ liệu. Vui lòng thử lại!"]);
        }
        setLoading(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card title={<Title level={4}><RobotOutlined /> Phân tích xu hướng khách hàng với AI</Title>} style={{ borderRadius: 12 }}>
                <Button type="primary" onClick={analyzeWithAI} loading={loading} block>
                    {loading ? "Đang phân tích..." : "Chạy phân tích AI"}
                </Button>

                {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}

                {aiAnalysis && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
                        <Alert
                            style={{ marginTop: 16, borderRadius: 8 }}
                            message={<Text strong>Kết quả phân tích AI:</Text>}
                            description={
                                <List
                                    size="small"
                                    bordered
                                    dataSource={aiAnalysis}
                                    renderItem={(item) => <List.Item><Text type="secondary">{item}</Text></List.Item>}
                                />
                            }
                            type="info"
                            showIcon
                        />
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
};

export default AIAnalysis;
