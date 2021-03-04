import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostView from '../posts/components/PostView';
import { RootStateType } from '../../store/rootReducer';
import { IPost, PostTypeEnum } from '../../lib/types';
import usePostPreviewData from '../../lib/hooks/usePostPreviewData';
import PostCreationButtons from '../../lib/components/PostCreationButtons/PostCreationButtons';
import { PostPostRequestType } from '../../lib/utilities/API/types';
import { postPublishPost } from '../../lib/utilities/API/api';

export interface ILocationState {
  postType: string;
  publishPost: PostPostRequestType;
}

const PostCreationPreview: React.FC = () => {
  const history = useHistory();

  const currentState = history.location.state as ILocationState;

  const draft = useSelector(
    (state: RootStateType) =>
      state.newPostDraft[currentState.postType as PostTypeEnum],
  );

  const allDirections = useSelector(
    (state: RootStateType) => state.properties.directions,
  );

  const directions = allDirections.filter((direction) =>
    draft.topics.includes(direction.id.toString()),
  );

  const getUserData = usePostPreviewData();

  const post = {
    ...getUserData,
    content: draft.htmlContent,
    preview: draft.preview.value,
    title: draft.title,
    directions,
  } as IPost;

  const goBackToCreation = () => {
    history.goBack();
  };

  const sendPost = async () => {
    const responsePost = await postPublishPost(currentState.publishPost);
    history.push(`/posts/${responsePost.data.id}`);
  };

  return (
    <>
      <PostView post={post} />
      <PostCreationButtons
        publishPost={sendPost}
        goPreview={goBackToCreation}
        isOnPreview
      />
    </>
  );
};

export default PostCreationPreview;
