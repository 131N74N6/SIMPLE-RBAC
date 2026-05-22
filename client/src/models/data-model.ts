export type EditDataIntrf<T> = {
    api_url: string;
    data: Partial<Omit<T, "_id">>;
}

export type GetDataIntrf = {
    api_url: string;
    stale_time: number;
    query_key: string[];
}

export type InfiniteScrollIntrf = {
    api_url: string;
    limit: number;
    stale_time: number;
    query_key: string[];
    searched?: string;
}

export type InsertDataIntrf<T> = {
    api_url: string;
    data: Omit<T, "_id">;
}