'use client'
import { useState } from "react";

// 这个 Home 函数就是一个 Component (组件)
export default function Home() {
  const [status, setStatus] = useState("Frontend running");

  // 原有的 checkBackend 函数
  async function checkBackend() {
    setStatus("Checking backend...");
    const res = await fetch('/api/health');
    const data = await res.json();
    setStatus(`Backend says: ${data.message}`);
  }

  // 👇 在这里添加新的 uploadFile 函数
  async function uploadFile(e: any) {
    const file = e.target.files[0];
    if (!file) return; // 如果没选文件就退出

    setStatus("Uploading...");
    
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    // 如果上传成功，status 会变成 "Upload successful"
    setStatus(data.message || data.error); 
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 800 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
        AI Summary App
      </h1>

      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'flex-start' }}>
        {/* 之前的测试按钮 */}
        <button
          onClick={checkBackend}
          className="bg-gray-200 text-black px-4 py-2 rounded"
        >
          Check backend
        </button>

        {/* 👇 新增：上传文件的输入框 */}
        <div style={{ marginTop: '20px', border: '1px dashed #ccc', padding: '20px', borderRadius: '8px' }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Step 1: Upload a PDF/Doc</p>
          <input 
            type="file" 
            onChange={uploadFile} 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      <p style={{ marginTop: 24, fontWeight: 'bold', color: '#0070f3' }}>
        Status: {status}
      </p>
    </div>
  );
}