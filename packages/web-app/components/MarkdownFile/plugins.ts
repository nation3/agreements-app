// Must-have plugins
import MarkdownItAbbr from '@linkedmd/markdown-it-abbr'
import MarkdownItDirective from '@linkedmd/markdown-it-directive'
import MarkdownItAttrs from 'markdown-it-attrs'
import MarkdownItCollapsible from 'markdown-it-collapsible'
import MarkdownItDefList from 'markdown-it-deflist'

// Nice-to-have plugins
import MarkdownItAnchor from 'markdown-it-anchor'
import { markdownItFancyListPlugin } from 'markdown-it-fancy-lists'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItTOC from 'markdown-it-toc-done-right'

export default [
  [MarkdownItCollapsible],
  [MarkdownItDefList],
  [MarkdownItAbbr],
  [MarkdownItAttrs],
  [MarkdownItDirective],
  [markdownItFancyListPlugin],
  [MarkdownItFootnote],
  [
    MarkdownItAnchor,
    {
      permalink: MarkdownItAnchor.permalink.linkInsideHeader({
        symbol: '§',
        placement: 'after',
      }),
      level: 2,
    },
  ],
  [MarkdownItTOC, { level: 2 }],
]