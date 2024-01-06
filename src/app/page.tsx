'use client'
import React, { useState } from 'react';
import styles from './page.module.css';
import Modal  from './Modal';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalData, setmodalData] = useState(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleRowClick = (index: number) => {
    setSelectedRow({ [index]: true });
    console.log(selectedRow);
  };

  const handleOpenModal = (action: any, data: any) => {
    if (
      (Object.keys(selectedRow).length === 0 && action == 'delete') ||
      (Object.keys(selectedRow).length === 0 && action == 'update'))
       return setIsModalOpen(false);
    setModalAction(action);
    setmodalData(data);
    setIsModalOpen(true);
  }


  const getSelectedRowData = () => {
    if (Object.keys(selectedRow).length === 0) return alert('선택된 행이 없습니다.');
    const selectedData = Object.keys(selectedRow)
      .filter(key => selectedRow[Number(key)])
      .map(key => data[Number(key)]);
    console.log(selectedData);
    return selectedData;
  };

  // 찾기 버튼 클릭 이벤트 함수
  const selectButtonClick = async () => {
    const response = await fetch(`./api/googlesheet?query=${inputValue}`);
    const result = await response.json();
    console.log(result);
    if (result && result.data) {
      setData(result.data);
    }
  };
  
  return (
    <main className={styles.main}>
      <div>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button onClick={selectButtonClick}>찾기</button>
      </div>

      <table className={styles.table}>
        <tr>
          <th>이름</th>
          <th>내용1</th>
          <th>내용2</th>
          <th>내용3</th>
          <th>내용4</th>
          <th>내용5</th>
        </tr>
        {data.map((row: {
          이름: string; 
          내용1: string; 
          내용2: string; 
          내용3: string; 
          내용4: string; 
          내용5: string; 
        }, index: number) => (
          <tr 
          key={index} 
          onClick={() => handleRowClick(index)}
          style={selectedRow[index] ? { backgroundColor: 'gray' } : {}
          }>
            <td>{row.이름}</td>
            <td>{row.내용1}</td>
            <td>{row.내용2}</td>
            <td>{row.내용3}</td>
            <td>{row.내용4}</td>
            <td>{row.내용5}</td>
          </tr>
        ))}
      </table>

      <div>
        <button onClick={() => handleOpenModal('insert', '')}>삽입</button>
        <button onClick={() => handleOpenModal('delete', getSelectedRowData())}>삭제</button>
        <button onClick={() => handleOpenModal('update', getSelectedRowData())}>수정</button>
      </div>
      <Modal 
      open={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      modalAction={modalAction || ""}
      modalData={modalData || ""}
      />
    </main>
  );
}
