/* eslint-disable no-param-reassign */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';
import {
  RegionResponseType,
  DirectionResponseType,
  PostTypeResponseType,
  ExpertResponseType,
  LoginResponseType,
  PostResponseType,
  TagResponseType,
  VersionResponseType,
  CreateTagRequestType,
  CreatePostRequestType,
  ExpertsResponseType,
  PostsResponseType,
  GetTagsConfigType,
  GetExpertsConfigType,
  GetPostsConfigType,
  UpdatePostRequestType,
} from './types';
import { LocalStorageKeys } from '../../types';
import { BASE_URL } from '../../../apiURL';

export const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const jwtToken = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);
    if (jwtToken) {
      const header = `Bearer ${jwtToken}`;
      config.headers = { authorization: header };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

const defaultConfig = {
  paramsSerializer: (params: { [key: string]: unknown }): string => {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  },
};

type GetPostsRequestType = 'important' | 'latest' | 'latest-by-expert';

export const getPosts = async (
  postsRequestType: GetPostsRequestType,
  config?: GetPostsConfigType,
): Promise<AxiosResponse<PostsResponseType>> => {
  return instance.get(`/post/${postsRequestType}`, {
    ...defaultConfig,
    ...config,
  });
};

export const getRandomExperts = async (
  config?: GetExpertsConfigType,
): Promise<AxiosResponse<ExpertsResponseType>> => {
  return instance.get(`/user/random-experts`, { ...defaultConfig, ...config });
};

export const getAllExperts = async (
  config?: GetExpertsConfigType,
): Promise<AxiosResponse<ExpertsResponseType>> => {
  return instance.get('/user/all-experts', { ...defaultConfig, ...config });
};

export const getPostById = async (
  id: number,
): Promise<AxiosResponse<PostResponseType>> => {
  return instance.get(`/post/${id}`);
};

export const getExpertById = async (
  id: number,
): Promise<AxiosResponse<ExpertResponseType>> => {
  return instance.get(`/user/${id}`);
};

export const createTag = async (
  requestBody: CreateTagRequestType,
): Promise<AxiosResponse<TagResponseType>> =>
  instance.post(`/tag`, requestBody);

export const getTagsByValue = async (
  config: GetTagsConfigType,
): Promise<AxiosResponse<TagResponseType[]>> => {
  return instance.get(`/tag/find-by-value`, { ...defaultConfig, ...config });
};

export const getVersion = async (): Promise<
  AxiosResponse<VersionResponseType>
> => {
  return instance.get(`/version`);
};

export const getPostTypes = async (): Promise<
  AxiosResponse<PostTypeResponseType[]>
> => {
  return instance.get('post/type');
};

export const getRegions = async (): Promise<
  AxiosResponse<RegionResponseType[]>
> => {
  return instance.get(`/region`);
};

export const getDirections = async (): Promise<
  AxiosResponse<DirectionResponseType[]>
> => {
  return instance.get(`/direction`);
};

export const createPost = async (
  requestBody: CreatePostRequestType,
): Promise<AxiosResponse<PostResponseType>> => {
  return instance.post(`/post`, requestBody);
};

export const updatePost = async (
  requestBody: UpdatePostRequestType,
): Promise<AxiosResponse<PostResponseType>> => {
  return instance.post(`/post`, requestBody);
};

export const login = async (
  email: string,
  password: string,
): Promise<AxiosResponse<LoginResponseType>> => {
  return instance.post('/auth/login', { email, password });
};

export const getCurrentUser = async (): Promise<
  AxiosResponse<ExpertResponseType>
> => {
  return instance.get('/user/me');
};
