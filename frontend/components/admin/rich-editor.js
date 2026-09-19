'use client';
import { useState } from 'react';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2, Unlink, ImagePlus, Undo2, Redo2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageField } from './image-field';
import { toast } from 'sonner';

export const RichEditor = ({ value, onChange, adminKey, id, onBusy }) => {
  const [panel, setPanel] = useState('');
  const [url, setUrl] = useState('');
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }), Image.configure({ allowBase64: false })],
    immediatelyRender: false, content: value || '',
    editorProps: { attributes: { class: 'cms-prose min-h-[260px] p-5 outline-none', 'data-testid': `${id}-body`, 'aria-label': 'Article content', role: 'textbox', 'aria-multiline': 'true' } },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });
  useEditorState({ editor, selector: ({ editor: e }) => e ? { bold: e.isActive('bold'), italic: e.isActive('italic'), h2: e.isActive('heading', { level: 2 }), h3: e.isActive('heading', { level: 3 }), bullet: e.isActive('bulletList'), ordered: e.isActive('orderedList'), link: e.isActive('link') } : null });
  if (!editor) return <p data-testid={`${id}-editor-loading`}>Loading editor…</p>;
  const tools = [
    ['bold', 'Bold', Bold, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold')],
    ['italic', 'Italic', Italic, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic')],
    ['h2', 'Heading 2', Heading2, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 })],
    ['h3', 'Heading 3', Heading3, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 })],
    ['bullet-list', 'Bullet list', List, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList')],
    ['ordered-list', 'Numbered list', ListOrdered, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList')],
    ['link', 'Add or edit link', Link2, () => { setUrl(editor.getAttributes('link').href || ''); setPanel('link'); }, editor.isActive('link')],
    ['unlink', 'Remove link', Unlink, () => editor.chain().focus().unsetLink().run()],
    ['image', 'Insert image', ImagePlus, () => { setUrl(''); setPanel('image'); }],
    ['undo', 'Undo', Undo2, () => editor.chain().focus().undo().run()],
    ['redo', 'Redo', Redo2, () => editor.chain().focus().redo().run()],
  ];
  function insert() {
    if (panel === 'link' && !/^(https?:\/\/|mailto:)/i.test(url)) return toast.error('Use an https:// or mailto: link');
    if (panel === 'image' && !/^(https?:\/\/|\/api\/media\/)/i.test(url)) return toast.error('Choose an uploaded image or an https:// image URL');
    if (panel === 'link') editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    else editor.chain().focus().setImage({ src: url, alt: '' }).run();
    setPanel(''); setUrl('');
  }
  return <div className="min-w-0 overflow-hidden rounded-lg border border-border">
    <div className="flex flex-wrap gap-1 border-b border-border bg-muted/30 p-2" role="toolbar" aria-label="Text formatting">
      {tools.map(([key, label, Icon, action, active]) => <Button key={key} type="button" size="icon" variant={active ? 'secondary' : 'ghost'} title={label} aria-label={label} aria-pressed={!!active} data-testid={`${id}-${key}`} onClick={action}><Icon className="h-4 w-4" /></Button>)}
    </div>
    {panel && <div className="space-y-3 border-b border-border p-3" data-testid={`${id}-insert-panel`}>
      {panel === 'image' ? <ImageField id={`${id}-inline-image`} label="Inline image" value={url} onChange={setUrl} adminKey={adminKey} onBusy={onBusy} /> : <Input aria-label="Link URL" data-testid={`${id}-link-url`} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />}
      <div className="flex gap-2"><Button type="button" size="sm" data-testid={`${id}-insert-confirm`} onClick={insert} disabled={!url}><Check className="mr-1 h-4 w-4" />Insert</Button><Button type="button" variant="ghost" size="sm" data-testid={`${id}-insert-cancel`} onClick={() => setPanel('')}><X className="mr-1 h-4 w-4" />Cancel</Button></div>
    </div>}
    <EditorContent editor={editor} />
  </div>;
};