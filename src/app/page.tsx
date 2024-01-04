'use client'
import React, { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = async () => {
    const response = await fetch(`/api/googlesheet?query=${inputValue}`);
    const result = await response.json();
    console.log(result);
    setData(result.data);
  };
  
  return (
    <main className={styles.main}>
      <div>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button onClick={handleButtonClick}>찾기</button>
      </div>

      <table>
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
          <tr key={index}>
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
        <button>삽입</button>
        <button>삭제</button>
        <button>수정</button>
      </div>
    </main>
  );
}
