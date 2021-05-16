import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { func, arrayOf, string, number, bool } from 'prop-types';
import contentCss from 'tinymce/skins/content/default/content.min.css';
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css';
import useStyles from 'isomorphic-style-loader/useStyles';
import skinCss from 'tinymce/skins/ui/oxide/skin.min.css';

const result = ({
  onChange,
  plugins,
  toolbar,
  initialValue,
  value,
  height = 500,
  menubar = false,
}) => {
  useStyles(skinCss);

  const [isTinyMCELoaded, setIsTinyMCELoaded] = useState(false);
  useEffect(() => {
    async function loadTinyMCE() {
      await import('tinymce/tinymce');
      await Promise.all([
        import('tinymce/themes/silver'),
        import('tinymce/icons/default'),
        import('tinymce/plugins/image'),
        import('tinymce/plugins/link'),
        import('tinymce/plugins/table'),
        import('tinymce/plugins/lists'),
      ]);
      setIsTinyMCELoaded(true);
    }

    loadTinyMCE();
  }, []);

  return isTinyMCELoaded && (
    <Editor
      onEditorChange={onChange}
      initialValue={initialValue}
      value={value}
      init={{
        height,
        menubar,
        plugins,
        toolbar,
        skin: false,
        content_css: false,
        // eslint-disable-next-line no-underscore-dangle
        content_style: [contentCss._getCss(), contentUiCss._getCss()].join('\n'),
      }}
    />
  );
};

result.propTypes = {
  onChange: func,
  plugins: arrayOf(string),
  toolbar: arrayOf(string),
  initialValue: string,
  height: number,
  menubar: bool,
  value: string,
};

result.displayName = __filename;

export default result;
