/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDirection, PostTypeEnum } from '../../../lib/types';

export interface INewPostDraft {
  directions: IDirection[];
  title?: string;
  isDone?: boolean;
  htmlContent: string;
  preview: IPostPreview;
  videoUrl?: string;
}

interface IPostPreview {
  value: string;
  isManuallyChanged: boolean;
}

export interface IPostCreationState {
  [PostTypeEnum.ARTICLE]: INewPostDraft;
  [PostTypeEnum.DOPYS]: INewPostDraft;
  [PostTypeEnum.VIDEO]: INewPostDraft;
}

const initialState: IPostCreationState = {
  [PostTypeEnum.ARTICLE]: {
    directions: [],
    title: '',
    htmlContent: '',
    preview: { value: '', isManuallyChanged: false },
  },
  [PostTypeEnum.DOPYS]: {
    directions: [],
    htmlContent: '',
    preview: { value: '', isManuallyChanged: false },
  },
  [PostTypeEnum.VIDEO]: {
    directions: [],
    title: '',
    htmlContent: '',
    preview: { value: '', isManuallyChanged: false },
    videoUrl: '',
  },
};

export const postCreationSlice = createSlice({
  name: 'postCreation',
  initialState,
  reducers: {
    setPostDirections: (
      state,
      action: PayloadAction<{
        postType: PostTypeEnum;
        value: INewPostDraft['directions'];
      }>,
    ) => {
      state[action.payload.postType].directions = action.payload.value;
    },
    setPostTitle: (
      state,
      action: PayloadAction<{
        postType: PostTypeEnum;
        value: INewPostDraft['title'];
      }>,
    ) => {
      state[action.payload.postType].title = action.payload.value;
    },
    setIsDone: (
      state,
      action: PayloadAction<{
        postType: PostTypeEnum;
        value: INewPostDraft['isDone'];
      }>,
    ) => {
      state[action.payload.postType].isDone = action.payload.value;
    },
    setPostBody: (
      state,
      action: PayloadAction<{
        postType: PostTypeEnum;
        value: INewPostDraft['htmlContent'];
      }>,
    ) => {
      state[action.payload.postType].htmlContent = action.payload.value;
    },
    setPostPreviewText: (
      state,
      action: PayloadAction<{
        postType: PostTypeEnum;
        value: INewPostDraft['preview']['value'];
      }>,
    ) => {
      state[action.payload.postType].preview.value = action.payload.value;
    },
    setPostPreviewManuallyChanged: (
      state,
      action: PayloadAction<{
        postType: PostTypeEnum;
        value: INewPostDraft['preview']['isManuallyChanged'];
      }>,
    ) => {
      state[action.payload.postType].preview.isManuallyChanged =
        action.payload.value;
    },
    setVideoUrl: (
      state,
      action: PayloadAction<{
        postType: PostTypeEnum;
        value: INewPostDraft['videoUrl'];
      }>,
    ) => {
      state[action.payload.postType].videoUrl = action.payload.value;
    },
  },
});

export const {
  setPostDirections,
  setPostTitle,
  setIsDone,
  setPostBody,
  setPostPreviewText,
  setPostPreviewManuallyChanged,
  setVideoUrl,
} = postCreationSlice.actions;

const postCreationReducer = postCreationSlice.reducer;
export default postCreationReducer;
