import { useState } from "react";
import AuthServices from "./auth.service";
import type { EditDataIntrf, GetDataIntrf, InfiniteScrollIntrf, InsertDataIntrf } from "../models/data-model";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export default function DataServices() {
    const { currentUserToken, userLoading } = AuthServices();
    const [dataError, setDataError] = useState<string | null>(null);

    async function addData<X>(props: InsertDataIntrf<X>) {
        try {
            const request = await fetch(props.api_url, {
                body: JSON.stringify(props.data),
                headers: {
                    'Authorization': `Bearer ${currentUserToken!}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
            });

            if (!request.ok) {
                const errorData = await request.json();
                throw new Error(errorData.message || "Failed to add data. Try again later.");
            } else {
                await request.json();
                setDataError(null);
            }
        } catch (error: any) {
            setDataError(error.message || "Check your internet connection and try again later.");
            throw error;
        }
    }

    async function deleteData(url: string) {
        try {
            const request = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${currentUserToken!}`,
                    'Content-Type': 'application/json'
                },
                method: "DELETE",
            });

            if (!request.ok) {
                const errorData = await request.json();
                throw new Error(errorData.message || "Failed to delete data");
            } else {
                await request.json();
                setDataError(null);
            }
        } catch (error: any) {
            setDataError(error.message || "Check your internet connection and try again later.");
            throw error;
        }
    }

    async function editData<X>(props: EditDataIntrf<X>) {
        try {
            const request = await fetch(props.api_url, {
                body: JSON.stringify(props.data),
                headers: {
                    'Authorization': `Bearer ${currentUserToken!}`,
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
            });

            if (!request.ok) {
                const errorData = await request.json();
                throw new Error(errorData.message || "Failed to edit data");
            } else {
                await request.json();
                setDataError(null);
            }
        } catch (error: any) {
            setDataError(error.message || "Check your internet connection and try again later.");
            throw error;
        }
    }

    function getData<X>(props: GetDataIntrf) {
        const { data, error, isLoading } = useQuery<X, Error>({
            enabled: !userLoading && !!currentUserToken,
            queryFn: async () => {
                const request = await fetch(props.api_url, {
                    headers: {
                        'Authorization': `Bearer ${currentUserToken!}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                });

                const result = await request.json();

                if (!request.ok) {
                    throw new Error(result.message || "Failed to fetch data");
                } else {
                    return result as X;
                }
            },
            queryKey: props.query_key,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
            staleTime: props.stale_time,
        });

        return { data, error, isLoading };
    }

    function infiniteScroll<X>(props: InfiniteScrollIntrf) {
        const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
            enabled: !userLoading && !!currentUserToken,
            getNextPageParam: (lastPage, allPages): number | undefined => {
                if (lastPage.length < props.limit) return;
                return allPages.length + 1;
            },
            queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
                if (props.searched === undefined) {
                    const request1 = await fetch(`${props.api_url}?page=${pageParam}&limit=${props.limit}`, {
                        headers: {
                            'Authorization': `Bearer ${currentUserToken!}`,
                            'Content-Type': 'application/json'
                        },
                        method: 'GET'
                    });

                    const response = await request1.json();

                    if (!request1.ok) {
                        throw new Error(response.message);
                    } else {
                        setDataError(null);
                        return response;
                    }
                } else {
                    const request2 = await fetch(`${props.api_url}?search=${props.searched}&page=${pageParam}&limit=${props.limit}`, {
                        headers: {
                            'Authorization': `Bearer ${currentUserToken!}`,
                            'Content-Type': 'application/json'
                        },
                        method: 'GET'
                    });
                    
                    const response = await request2.json();

                    if (!request2.ok) {
                        throw new Error(response.message);
                    } else {
                        setDataError(null);
                        return response;
                    }
                }
            },
            queryKey: props.query_key,
            initialPageParam: 1,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
            staleTime: props.stale_time,
        });

        const flatennedData: X[] = data ? data.pages.flat() : [];

        return { error, flatennedData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading }
    }

    return { addData, dataError, deleteData, editData, getData, infiniteScroll, setDataError }
}
