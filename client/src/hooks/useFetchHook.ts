import { useEffect, useState } from "react";
import api from "../services/api";
import { AxiosError, AxiosRequestConfig } from "axios";

interface FetchConfig extends Omit<AxiosRequestConfig, 'url' | 'data'> {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
}

function useFetch<T>(url: string, config: FetchConfig = {}) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const { method = 'GET', body, ...restConfig } = config;

                const response = await api.request({
                    url,
                    method,
                    data: body,
                    ...restConfig
                });

                setData(response.data);
            } catch (err) {
                const error = err as AxiosError;
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [config, url]);

    return { data, loading, error };
}

export default useFetch;