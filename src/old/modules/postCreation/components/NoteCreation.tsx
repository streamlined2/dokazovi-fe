import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NoteEditorToolbar from '../../../lib/components/Editor/Editors/NoteEditorToolbar';
import { PostTypeEnum } from '../../../lib/types';
import { TextPostCreation } from './TextPostCreation';
import { setGALocation } from '../../../../utilities/setGALocation';
import { langTokens } from '../../../../locales/localizationInit';

const NoteCreation: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    setGALocation(window);
  }, []);

  return (
    <TextPostCreation
      editorToolbar={NoteEditorToolbar}
      pageTitle={t(langTokens.editor.postCreation)}
      titleInputLabel={`${t(langTokens.editor.postTitle)}:`}
      contentInputLabel={`${t(langTokens.editor.postText)}:`}
      postType={{
        type: PostTypeEnum.DOPYS,
        name: t(langTokens.common.article),
      }}
    />
  );
};

export default NoteCreation;
