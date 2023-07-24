import { createSlice } from "@reduxjs/toolkit";
import { getInitQuest, getStatusQuest, getNextQuest } from "@actions/actions";
import { questStatuses } from "@/constants/constants";

const initialState = {
  current: {}, // Текущий шаг квеста
  previous: [], // Предыдущий шаг квеста
  questionCount: "", // Количество шагов в квесте
  questStatus: null, // Статус квеста (начат/не начат)
  isLoading: false,
  error: "",
  success: true,
  test: [],
  qrCodeAnswer: null,
  questTheme: null,
  notification: {
    success: false,
    message: "",
    visible: false,
  },
  finalMessage: null,
  rewards: null,
};

export const questExecutionSlice = createSlice({
  name: "questExecutionSlice",
  initialState,
  reducers: {
    addAnswerFromQRCodeReader(state, action) {
      state.qrCodeAnswer = action.payload;
    },
    clearStateSteps(state) {
      state.current = {};
      state.previous = [];
      state.questionCount = "";
      state.questStatus = null;
      state.isLoading = false;
      state.error = "";
      state.questTheme = null;
    },
    hideAnswerNotification(state) {
      state.notification.visible = false;
    },
  },
  extraReducers: {
    [getInitQuest.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getInitQuest.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = "";
      state.questStatus = action.payload.data.quest_status;
      state.questTheme = action.payload.data.quest_theme;
    },
    [getInitQuest.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      if (action.payload.data.previous) {
        state.previous = [...action.payload.data.previous];
      }
      if (action.payload.data.quest_status === questStatuses.FINISHED) {
        state.questStatus = action.payload.data.quest_status;
      }
    },
    [getStatusQuest.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getStatusQuest.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = "";
      state.current = action.payload.data.current;
      if (action.payload.data.previous) {
        state.previous = [...action.payload.data.previous];
      }
      state.questionCount = action.payload.data.question_count;
      state.questStatus = action.payload.data.quest_status;
      state.questTheme = action.payload.data.quest_theme;
    },
    [getStatusQuest.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [getNextQuest.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getNextQuest.fulfilled.type]: (state, action) => {
      state.isLoading = false;
      state.error = "";
      state.success = action.payload.data.success;
      state.notification = {
        success: Boolean(action.payload.data.success),
        message: Boolean(action.payload.data.success)
          ? "Вы ответили верно!"
          : "Ответ неверный, попробуйте снова",
        visible:
          action.payload.data.quest_status === questStatuses.IN_PROGRESS,
      };
      state.current = action.payload.data.current;
      state.questStatus = action.payload.data.quest_status;
      if (action.payload.data.previous) {
        state.previous = [...action.payload.data.previous];
      }
      state.finalMessage = action.payload.data?.final_message;
      if (action.payload.data?.rewards) {
        state.rewards = action.payload.data?.rewards;
      }
    },
    [getNextQuest.rejected.type]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});
export const { addAnswerFromQRCodeReader, hideAnswerNotification } =
  questExecutionSlice.actions;
export default questExecutionSlice.reducer;
