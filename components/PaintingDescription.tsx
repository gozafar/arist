'use client';

import MDEditor from '@uiw/react-md-editor';

interface PaintingDescriptionProps {
  description: string;
}

const PaintingDescription = ({ description }: PaintingDescriptionProps) => {
  return (
    <div data-color-mode='light '>
      <MDEditor
        value={description}
        height={320}
        preview='preview'
        hideToolbar={true}
        textareaProps={{
          disabled: true,
        }}
      />
    </div>
  );
};

export default PaintingDescription;
