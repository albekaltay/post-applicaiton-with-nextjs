import { GetPostsResponse, GetPostsParams, IPost, CreatePostRequest, CreatePostResponse, GetPostsByTagArgs, IUser, GetCommentsResponse, CommentRequest } from '@/types/types';
import { api } from './api';


export const postApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<GetPostsResponse, GetPostsParams>({
      query: (params) => ({
        url: 'posts',
        params: {
          limit: params.limit,
          skip: params.skip,
          sortBy: params.sortBy,
          order: params.order
        }
      }),
      providesTags: ['Posts']
    }),
    getPostById: builder.query<IPost, string>({
      query: (id) => `posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Posts', id }]
    }),
    createPost: builder.mutation<CreatePostResponse, CreatePostRequest>({
      query: (post) => ({
        url: 'posts/add',
        method: 'POST',
        body: post,
      }),
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        try {
          const { data: createdPost } = await queryFulfilled;
          dispatch(
            postApi.util.updateQueryData('getPosts', { limit: 10, skip: 0 }, (draft: GetPostsResponse) => {
              draft.posts.unshift(createdPost as IPost);
            })
          );
        } catch {
        }
      },
      invalidatesTags: ['Posts']
    }),
    updatePost: builder.mutation<IPost, { id: number; title: string; userId: number }>({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData('getPosts', { limit: 10, skip: 0 }, (draft: GetPostsResponse) => {
            const post = draft.posts.find((post: IPost) => post.id === id);
            if (post) {
              Object.assign(post, patch);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }]
    }),
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApi.util.updateQueryData('getPosts', { limit: 10, skip: 0 }, (draft: GetPostsResponse) => {
            draft.posts = draft.posts.filter((post: IPost) => post.id !== id);
            return draft;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Posts'],
    }),
    getPostCommentsByPostId: builder.query<GetCommentsResponse, number>({
      query: (postId) => `posts/${postId}/comments`,
      providesTags: (result, error, postId) => [{ type: 'Comments', id: postId }]
    }),
    addNewComment: builder.mutation({
      query: (comment: CommentRequest) => ({
        url: '/comments/add',
        method: 'POST',
        body: comment
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comments', id: postId }
      ]
    }),
    getPostTagList: builder.query<string[], void>({
      query: () => ({
        url: '/posts/tag-list',
      }),
      providesTags: ['TagList','Posts']
    }),
    getPostsByTag: builder.query<GetPostsResponse, GetPostsByTagArgs>({
      query: ({ tag, limit = 10, skip = 0, sortBy, order }) => ({
        url: `/posts/tag/${tag}`,
        params: {
          limit,
          skip,
          sortBy,
          order,
        },
      }),
      providesTags: ['Posts']
    }),
    getUserById: builder.query<IUser, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
      }),
    }),
  }),

  
  overrideExisting: true
})

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostTagListQuery,
  useGetPostsByTagQuery,
  useGetPostCommentsByPostIdQuery,
  useAddNewCommentMutation,
  useGetUserByIdQuery
} = postApi 