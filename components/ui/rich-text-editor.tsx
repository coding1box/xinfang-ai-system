"use client"

import React from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="bg-white rounded border border-gray-200">
      {/* 模拟工具栏 */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-1 border-b border-gray-100 bg-gray-50">
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm font-bold" title="加粗 (Ctrl+B)"><b>B</b></button>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm italic" title="斜体 (Ctrl+I)"><i>I</i></button>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm underline" title="下划线 (Ctrl+U)"><u>U</u></button>
        <span className="mx-1 border-l h-4 border-gray-200"></span>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="标题1">H1</button>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="标题2">H2</button>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="引用">❝</button>
        <span className="mx-1 border-l h-4 border-gray-200"></span>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="无序列表">•</button>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="有序列表">1.</button>
        <span className="mx-1 border-l h-4 border-gray-200"></span>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="左对齐">⯇</button>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="居中对齐">≡</button>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="右对齐">⯈</button>
        <span className="mx-1 border-l h-4 border-gray-200"></span>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="撤销">↺</button>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="重做">↻</button>
        <span className="mx-1 border-l h-4 border-gray-200"></span>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="插入链接">🔗</button>
        <button className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm" title="插入图片">🖼️</button>
      </div>
      {/* 模拟内容区 */}
      <textarea
        className="w-full min-h-[120px] p-3 border-0 outline-none resize-none text-base bg-white"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "请输入内容..."}
      />
    </div>
  )
} 