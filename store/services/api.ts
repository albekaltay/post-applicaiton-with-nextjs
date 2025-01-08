import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const API_BASE_URL = 'https://dummyjson.com';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Posts', 'Comments','TagList'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'posts',
    }),
  }),
})

export const { useGetPostsQuery } = api