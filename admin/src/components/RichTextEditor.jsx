import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo } from 'lucide-react'

function ToolbarButton({ onClick, active, disabled, children, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`rounded p-1.5 hover:bg-paper disabled:opacity-30 ${active ? 'bg-gold/20 text-gold-dark' : 'text-ink-soft'}`}
    >
      {children}
    </button>
  )
}

/**
 * Blog `content` is stored as sanitized HTML (see the Blog model). Tiptap's
 * own output is already well-formed HTML, so no separate sanitization step
 * is needed here — the server is the boundary that would enforce that on
 * any other write path.
 */
export function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  return (
    <div className="rounded-lg border border-line bg-cream">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line p-1.5">
        <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          label="Heading"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={15} />
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-line" />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo size={15} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="rich-text-editor px-4 py-3 [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:outline-none" />
    </div>
  )
}
