import React from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.scss";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  modalAction: string;
  modalData: string;
}
/*
  // 삽입 버튼 클릭 이벤트 함수
  const insertButtonclick = async () => {
    const response = await fetch('/api/googlesheet',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modalData)
    });
  };

  // 수정 버튼 클릭 이벤트 함수
  const updateButtonclick = async () => {
    const response = await fetch('/api/googlesheet',{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedData)
    });
    const result = await response.json();
  };

  const deleteButtonclick = async () => {
    const selectedData = getSelectedRowData();
    const response = await fetch('/api/googlesheet',{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedData)
    });
    const result = await response.json();
  };
*/
const Modal = ({ open, onClose, modalAction, modalData }: ModalProps) => {
  if (!open) return null;
  const stringmodalData = JSON.stringify(modalData);
  const slicemodalData = stringmodalData.slice(1, -1);
  const jsonmodalData = JSON.parse(slicemodalData);

  if (modalAction == 'insert'){
    return ReactDOM.createPortal(
        <>
  <div className={styles.overlayStyle} />
  <div className={styles.modalStyle}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>이름 : </div>
      <input type="text"/>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>내용1 : </div>
      <input type="text"/>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>내용2 : </div>
      <input type="text"/>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>내용3 : </div>
      <input type="text"/>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>내용4 : </div>
      <input type="text"/>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>내용5 : </div>
      <input type="text"/>
    </div>
    <button>수정</button>
    <button onClick={onClose}>닫기</button>
  </div>
</>,
        document.getElementById("global-modal") as HTMLElement
      );

  } else if(modalAction == 'delete'){
    return ReactDOM.createPortal(
        <>
          <div className={styles.overlayStyle} />
          <div className={styles.modalStyle}>
            <div>삭제하시겠습니까?</div>
            <div>
                <button>삭제</button>
                <button onClick={onClose}>delete 모달 닫기</button>
            </div>
          </div>
        </>,
        document.getElementById("global-modal") as HTMLElement
      );
      
  } else if(modalAction == 'update'){
    return ReactDOM.createPortal(
        <>
  <div className={styles.overlayStyle} />
  <div className={styles.modalStyle}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>이름 : </div>
      <input type="text" value={jsonmodalData.이름} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>내용1 : </div>
      <input type="text" value={jsonmodalData.내용1} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>내용2 : </div>
      <input type="text" value={jsonmodalData.내용2} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>내용3 : </div>
      <input type="text" value={jsonmodalData.내용3} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>내용4 : </div>
      <input type="text" value={jsonmodalData.내용4} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>내용5 : </div>
      <input type="text" value={jsonmodalData.내용5} />
    </div>
    <button>수정</button>
    <button onClick={onClose}>닫기</button>
  </div>
</>,
        document.getElementById("global-modal") as HTMLElement
      );
  }
};

export default Modal;