import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { EditorState, Modifier, AtomicBlockUtils, ContentState } from 'draft-js';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { BiWrench } from "react-icons/bi"
import { createHandouts } from '../ReduxToolKit/Slice/userSlice';
import { TbSettingsSearch } from "react-icons/tb";
import {IoIosArrowForward, IoMdAddCircleOutline} from "react-icons/io";
import { TbLocation } from "react-icons/tb";
import { HiInboxArrowDown } from "react-icons/hi2";
import { convertToRaw } from 'draft-js';
import {FaArrowRotateLeft, FaVolumeHigh} from "react-icons/fa6";
import {GrDislike} from "react-icons/gr";
import {IoCopyOutline} from "react-icons/io5";

class CustomOption extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
    clicked: PropTypes.bool,
    toggleToolbar: PropTypes.func,
    toggleToolbarHide: PropTypes.func,
    addStar: PropTypes.func,
    saveHandout: PropTypes.func
  };


  render() {
    const { clicked, toggleToolbarHide, addStar, saveHandout } = this.props;
    return (<>
            <div className='rdw-link-wrapper no-color' hidden={!clicked} data-tooltip-content="save" data-tooltip-id="saveHandoutTooltip"><div className='rdw-option-wrapper' title="save" onClick={saveHandout}> <HiInboxArrowDown size={17} /></div></div>
            <div className='rdw-link-wrapper no-color' hidden={!clicked} data-tooltip-content="share" data-tooltip-id="saveHandoutTooltip"><div className='rdw-option-wrapper' title="share" onClick={addStar}><TbLocation size={17} /></div></div>
            <div className='rdw-link-wrapper no-color' hidden={!clicked} onClick={toggleToolbarHide}><div className='rdw-option-wrapper' onClick={addStar}><IoIosArrowForward  size={17} /></div></div>
        </>
    );
  }
}

class ControlledEditor extends Component {
    constructor(props) {
      super(props);
      this.state = {
          editorState: EditorState.createEmpty(),
          clicked: false
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
  saveHandout = async () => {
    const contentState = this.state.editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const textContent = rawContent.blocks.map(block => block.text).join("\n");

    try {
        // Directly pass the object as the argument
        const response = await this.props.createHandouts({ content: textContent });
        if (response.payload && response.payload.status === 201) {
            window.alert("Handout successfully saved!");
        } else {
            window.alert("Failed to save the handout.");
        }
    } catch (error) {
        console.error('Error:', error);
        window.alert("An unexpected error occurred.");
    }
};

    render() {
        const { editorState, clicked } = this.state;
        const placeholderText = `- Drag and drop highlights from the generator to here\n- Add your own words by clicking anywhere on the canvas\n- Add images, logos, and links, save your canvas or share with clients using the tool box`

        return (
            <div className='editor'>
                <div className="position-relative">
                 <div className='canvas' ><button className="generator-icon"><IoMdAddCircleOutline className="solid"/></button>New canvas</div>
                    <div className="tool-bar">
                        <button className='showtoolbar' hidden={clicked} onClick={this.toggleToolbar}><div className='cus-button' ><BiWrench size={50} /></div></button>
                    </div>
                </div>
                <Editor
                    toolbarHidden={!clicked}
                    editorState={editorState}
                    wrapperClassName="wrapper-class"
                    editorClassName={clicked ? "editor-classh" : "editor-class"}
                    placeholder={editorState.getCurrentContent().hasText() ? null : placeholderText} // Conditionally render placeholder
                    toolbarClassName="toolbar-class"
                    toolbarCustomButtons={[<CustomOption
                        clicked={this.state.clicked}
                        toggleToolbarHide={this.toggleToolbarHide}
                        addStar={this.addStar}
                        saveHandout={this.saveHandout}
                    />
                    ]}
                    // readOnly={true}
                    toolbar={{
                        options: ['image','link'],
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
                <hr className={clicked ? "col-dashed-line" : "dashed-line"}/>
                  <div style={{marginLeft: "12px"}}>
                  <button className="generator-icon" ><FaArrowRotateLeft /></button>
                      <button className="generator-icon"><GrDislike /></button>
                      <button className="generator-icon"><IoCopyOutline /></button>
                      <button className="generator-icon"><FaVolumeHigh /></button>
                  </div>
                </div>

        );
    }
}
const mapDispatchToProps = {
  createHandouts
};


export default connect(null, mapDispatchToProps)(ControlledEditor);