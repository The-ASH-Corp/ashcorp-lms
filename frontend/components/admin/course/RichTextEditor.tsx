'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import UnderlineExtension from '@tiptap/extension-underline';
import type { ReactNode } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Redo,
  Undo,
  Strikethrough,
  Minus,
} from 'lucide-react';


interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: ReactNode;
  title: string;
}

function ToolbarButton({
  onClick,
  isActive,
  icon,
  title,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'text-gray-600'
      }`}
    >
      {icon}
    </button>
  );
}

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  className = '',
  minHeight = 'min-h-96',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-violet-600 underline cursor-pointer hover:text-violet-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
    ],
    shouldRerenderOnTransaction: true,
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none text-gray-900 placeholder-gray-400',
        'aria-label': placeholder,
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const addImage = () => {
    const url = prompt('Enter the image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm ${className}`}
    >
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-3 flex flex-wrap gap-1 items-center overflow-x-auto">
        {/* Undo/Redo */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={<Undo size={18} />}
            title="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={<Redo size={18} />}
            title="Redo"
          />
        </div>

        {/* Headings */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            icon={<Heading1 size={18} />}
            title="Heading 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            icon={<Heading2 size={18} />}
            title="Heading 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            icon={<Heading3 size={18} />}
            title="Heading 3"
          />
        </div>

        {/* Text Formatting */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={<Bold size={18} />}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={<Italic size={18} />}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon={<Underline size={18} />}
            title="Underline"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            icon={<Strikethrough size={18} />}
            title="Strikethrough"
          />
        </div>

        {/* Lists */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={<List size={18} />}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={<ListOrdered size={18} />}
            title="Numbered List"
          />
        </div>

        {/* Alignment */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            icon={<AlignLeft size={18} />}
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            icon={<AlignCenter size={18} />}
            title="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            icon={<AlignRight size={18} />}
            title="Align Right"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            icon={<AlignJustify size={18} />}
            title="Justify"
          />
        </div>

        {/* Blocks */}
        <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            icon={<Quote size={18} />}
            title="Blockquote"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            icon={<Code size={18} />}
            title="Code Block"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={<Minus size={18} />}
            title="Horizontal Rule"
          />
        </div>

        {/* Links and Media */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={addLink}
            isActive={editor.isActive('link')}
            icon={<LinkIcon size={18} />}
            title="Add Link"
          />
          <ToolbarButton
            onClick={addImage}
            icon={<ImageIcon size={18} />}
            title="Add Image"
          />
        </div>
      </div>

      {/* Editor */}
      <div className={`p-4 ${minHeight}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
