import { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import PropTypes from 'prop-types';
import { EditorState, Modifier, AtomicBlockUtils, ContentState } from 'draft-js';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { TbSettingsSearch } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import { TbLocation } from "react-icons/tb";
import { HiInboxArrowDown } from "react-icons/hi2";


class ControlledEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createWithContent(ContentState.createFromText(`- Drag and drop highlights from the generator to here\n- Add your own words by clicking anywhere on the canvas\n- Add images, logos, and links, save your canvas or share with clients using the tool box`, '\n')),
            clicked: true
        };
    }

    onEditorStateChange = (editorState) => {
        this.setState({ editorState });
    };

    toggleToolbar = () => {
        this.setState(prevState => ({ clicked:true}));
    };

    toggleToolbarHide = () => {
        this.setState(prevState => ({ clicked:false }));
    }

    handleFileDrop = (selectionState, files) => {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target.result;
          const editorState = this.state.editorState;
          const contentState = editorState.getCurrentContent();
          const contentStateWithEntity = contentState.createEntity('IMAGE', 'MUTABLE', { src: url });
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          const newEditorState = EditorState.push(
            editorState,
            contentStateWithEntity,
            'insert-characters'
          );
          this.setState({
            editorState: AtomicBlockUtils.insertAtomicBlock(
              newEditorState,
              entityKey,
              ' '
            ),
          });
        };
        reader.readAsDataURL(file);
      }

  uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        // You can perform any necessary validation here
        // For simplicity, we'll assume the file is an image
        resolve({ data: { link: event.target.result } });
      };
      reader.readAsDataURL(file);
    });
  };

    render() {
        const { editorState, clicked } = this.state;

        return (
            <div className='editor'>
                 <div className='canvas' >Canvas</div>
                <button className='showtoolbar' hidden={clicked} onClick={this.toggleToolbar}><div className='cus-button' ><TbSettingsSearch size={17} /></div></button>
                <button className='showtoolbarLeft' hidden={!clicked} onClick={this.toggleToolbarHide}><div className='cus-button' onClick={this.addStar}><IoIosArrowBack  size={17} /></div></button>
                <button className='showtoolbarLeft' hidden={!clicked}><div className='cus-button' onClick={this.addStar}><TbLocation size={17} /></div></button>
                <button className='showtoolbarLeft' hidden={!clicked} ><div className='cus-button' onClick={this.addStar}> <HiInboxArrowDown size={17} /></div></button>

                <Editor
                    toolbarHidden={!clicked}
                    editorState={editorState}
                    wrapperClassName="wrapper-class"
                    editorClassName={clicked ? "editor-classh" : "editor-class"}
                    toolbarClassName="toolbar-class"
                    readOnly={true}
                    toolbar={{
                        options: ['link', 'image'],
                        image: {
                            className: "no-color",
                          uploadCallback: this.uploadImageCallBack,
                          alt: { present: true, mandatory: false },
                        },
                        link: {
                            popupClassName: "link-popup",
                            options: ['link'],
                            className: "no-color",
                          }
                      }}
                    onEditorStateChange={this.onEditorStateChange}
                    handleDroppedFiles={this.handleFileDrop}
                />
                 
            </div>
        );
    }
}

export default ControlledEditor;






