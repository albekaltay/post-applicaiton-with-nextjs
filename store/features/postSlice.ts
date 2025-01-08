import { IPost } from '@/types/types'
import { createSlice } from '@reduxjs/toolkit'

interface PostState {
  selectedPost: IPost | null
  filters: {
    category: string | null
    sortBy: string | null
    searchTerm: string | null
  }
}

const initialState: PostState = {
  selectedPost: null,
  filters: {
    category: null,
    sortBy: null,
    searchTerm: null
  }
}

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    }
  }
})

export const { setSelectedPost, setFilters, clearFilters } = postSlice.actions
export default postSlice.reducer 