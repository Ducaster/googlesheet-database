import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.scss";
import axios from "axios";

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

  //받은 modalData 처리 부분
  let jsonmodalData: any = {};
  if (modalData != "") {
    const stringmodalData = JSON.stringify(modalData);
    const slicemodalData = stringmodalData.slice(1, -1);
    jsonmodalData = JSON.parse(slicemodalData);
  }

  const [이름, set이름] = useState(jsonmodalData.이름 || "");
  const [내용1, set내용1] = useState(jsonmodalData.내용1 || "");
  const [내용2, set내용2] = useState(jsonmodalData.내용2 || "");
  const [내용3, set내용3] = useState(jsonmodalData.내용3 || "");
  const [내용4, set내용4] = useState(jsonmodalData.내용4 || "");
  const [내용5, set내용5] = useState(jsonmodalData.내용5 || "");

  // 삽입 버튼 클릭 이벤트 함수
  const insertButtonclick = async () => {
    const inputData = {
      이름: 이름,
      내용1: 내용1,
      내용2: 내용2,
      내용3: 내용3,
      내용4: 내용4,
      내용5: 내용5,
    };
    console.log(inputData);
    axios.post("/api/googlesheet", inputData).then((response) => {
      if (response.status === 200) {
        alert("삽입 완료");
        onClose();
      }
      if (response.status === 400) {
        alert("삽입 실패");
        onClose();
      }
    });
  };

  // 수정 버튼 클릭 이벤트 함수
  const updateButtonclick = async () => {
    const inputData = {
      이름: 이름,
      내용1: 내용1,
      내용2: 내용2,
      내용3: 내용3,
      내용4: 내용4,
      내용5: 내용5,
    };
    axios
      .put("/api/googlesheet", { inputData, jsonmodalData })
      .then((response) => {
        if (response.status === 200) {
          alert("수정 완료");
          onClose();
        } else {
          alert("수정 실패");
          onClose();
        }
      });
  };

  // 삭제 버튼 클릭 이벤트 함수
  const deleteButtonclick = async () => {
    const inputData = {
      이름: 이름,
      내용1: 내용1,
      내용2: 내용2,
      내용3: 내용3,
      내용4: 내용4,
      내용5: 내용5,
    };
    axios.delete("/api/googlesheet", { data: inputData }).then((response) => {
      if (response.status === 200) {
        alert("삭제 완료");
        onClose();
      } else {
        alert("삭제 실패");
        onClose();
      }
    });
  };

  if (modalAction == "insert") {
    return ReactDOM.createPortal(
      <>
        <div className={styles.overlayStyle} />
        <div className={styles.modalStyle}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>이름 : </div>
            <input type="text" onChange={(e) => set이름(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>내용1 : </div>
            <input type="text" onChange={(e) => set내용1(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>내용2 : </div>
            <input type="text" onChange={(e) => set내용2(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>내용3 : </div>
            <input type="text" onChange={(e) => set내용3(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>내용4 : </div>
            <input type="text" onChange={(e) => set내용4(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>내용5 : </div>
            <input type="text" onChange={(e) => set내용5(e.target.value)} />
          </div>
          <button onClick={insertButtonclick}>삽입</button>
          <button onClick={onClose}>닫기</button>
        </div>
      </>,
      document.getElementById("global-modal") as HTMLElement
    );
  } else if (modalAction == "delete") {
    return ReactDOM.createPortal(
      <>
        <div className={styles.overlayStyle} />
        <div className={styles.modalStyle}>
          <div>삭제하시겠습니까?</div>
          <div>
            <button onClick={deleteButtonclick}>삭제</button>
            <button onClick={onClose}>취소</button>
          </div>
        </div>
      </>,
      document.getElementById("global-modal") as HTMLElement
    );
  } else if (modalAction == "update") {
    const name = jsonmodalData.이름;
    return ReactDOM.createPortal(
      <>
        <div className={styles.overlayStyle} />
        <div className={styles.modalStyle}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>이름 : </div>
            <input
              type="text"
              value={이름}
              onChange={(e) => set이름(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>내용1 : </div>
            <input
              type="text"
              value={내용1}
              onChange={(e) => set내용1((e.target as HTMLInputElement).value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>내용2 : </div>
            <input
              type="text"
              value={내용2}
              onChange={(e) => set내용2(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>내용3 : </div>
            <input
              type="text"
              value={내용3}
              onChange={(e) => set내용3(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>내용4 : </div>
            <input
              type="text"
              value={내용4}
              onChange={(e) => set내용4(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>내용5 : </div>
            <input
              type="text"
              value={내용5}
              onChange={(e) => set내용5(e.target.value)}
            />
          </div>
          <button onClick={updateButtonclick}>수정</button>
          <button onClick={onClose}>닫기</button>
        </div>
      </>,
      document.getElementById("global-modal") as HTMLElement
    );
  }
};

export default Modal;
