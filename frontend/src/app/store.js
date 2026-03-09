import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import quizzesReducer from "../features/quizzes/quizzesSlice";
import questionsReducer from "../features/questions/questionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quizzes: quizzesReducer,
    questions: questionsReducer
  }
});
