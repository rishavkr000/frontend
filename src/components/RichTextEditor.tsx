
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Smile,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here..." }: RichTextEditorProps) => {
  const [selectedText, setSelectedText] = useState('');

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const insertEmoji = (emoji: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(emoji));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = `<img src="${event.target?.result}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
          document.execCommand('insertHTML', false, img);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', tooltip: 'Bold' },
    { icon: Italic, command: 'italic', tooltip: 'Italic' },
    { icon: Strikethrough, command: 'strikeThrough', tooltip: 'Strikethrough' },
    { icon: List, command: 'insertUnorderedList', tooltip: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', tooltip: 'Numbered List' },
    { icon: AlignLeft, command: 'justifyLeft', tooltip: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', tooltip: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', tooltip: 'Align Right' },
  ];

  const emojis = ['😀', '😊', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💡', '✅'];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map(({ icon: Icon, command, tooltip }) => (
          <Button
            key={command}
            variant="ghost"
            size="sm"
            onClick={() => formatText(command)}
            className="h-8 w-8 p-0 hover:bg-gray-200"
            title={tooltip}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}

        <div className="w-px bg-gray-300 mx-1 self-stretch" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) formatText('createLink', url);
          }}
          className="h-8 w-8 p-0 hover:bg-gray-200"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleImageUpload}
          className="h-8 w-8 p-0 hover:bg-gray-200"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>

        <div className="w-px bg-gray-300 mx-1 self-stretch" />

        {/* Emoji Picker */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-200"
            title="Insert Emoji"
            onClick={() => {
              const emojiMenu = document.getElementById('emoji-menu');
              if (emojiMenu) {
                emojiMenu.style.display = emojiMenu.style.display === 'none' ? 'block' : 'none';
              }
            }}
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Emoji Menu */}
      <div
        id="emoji-menu"
        className="absolute z-10 bg-white border border-gray-300 rounded-lg p-2 shadow-lg hidden"
        style={{ display: 'none' }}
      >
        <div className="grid grid-cols-5 gap-1">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                insertEmoji(emoji);
                document.getElementById('emoji-menu')!.style.display = 'none';
              }}
              className="p-1 hover:bg-gray-100 rounded text-lg"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div
        contentEditable
        dir="ltr"
        className="min-h-[200px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        onInput={(e) => onChange((e.currentTarget as HTMLDivElement).innerHTML)}
        onBlur={(e) => onChange((e.currentTarget as HTMLDivElement).innerHTML)}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      >
        {value === '' && (
          <span className="text-gray-400 pointer-events-none select-none">
            {placeholder}
          </span>
        )}
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
