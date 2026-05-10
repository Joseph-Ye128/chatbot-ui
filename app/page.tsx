"use client"

import { useState } from "react"

export default function Home() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [input, setInput] = useState("")

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">聊天机器人</h1>

      {/* 消息显示区域 */}
      <div className="flex-1 overflow-y-auto border rounded p-4 mb-4">
        {messages.length === 0 && (
          <p className="text-gray-400">还没有消息，发送一条试试！</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入消息..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          发送
        </button>
      </div>
    </main>
  )

  async function sendMessage() {
    if (!input.trim()) return
    
    // 把用户消息加进去
    const userMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")

    // 调用 FastAPI 后端
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages
        })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "连接后端失败，请检查 API 是否运行。" }])
    }
  }
}