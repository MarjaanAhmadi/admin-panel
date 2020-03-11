import React from "react";
import ModalHOC from "../../HOC/modalHOC/modalHoc";
import { Modal } from "react-bootstrap";
import "./defaultModal.css";
const objectOrFunction = (component, props) => {
  if (typeof component === "function") {
    return component(props);
  }
  return component;
};

export const ModalComponent = props => {
  let item = props;
  const content = item.content;
  const header = item.header;
  const size = item.size;
  const modalHocProps = {
    open: props.open,
    toggleModal: props.modalHocProps.toggleModal
  }
  // const {
  //   content,
  //   header,
  //   size,
  //   modalHocProps: { open, toggleModal }
  // } = props;
  return (
    <Modal
      className="qcenter-fade"
      onHide={modalHocProps.toggleModal}
      show={props.open}
      size={size}
    >
      <Modal.Header closeButton>{header}</Modal.Header>
      <Modal.Body className="qcenter-modal-content">
        <div>{objectOrFunction(content, { modalHocProps })}</div>
      </Modal.Body>
    </Modal>
  );
};
const DefaultModal = ({ viewComponent, ...rest }) => {
  return (
    <ModalHOC
      viewComponent={viewComponent}
      modalComponent={modalHocProps => (
        <ModalComponent {...rest} modalHocProps={modalHocProps} />
      )}
    />
  );
};
export default DefaultModal;
