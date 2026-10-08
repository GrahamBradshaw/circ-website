// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Heading1, 
  Heading2, 
  Heading3,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon
} from "lucide-react"
import { useCallback } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children 
}: { 
  onClick: () => void, 
  isActive?: boolean, 
  disabled?: boolean, 
  children: React.ReactNode 
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 rounded-lg transition-all ${
      isActive 
        ? "bg-primary text-white shadow-sm" 
        : "text-muted hover:bg-surface-2 hover:text-main"
    } disabled:opacity-30`}
  >
    {children}
  </button>
)

// This function RichTextEditor handles the main work in this file and explains what this logic is doing in simple English.
export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary text-sm underline decoration-2 underline-offset-4 font-semibold"
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl border border-border shadow-sm max-w-full h-auto my-6"
        }
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none min-h-[250px] p-6 focus:outline-none font-body text-sm leading-relaxed text-main"
      }
    }
  })

  const sanitizeUrl = (rawUrl: string) => {
    const value = rawUrl.trim()
    if (!value) return ""

    try {
      const url = new URL(value)
      if (["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) {
        return url.toString()
      }
      return ""
    } catch {
      if (/^(mailto:|tel:)/i.test(value)) return value
      return ""
    }
  }

  const setLink = useCallback(() => {
    if (!editor) return null
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    const safeUrl = sanitizeUrl(url)
    if (!safeUrl) {
      window.alert("Only http, https, mailto, and tel links are allowed.")
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: safeUrl }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return null
    const rawUrl = window.prompt("Image URL")
    if (!rawUrl) return

    const safeUrl = sanitizeUrl(rawUrl)
    if (!safeUrl) {
      window.alert("Only http and https image URLs are allowed.")
      return
    }

    editor.chain().focus().setImage({ src: safeUrl }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="w-full bg-surface border border-border rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-surface-2 border-b border-border">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="w-4 h-4" />
        </MenuButton>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <MenuButton onClick={setLink} isActive={editor.isActive("link")}>
          <LinkIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={addImage}>
          <ImageIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")}>
          <Quote className="w-4 h-4" />
        </MenuButton>
        <div className="flex-1" />
        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* Editor Surface */}
      <EditorContent editor={editor} />
      
      {/* Footer Info */}
      <div className="px-4 py-2 bg-surface-2 border-t border-border flex items-center justify-between">
        <span className="font-body text-[10px] text-muted uppercase tracking-widest">
          Tip: Use Markdown shortcuts (e.g. # for H1)
        </span>
        <span className="font-body text-[10px] text-muted uppercase tracking-widest">
          Rich text editor
        </span>
      </div>
    </div>
  )
}
