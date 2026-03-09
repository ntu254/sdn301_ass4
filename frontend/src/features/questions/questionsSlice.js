import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/client";

export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/questions");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot load questions");
    }
  }
);

export const createQuestion = createAsyncThunk(
  "questions/createQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/questions", payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Create question failed");
    }
  }
);

export const updateQuestion = createAsyncThunk(
  "questions/updateQuestion",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/questions/${id}`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update question failed");
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/questions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete question failed");
    }
  }
);

const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    list: [],
    status: "idle",
    mutationStatus: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createQuestion.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.list.unshift(action.payload);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateQuestion.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.list = state.list.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })
      .addCase(deleteQuestion.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.list = state.list.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      });
  }
});

export default questionsSlice.reducer;
