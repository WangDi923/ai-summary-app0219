'use client'
import { useState } from "react";

export default function Home() {

  // ===============================
  // 状态
  // ===============================
  const [status, setStatus] = useState("Frontend running");
  const [uploaded, setUploaded] = useState(false);

  // ===============================
  // 检查 backend
  // ===============================
  async function checkBackend() {
    try {
      setStatus("Checking backend...");

      const res = await fetch('/api/health');
      const data = await res.json();

      setStatus(`Backend says: ${data.message}`);
    } catch (err) {
      setStatus("Backend connection failed");
    }
  }

  // ===============================
  // 上传文件
  // ===============================
  async function uploadFile(e: any) {

    const file = e.target.files[0];
    if (!file) return;

    try {
      setStatus("Uploading file...");

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.message) {
        setUploaded(true);
      }

      setStatus(data.message || data.error);

    } catch (err) {
      setStatus("Upload failed");
    }
  }

  // ===============================
  // ⭐ DeepSeek 总结上传的文档
  // ===============================
  async function summarize() {

    if (!uploaded) {
      setStatus("Please upload a document first.");
      return;
    }

    try {
      setStatus("DeepSeek AI is reading your document...");

      const res = await fetch('/api/summarize', {
        method: 'POST'
      });

      const data = await res.json();

      if (data.summary) {
        setStatus(data.summary);
      } else {
        setStatus(data.error || "AI returned empty result");
      }

    } catch (err) {
      setStatus("AI request failed");
    }
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div style={{
      fontFamily: "system-ui",
      padding: 24,
      maxWidth: 800,
      margin: "0 auto"
    }}>

      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold'
      }}>
        AI Summary App (DeepSeek)
      </h1>

      {/* 按钮区 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '20px'
      }}>

        <button
          onClick={checkBackend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Check backend
        </button>

        <button
          onClick={summarize}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Summarize Uploaded Document
        </button>

      </div>

      {/* 上传区域 */}
      <div style={{
        marginTop: '20px',
        border: '1px dashed #ccc',
        padding: '15px',
        borderRadius: '8px'
      }}>
        <p style={{ fontWeight: "bold", marginBottom: 8 }}>
          Upload PDF / Doc
        </p>

        <input
          type="file"
          onChange={uploadFile}
        />
      </div>

      {/* 状态显示 */}
      <div style={{
        marginTop: 24,
        padding: '15px',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
        whiteSpace: 'pre-wrap'
      }}>
        <p style={{ fontWeight: 'bold' }}>
          Status / AI Result:
        </p>

        <p>{status}</p>
      </div>

    </div>
  );
}
