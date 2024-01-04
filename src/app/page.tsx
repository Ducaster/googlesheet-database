'use client'
import React, { useState } from 'react';
import styles from './page.module.css'

export default function Home() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = async () => {
    const response = await fetch(`/api/googlesheet?query=${inputValue}`);
    const data = await response.json();
    console.log(data);
  };
  
  return (
    <main className={styles.main}>
      <div>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button onClick={handleButtonClick}>찾기</button>
      </div>

      <table>
        <tr>
          <td>Text 1</td>
          <td>Text 2</td>
          <td>Text 3</td>
          <td>Text 4</td>
          <td>Text 5</td>
          <td>Text 6</td>
        </tr>
      </table>

      <div>
        <button>삽입</button>
        <button>삭제</button>
        <button>수정</button>
      </div>
    </main>
  );
}