import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import parse from 'html-react-parser';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    htmlEmbed: {
      setHtmlEmbed: (options: { htmlContent: string }) => ReturnType;
    }
  }
}

const HtmlEmbedComponent = ({ node, updateAttributes }: any) => {
  return (
    <NodeViewWrapper className="html-embed-wrapper my-8 relative group border-4 border-dashed border-neo-black p-2 bg-white">
      <div className="absolute -top-3 -left-3 bg-neo-yellow px-2 font-bold text-xs border-2 border-neo-black hidden group-hover:block z-10 w-auto">HTML EMBED (EDITABLE)</div>
      <div className="embed-content relative z-0 min-h-[50px]">
        {node.attrs.htmlContent ? parse(node.attrs.htmlContent) : <div className="text-gray-400 italic p-4 text-center">Empty HTML Embed</div>}
      </div>
    </NodeViewWrapper>
  );
};

export const HtmlEmbed = Node.create({
  name: 'htmlEmbed',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      htmlContent: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-embed-code]',
        getAttrs: node => ({
          htmlContent: typeof node === 'string' ? '' : decodeURIComponent((node as HTMLElement).getAttribute('data-html-content') || ''),
        }),
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // When returning HTML (e.g. for getHTML()), we wrap the raw html so we can parse it back
    return ['div', { 'data-embed-code': true, 'data-html-content': encodeURIComponent(HTMLAttributes.htmlContent || '') }, HTMLAttributes.htmlContent]
  },

  addNodeView() {
    return ReactNodeViewRenderer(HtmlEmbedComponent);
  },

  addCommands() {
    return {
      setHtmlEmbed: (options: { htmlContent: string }) => ({ tr, dispatch }) => {
        const { selection } = tr;
        const node = this.type.create(options);

        if (dispatch) {
          tr.replaceRangeWith(selection.from, selection.to, node);
        }

        return true;
      },
    };
  },
});
