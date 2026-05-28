import React, { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { HtmlEmbed } from '../../lib/tiptap-html-embed';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Heading2, Heading3, Heading4, List, ListOrdered, Quote, Undo, Redo, Strikethrough, CodeSquare, X, Upload } from 'lucide-react';
import { convertImageToBase64 } from '@/lib/imageUtils';
import { Button } from './Button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const EditorModal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-neo-cream border-4 border-neo-black p-6 w-full max-w-lg shadow-[8px_8px_0px_#000] rotate-1">
        <div className="flex justify-between items-center mb-6 border-b-4 border-neo-black pb-4">
          <h3 className="font-black text-2xl uppercase tracking-tighter">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-neo-red hover:text-white border-2 border-transparent hover:border-neo-black transition-colors">
            <X size={24} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

const MenuBar = ({ editor, onOpenImageModal, onOpenLinkModal, onOpenEmbedModal }: { editor: any, onOpenImageModal: () => void, onOpenLinkModal: () => void, onOpenEmbedModal: () => void }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b-4 border-neo-black bg-white sticky top-0 z-10">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 border-2 border-neo-black hover:bg-neo-blue hover:text-white transition-colors ${editor.isActive('bold') ? 'bg-neo-black text-white' : 'bg-white'}`}
        title="Gras"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 border-2 border-neo-black hover:bg-neo-blue hover:text-white transition-colors ${editor.isActive('italic') ? 'bg-neo-black text-white' : 'bg-white'}`}
        title="Italique"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 border-2 border-neo-black hover:bg-neo-blue hover:text-white transition-colors ${editor.isActive('strike') ? 'bg-neo-black text-white' : 'bg-white'}`}
        title="Barré"
      >
        <Strikethrough size={18} />
      </button>

      <div className="w-1 h-8 bg-neo-black mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 border-2 border-neo-black hover:bg-neo-blue hover:text-white transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-neo-black text-white' : 'bg-white'}`}
        title="Titre 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 border-2 border-neo-black hover:bg-neo-blue hover:text-white transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-neo-black text-white' : 'bg-white'}`}
        title="Titre 3"
      >
        <Heading3 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`p-2 border-2 border-neo-black hover:bg-neo-blue hover:text-white transition-colors ${editor.isActive('heading', { level: 4 }) ? 'bg-neo-black text-white' : 'bg-white'}`}
        title="Titre 4"
      >
        <Heading4 size={18} />
      </button>

      <div className="w-1 h-8 bg-neo-black mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 border-2 border-neo-black hover:bg-neo-blue hover:text-white transition-colors ${editor.isActive('bulletList') ? 'bg-neo-black text-white' : 'bg-white'}`}
        title="Liste à puces"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 border-2 border-neo-black hover:bg-neo-blue hover:text-white transition-colors ${editor.isActive('orderedList') ? 'bg-neo-black text-white' : 'bg-white'}`}
        title="Liste numérotée"
      >
        <ListOrdered size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 border-2 border-neo-black hover:bg-neo-blue hover:text-white transition-colors ${editor.isActive('blockquote') ? 'bg-neo-black text-white' : 'bg-white'}`}
        title="Citation"
      >
        <Quote size={18} />
      </button>

      <div className="w-1 h-8 bg-neo-black mx-1"></div>

      <button
        type="button"
        onClick={onOpenLinkModal}
        className={`p-2 border-2 border-neo-black hover:bg-neo-blue hover:text-white transition-colors ${editor.isActive('link') ? 'bg-neo-black text-white' : 'bg-white'}`}
        title="Lien"
      >
        <LinkIcon size={18} />
      </button>
      <button
        type="button"
        onClick={onOpenImageModal}
        className="p-2 border-2 border-neo-black bg-white hover:bg-neo-blue hover:text-white transition-colors"
        title="Image"
      >
        <ImageIcon size={18} />
      </button>
      <button
        type="button"
        onClick={onOpenEmbedModal}
        className="p-2 border-2 border-neo-black bg-white hover:bg-neo-blue hover:text-white transition-colors"
        title="HTML Embed"
      >
        <CodeSquare size={18} />
      </button>

      <div className="flex-grow"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 border-2 border-neo-black bg-white hover:bg-neo-blue hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black transition-colors"
        title="Annuler"
      >
        <Undo size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 border-2 border-neo-black bg-white hover:bg-neo-blue hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black transition-colors"
        title="Rétablir"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [modalState, setModalState] = useState<'image' | 'link' | 'embed' | null>(null);
  
  // States for modals
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [embedHtml, setEmbedHtml] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      HtmlEmbed,
      Image.configure({
        HTMLAttributes: {
          class: 'border-4 border-neo-black shadow-neo-md w-full h-auto object-cover my-8',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-neo-red font-bold hover:underline decoration-4',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg sm:prose-xl max-w-none font-medium leading-relaxed min-h-[300px] sm:min-h-[400px] p-4 focus:outline-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-h4:text-xl prose-h4:mt-4 prose-h4:mb-2 prose-p:my-4 prose-strong:font-black prose-strong:text-neo-blue prose-em:italic prose-a:text-neo-red prose-a:font-bold prose-a:underline prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:my-1 prose-blockquote:border-l-4 prose-blockquote:border-neo-black prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-white prose-blockquote:py-1 prose-blockquote:pr-4 prose-blockquote:my-6 bg-neo-cream',
      },
    },
  });

  React.useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertImageToBase64(file);
      if (editor) {
        editor.chain().focus().setImage({ src: base64 }).run();
        setModalState(null);
      }
    } catch (error) {
      console.error("Failed to convert image", error);
      alert("Erreur lors de l'import de l'image");
    }
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setModalState(null);
    }
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (editor) {
      if (linkUrl === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      }
      setLinkUrl('');
      setModalState(null);
    }
  };

  const handleAddEmbed = (e: React.FormEvent) => {
    e.preventDefault();
    if (embedHtml && editor) {
      editor.chain().focus().setHtmlEmbed({ htmlContent: embedHtml }).run();
      setEmbedHtml('');
      setModalState(null);
    }
  };

  const openLinkModal = () => {
    if (editor) {
      const currentUrl = editor.getAttributes('link').href || '';
      setLinkUrl(currentUrl);
      setModalState('link');
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col border-4 border-neo-black bg-neo-cream shadow-[4px_4px_0px_#000] overflow-hidden">
        <MenuBar 
          editor={editor} 
          onOpenImageModal={() => setModalState('image')}
          onOpenLinkModal={openLinkModal}
          onOpenEmbedModal={() => setModalState('embed')}
        />
        <EditorContent editor={editor} className="bg-neo-cream" />
      </div>

      <EditorModal isOpen={modalState === 'image'} onClose={() => setModalState(null)} title="Ajouter une image">
        <div className="flex flex-col gap-6">
          <Button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 h-16 text-xl">
            <Upload size={24} /> IMPORTER DEPUIS LE PC
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t-4 border-neo-black"></div>
            <span className="flex-shrink-0 mx-4 font-black uppercase">OU</span>
            <div className="flex-grow border-t-4 border-neo-black"></div>
          </div>

          <form onSubmit={handleAddImage} className="flex flex-col gap-4">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Colle une URL d'image ici..."
              className="w-full h-14 px-4 bg-white border-4 border-neo-black font-bold focus-visible:bg-neo-blue focus-visible:text-white focus-visible:outline-none transition-colors"
            />
            <Button type="submit" variant="secondary" className="w-full h-12" disabled={!imageUrl}>VALIDER L'URL</Button>
          </form>
        </div>
      </EditorModal>

      <EditorModal isOpen={modalState === 'link'} onClose={() => setModalState(null)} title="Ajouter un lien">
        <form onSubmit={handleAddLink} className="flex flex-col gap-4">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="w-full h-14 px-4 bg-white border-4 border-neo-black font-bold focus-visible:bg-neo-blue focus-visible:text-white focus-visible:outline-none transition-colors"
          />
          <div className="flex gap-4">
            <Button type="button" variant="secondary" onClick={() => { setLinkUrl(''); handleAddLink({ preventDefault: () => {} } as React.FormEvent); }} className="flex-1 h-12 bg-white text-neo-black hover:bg-neo-red hover:text-white">
              SANS LIEN
            </Button>
            <Button type="submit" variant="primary" className="flex-1 h-12" disabled={!linkUrl}>VALIDER</Button>
          </div>
        </form>
      </EditorModal>

      <EditorModal isOpen={modalState === 'embed'} onClose={() => setModalState(null)} title="Intégrer du code (HTML/Embed)">
        <form onSubmit={handleAddEmbed} className="flex flex-col gap-4">
          <textarea
            value={embedHtml}
            onChange={(e) => setEmbedHtml(e.target.value)}
            placeholder="<iframe src='...' ></iframe>"
            className="w-full h-40 p-4 bg-neo-black text-neo-blue font-mono text-sm font-bold border-4 border-neo-black focus-visible:bg-neo-black focus-visible:text-white focus-visible:outline-none transition-colors resize-none"
          />
          <Button type="submit" variant="primary" className="w-full h-12" disabled={!embedHtml}>INTÉGRER</Button>
        </form>
      </EditorModal>
    </div>
  );
};

