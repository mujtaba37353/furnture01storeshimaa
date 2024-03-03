import { Box, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ContentState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./draft.style.css";
import draftToHtml from "draftjs-to-html";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { stateFromHTML } from 'draft-js-import-html';

const DraftEditor = (props) => {
  const _contentState = ContentState.createFromText("Sample content state");
  /*   const raw = convertToRaw(_contentState); */ // RawDraftContentState JSON
  //   const [contentState, setContentState] = useState(raw);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const { palette } = useTheme();
  const [_, { language: lang }] = useTranslation();
  useEffect(() => {
    if (props?.edit) {
      console.log(props?.value,'sadsadqeqe');
      // const doc = new DOMParser().parseFromString(props?.value, "text/html");
      // const textContent = doc.body.textContent;
      // const contentState = ContentState.createFromText(textContent);
      // const newEditorState = EditorState.createWithContent(contentState);
      const contentState = stateFromHTML(props?.value);

// Create EditorState with the converted content
const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    }
  }, [props?.value]);

  const convertToHtml = () => {
    const contentState = editorState.getCurrentContent();
    const contentRaw = convertToRaw(contentState);
    const html = draftToHtml(contentRaw);
    props?.handleChange(html);
  };
  return (
    <Stack
      component={Editor}
      editorState={editorState}
      onEditorStateChange={setEditorState}
      wrapperClassName={`wrapper-class wrapper-class-${palette.mode}`}
      editorClassName="editor-class"
      toolbarClassName={`toolbar-class-${palette.mode}`}
      onChange={convertToHtml}
      touched={props.touched}
      value={props.value}
      field={props.field}
      error={props.error}
      onBlur={props.handleBlur}
      id={props?.id}
      placeholder={lang === "en" ? "Write here..." : "أكتب هنا..."}

      //    toolbar={{
      //     options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
      //     // inline: { inDropdown: true },
      //     // list: { inDropdown: true },
      //     // textAlign: { inDropdown: true },
      //     // link: { inDropdown: true },
      //     // history: { inDropdown: true },
      // }}
    ></Stack>
  );
};

export default DraftEditor;
