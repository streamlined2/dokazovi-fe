import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Typography, TextField, Box } from '@material-ui/core';
import VideoEditor from '../../../lib/components/Editor/Editors/VideoEditor';
import {
  setPostTitle,
  setAuthorsName,
  setAuthorsDetails,
  setPostBody,
  setVideoUrl,
  setPostDirections,
  setPostOrigin,
  resetDraft,
} from '../store/postCreationSlice';
import { IDirection, IOrigin, IPost, PostTypeEnum } from '../../../lib/types';
import { RootStateType } from '../../../store/rootReducer';
import { sanitizeHtml } from '../../../lib/utilities/sanitizeHtml';
import { parseVideoIdFromUrl } from '../../../lib/utilities/parseVideoIdFromUrl';
import VideoUrlInputModal from '../../../lib/components/Editor/CustomModules/VideoUrlInputModal';
import { PostCreationButtons } from './PostCreationButtons';
import { PageTitle } from '../../../lib/components/Pages/PageTitle';
import { createPost } from '../../../lib/utilities/API/api';
import { CreateVideoPostRequestType } from '../../../lib/utilities/API/types';
import { CONTENT_DEBOUNCE_TIMEOUT } from '../../../lib/constants/editors';
import PostView from '../../posts/components/PostView';
import { PostDirectionsSelector } from './PostDirectionsSelector';
import { PostOriginsSelector } from './PostOriginsSelector';

const VideoCreation: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const savedPostDraft = useSelector(
    (state: RootStateType) => state.newPostDraft[PostTypeEnum.VIDEO],
  );
  const { user } = useSelector((state: RootStateType) => state.currentUser);

  const [title, setTitle] = useState({
    value: savedPostDraft.title,
    error: '',
  });

  const [authorsName, setAuthName] = useState({
    value: savedPostDraft.authorsName,
    error: '',
  });

  const [authorsDetails, setAuthDetails] = useState({
    value: savedPostDraft.authorsDetails,
    error: '',
  });

  const [typing, setTyping] = useState({ content: false });
  const [previewing, setPreviewing] = useState(false);

  const videoUrl = useSelector(
    (state: RootStateType) => state.newPostDraft[PostTypeEnum.VIDEO].videoUrl,
  );

  const videoId = parseVideoIdFromUrl(videoUrl);

  const handleDirectionsChange = (value: IDirection[]) => {
    dispatch(setPostDirections({ postType: PostTypeEnum.VIDEO, value }));
  };

  const handleOriginsChange = (value: IOrigin[]) => {
    setAuthName({ ...authorsName, value: '' });
    setAuthDetails({ ...authorsDetails, value: '' });
    dispatch(setPostOrigin({ postType: PostTypeEnum.VIDEO, value }));
  };

  const handleTitleChange = (value: string) => {
    dispatch(setPostTitle({ postType: PostTypeEnum.VIDEO, value }));
  };

  const handleAuthorsNameChange = (value: string) => {
    dispatch(setAuthorsName({ postType: PostTypeEnum.VIDEO, value }));
  };

  const handleAuthorsDetailsChange = (value: string) => {
    dispatch(setAuthorsDetails({ postType: PostTypeEnum.VIDEO, value }));
  };

  const handleVideoUrlChange = (url: string) => {
    dispatch(setVideoUrl(url));
  };

  const handleHtmlContentChange = useCallback(
    _.debounce((value: string) => {
      dispatch(
        setPostBody({
          postType: PostTypeEnum.VIDEO,
          value: sanitizeHtml(value),
        }),
      );
      setTyping({ ...typing, content: false });
    }, CONTENT_DEBOUNCE_TIMEOUT),
    [],
  );

  const newPost: CreateVideoPostRequestType = {
    content: savedPostDraft.htmlContent,
    directions: savedPostDraft.directions,
    origin: savedPostDraft.origin,
    preview: savedPostDraft.htmlContent, // currently no preview
    type: { id: PostTypeEnum.VIDEO },
    title: savedPostDraft.title,
    authorsName: savedPostDraft.authorsName,
    authorsDetails: savedPostDraft.authorsDetails,
    videoUrl: savedPostDraft.videoUrl,
  };

  const handlePublishClick = async () => {
    const responsePost = await createPost(newPost);
    dispatch(resetDraft(PostTypeEnum.VIDEO));
    history.push(`/posts/${responsePost.data.id}`);
  };

  const previewPost = React.useMemo(
    () =>
      ({
        author: user,
        content: savedPostDraft.htmlContent,
        createdAt: new Date().toLocaleDateString('en-GB').split('/').join('.'),
        directions: savedPostDraft.directions,
        title: savedPostDraft.title,
        videoUrl: savedPostDraft.videoUrl,
        type: { id: PostTypeEnum.VIDEO, name: 'Відео' },
      } as IPost),
    [user, savedPostDraft],
  );

  let extraFieldsForTranslation: null | JSX.Element = null;

  if (savedPostDraft.origin[0]) {
    if (savedPostDraft.origin[0].id === 3) {
      extraFieldsForTranslation = (
        <>
          <Box mt={2}>
            <Typography variant="h5">Ім`я автора</Typography>
            <TextField
              error={Boolean(authorsName.error)}
              helperText={authorsName.error}
              fullWidth
              required
              id="authorsName"
              value={authorsName.value}
              onChange={(e) => {
                setAuthName({ ...authorsName, value: e.target.value });
                handleAuthorsNameChange(e.target.value);
              }}
            />
          </Box>
          <Box mt={2}>
            <Typography variant="h5">Детальна інформація про автора</Typography>
            <TextField
              error={Boolean(authorsDetails.error)}
              helperText={authorsDetails.error}
              fullWidth
              required
              id="authorsDetails"
              value={authorsDetails.value}
              onChange={(e) => {
                setAuthDetails({ ...authorsDetails, value: e.target.value });
                handleAuthorsDetailsChange(e.target.value);
              }}
            />
          </Box>
        </>
      );
    } else {
      handleAuthorsNameChange('');
      handleAuthorsDetailsChange('');
    }
  }

  return (
    <>
      <PageTitle title="Створення відео" />

      {!previewing ? (
        <>
          <PostDirectionsSelector
            selectedDirections={savedPostDraft.directions}
            onSelectedDirectionsChange={handleDirectionsChange}
          />
          <PostOriginsSelector
            selectedOrigin={savedPostDraft.origin}
            onSelectedOriginChange={handleOriginsChange}
          />
          {extraFieldsForTranslation}
          <Box mt={2}>
            <Typography variant="h5">Заголовок відео:</Typography>
            <TextField
              error={Boolean(title.error)}
              helperText={title.error}
              fullWidth
              required
              id="video-name"
              value={title.value}
              onChange={(e) => {
                setTitle({ ...title, value: e.target.value });
                handleTitleChange(e.target.value);
              }}
            />
          </Box>
          <Box mt={2}>
            <VideoUrlInputModal dispatchVideoUrl={handleVideoUrlChange} />
            {videoId && (
              <iframe
                title="video"
                width="360"
                height="240"
                src={`http://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allowFullScreen
              />
            )}
          </Box>
          <Box mt={2}>
            <Typography variant="h5">Опис відео:</Typography>
            <VideoEditor
              initialHtmlContent={savedPostDraft.htmlContent}
              onHtmlContentChange={(value) => {
                setTyping({ ...typing, content: true });
                handleHtmlContentChange(value);
              }}
            />
          </Box>
        </>
      ) : (
        <PostView post={previewPost} />
      )}

      <PostCreationButtons
        action="creating"
        onPublishClick={handlePublishClick}
        onPreviewClick={() => {
          setPreviewing(!previewing);
        }}
        previewing={previewing}
        disabled={Object.values(typing).some((i) => i)}
      />
    </>
  );
};

export default VideoCreation;
