import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/client";

export const fetchQuizzes = createAsyncThunk(
  "quizzes/fetchQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/quizzes");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot load quizzes");
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  "quizzes/fetchQuizById",
  async (quizId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/quizzes/${quizId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot load quiz");
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "quizzes/submitQuiz",
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/quizzes/${quizId}/submit`, { answers });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Submit quiz failed");
    }
  }
);

export const createQuiz = createAsyncThunk(
  "quizzes/createQuiz",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/quizzes", payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Create quiz failed");
    }
  }
);

export const updateQuiz = createAsyncThunk(
  "quizzes/updateQuiz",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/quizzes/${id}`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update quiz failed");
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  "quizzes/deleteQuiz",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/quizzes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete quiz failed");
    }
  }
);

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: {
    list: [],
    currentQuiz: null,
    submitResult: null,
    listStatus: "idle",
    detailStatus: "idle",
    submitStatus: "idle",
    mutationStatus: "idle",
    error: null
  },
  reducers: {
    clearSubmitResult(state) {
      state.submitResult = null;
      state.submitStatus = "idle";
    },
    clearCurrentQuiz(state) {
      state.currentQuiz = null;
      state.submitResult = null;
      state.detailStatus = "idle";
      state.submitStatus = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.listStatus = "failed";
        state.list = [];
        state.error = action.payload;
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.detailStatus = "loading";
        state.currentQuiz = null;
        state.submitResult = null;
        state.submitStatus = "idle";
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.currentQuiz = null;
        state.error = action.payload;
      })
      .addCase(submitQuiz.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.submitResult = action.payload;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.payload;
      })
      .addCase(createQuiz.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.list.unshift(action.payload);
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateQuiz.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.list = state.list.map((quiz) =>
          quiz.id === action.payload._id || quiz._id === action.payload._id
            ? action.payload
            : quiz
        );
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })
      .addCase(deleteQuiz.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.list = state.list.filter(
          (quiz) => quiz.id !== action.payload && quiz._id !== action.payload
        );
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      });
  }
});

export const { clearSubmitResult, clearCurrentQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;