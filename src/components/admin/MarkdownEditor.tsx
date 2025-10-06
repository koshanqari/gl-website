'use client';

import { useState, useRef, useEffect } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollPosRef = useRef<number>(0);
  const cursorPosRef = useRef<number | null>(null);
  const shouldRestoreRef = useRef<boolean>(false);

  // Only restore scroll and cursor position after markdown insertion, not normal typing
  useEffect(() => {
    if (!shouldRestoreRef.current) return;
    
    const textarea = textareaRef.current;
    if (textarea && !showPreview && cursorPosRef.current !== null) {
      textarea.scrollTop = scrollPosRef.current;
      textarea.setSelectionRange(cursorPosRef.current, cursorPosRef.current);
      cursorPosRef.current = null;
      shouldRestoreRef.current = false;
    }
  }, [value, showPreview]);

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // First, switch to edit mode if in preview
    if (showPreview) {
      setShowPreview(false);
      setTimeout(() => {
        performInsert(before, after, placeholder);
      }, 50);
    } else {
      performInsert(before, after, placeholder);
    }
  };

  const performInsert = (before: string, after: string, placeholder: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Save current state
    scrollPosRef.current = textarea.scrollTop;
    
    const selectedText = value.substring(start, end) || placeholder;
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    // Calculate new cursor position
    cursorPosRef.current = start + before.length + selectedText.length;
    
    // Flag that we should restore position after render
    shouldRestoreRef.current = true;
    
    // Update value
    onChange(newText);
  };

  const formatButtons = [
    { label: 'H1', action: () => insertMarkdown('# ', '', 'Heading 1'), title: 'Heading 1' },
    { label: 'H2', action: () => insertMarkdown('## ', '', 'Heading 2'), title: 'Heading 2' },
    { label: 'H3', action: () => insertMarkdown('### ', '', 'Heading 3'), title: 'Heading 3' },
    { label: 'Bold', action: () => insertMarkdown('**', '**', 'bold text'), title: 'Bold' },
    { label: 'Italic', action: () => insertMarkdown('*', '*', 'italic text'), title: 'Italic' },
    { label: 'Golden Highlight', action: () => insertMarkdown('<span class="txt-clr-black font-semibold">', '</span>', 'highlighted text'), title: 'Golden Highlight', highlight: true },
    { label: 'List', action: () => insertMarkdown('- ', '', 'list item'), title: 'Bullet List' },
    { label: 'Numbered', action: () => insertMarkdown('1. ', '', 'numbered item'), title: 'Numbered List' },
    { label: 'Quote', action: () => insertMarkdown('> ', '', 'quote text'), title: 'Quote' },
    { label: 'Link', action: () => insertMarkdown('[', '](url)', 'link text'), title: 'Link' },
    { label: 'Code', action: () => insertMarkdown('`', '`', 'code'), title: 'Inline Code' },
    { label: 'Code Block', action: () => insertMarkdown('```\n', '\n```', 'code block'), title: 'Code Block' },
  ];

  // Simple markdown to HTML preview (basic conversion)
  const renderPreview = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<span class="txt-clr-black font-semibold">(.*?)<\/span>/g, '<span class="txt-clr-black font-semibold">$1</span>') // Keep HTML spans
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-2">$1</blockquote>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div>
      {/* Edit/Preview Toggle - Top Right */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-body-small txt-clr-neutral">
          {showPreview ? 'Previewing your content' : 'Editing content - Use toolbar for formatting'}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowPreview(false);
            }}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              !showPreview 
                ? 'bg-primary text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowPreview(true);
            }}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              showPreview 
                ? 'bg-primary text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Toolbar - Only show in edit mode */}
      {!showPreview && (
      <div className="border border-gray-300 rounded-t bg-gray-50 p-2 flex flex-wrap gap-2">
        {formatButtons.map((btn, index) => (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              btn.action();
            }}
            title={btn.title}
            className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              (btn as any).highlight 
                ? 'bg-primary text-white border-primary hover:bg-primary-dark' 
                : 'bg-white border-gray-300'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      )}

      {/* Editor / Preview */}
      {showPreview ? (
        <div 
          className="border border-gray-300 rounded p-4 min-h-[400px] bg-white prose max-w-none"
          dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${renderPreview(value)}</p>` }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={15}
          className="w-full px-4 py-3 border border-t-0 border-gray-300 rounded-b focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
          style={{ minHeight: '400px' }}
        />
      )}

      {/* Help Text - Only in edit mode */}
      {!showPreview && (
        <div className="mt-2 text-body-small txt-clr-neutral">
          <p>💡 Tip: Select text first, then click a format button to wrap it. Or click to insert at cursor position.</p>
        </div>
      )}
    </div>
  );
}

