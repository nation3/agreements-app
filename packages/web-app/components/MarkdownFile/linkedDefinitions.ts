/**
 * markdown-it-linked-definitions plugin
 *
 * Parses definition lists in Markdown and
 * links any reference to defined terms to
 * their corresponding definitions.
 *
 * Adapted from
 * markdown-it-deflist (https://github.com/markdown-it/markdown-it-deflist)
 * markdown-it-abbr (https://github.com/markdown-it/markdown-it-abbr)
 */

import type MarkdownIt from "markdown-it"
import type StateBlock from "markdown-it/lib/rules_block/state_block"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import type Token from "markdown-it/lib/token"

type Definitions = Record<string, string[]>

export default function linked_definitions(md: MarkdownIt): void {
    // Utility functions and constants

  // Check if a character is a space
  const isSpace = md.utils.isSpace
  // Escape regular expressions
  const escapeRE = md.utils.escapeRE
  // Replace an array element at a specific index
  const arrayReplaceAt = md.utils.arrayReplaceAt
  // Define other special characters
  const OTHER_CHARS = " \r\n$+<=>^`|~"

  // Get the regular expressions for Unicode punctuation and spaces
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const UNICODE_PUNCT_RE: string = md.utils.lib.ucmicro.P.source
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const UNICODE_SPACE_RE: string = md.utils.lib.ucmicro.Z.source

  // Store the parsed definitions
  const definitions: Definitions = {}
  // Keep track of slugs to ensure uniqueness
  const slugs: { [key: string]: boolean } = {}

  // Helper function to generate unique slugs for definitions
  const slugify = (s: string): string =>
    encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-"))

  function uniqueSlug(
    slug: string,
    slugs: { [key: string]: boolean },
    failOnNonUnique: boolean,
    startIndex: number
  ): string {
    let uniq = slug
    let i = startIndex

    if (failOnNonUnique && Object.hasOwnProperty.call(slugs, slug)) {
      throw new Error(
        `User defined \`id\` attribute \`${slug}\` is not unique. Please fix it in your Markdown to continue.`
      )
    } else {
      while (Object.hasOwnProperty.call(slugs, uniq)) {
        uniq = `${slug}-${i}`
        i += 1
      }
    }

    slugs[uniq] = true

    return uniq
  }

  // Search `[:~][\n ]`, returns next pos after marker on success
  // or -1 on fail.
  function skipMarker(state: StateBlock, line: number): number {
    let start = state.bMarks[line] + state.tShift[line]
    const max = state.eMarks[line]

    if (start >= max) {
      return -1
    }

    // Check bullet
    const marker = state.src.charCodeAt(start++)
    if (marker !== 0x7e /* ~ */ && marker !== 0x3a /* : */) {
      return -1
    }

    const pos = state.skipSpaces(start)

    // require space after ":"
    if (start === pos) {
      return -1
    }

    // no empty definitions, e.g. "  : "
    if (pos >= max) {
      return -1
    }

    return start
  }

  function markTightParagraphs(state: StateBlock, idx: number): void {
    const level = state.level + 2

    for (let i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
      if (
        state.tokens[i].level === level &&
        state.tokens[i].type === "paragraph_open"
      ) {
        state.tokens[i + 2].hidden = true
        state.tokens[i].hidden = true
        i += 2
      }
    }
  }

  function parseDefinitions(
    state: StateBlock,
    startLine: number,
    endLine: number,
    silent: boolean
  ): boolean {
    let ch: number
    let contentStart: number
    let ddLine: number
    let dtLine: number
    let ddContent: string
    let dtContent: string
    let itemLines: [number, number]
    let listLines: [number, number]
    let max: number
    let nextLine: number
    let offset: number
    let oldDDIndent: number
    let oldIndent: number
    let oldParentType: StateBlock.ParentType
    let oldSCount: number
    let oldTShift: number
    let oldTight: boolean
    let pos: number
    let prevEmptyEnd: boolean
    let tight: boolean
    let token: Token

    if (silent) {
      // quirk: validation mode validates a dd block only, not a whole deflist
      if (state.ddIndent < 0) {
        return false
      }
      return skipMarker(state, startLine) >= 0
    }

    nextLine = startLine + 1
    if (nextLine >= endLine) {
      return false
    }

    if (state.isEmpty(nextLine)) {
      nextLine++
      if (nextLine >= endLine) {
        return false
      }
    }

    if (state.sCount[nextLine] < state.blkIndent) {
      return false
    }
    contentStart = skipMarker(state, nextLine)
    if (contentStart < 0) {
      return false
    }

    // Start list
    const listTokIdx = state.tokens.length
    tight = true

    token = state.push("dl_open", "dl", 1)
    token.map = listLines = [startLine, 0]

    //
    // Iterate list items
    //

    dtLine = startLine
    ddLine = nextLine

    // One definition list can contain multiple DTs,
    // and one DT can be followed by multiple DDs.
    //
    // Thus, there is two loops here, and label is
    // needed to break out of the second one
    //
    /*eslint no-labels:0,block-scoped-var:0*/
    OUTER: for (;;) {
      prevEmptyEnd = false

      dtContent = state.getLines(dtLine, dtLine + 1, state.blkIndent, false).trim()
      const slug = uniqueSlug(slugify(dtContent), slugs, false, 1)

      token = state.push("dt_open", "dt", 1)
      token.attrSet("id", slug)
      token.map = [dtLine, dtLine]

      token = state.push("inline", "", 0)
      token.map = [dtLine, dtLine]
      token.content = dtContent
      token.children = []

      token = state.push("dt_close", "dt", -1)

      for (;;) {
        token = state.push("dd_open", "dd", 1)
        token.map = itemLines = [nextLine, 0]

        pos = contentStart
        max = state.eMarks[ddLine]
        offset =
          state.sCount[ddLine] +
          contentStart -
          (state.bMarks[ddLine] + state.tShift[ddLine])

        while (pos < max) {
          ch = state.src.charCodeAt(pos)

          if (isSpace(ch)) {
            if (ch === 0x09) {
              offset += 4 - (offset % 4)
            } else {
              offset++
            }
          } else {
            break
          }

          pos++
        }

        contentStart = pos

        oldTight = state.tight
        oldDDIndent = state.ddIndent
        oldIndent = state.blkIndent
        oldTShift = state.tShift[ddLine]
        oldSCount = state.sCount[ddLine]
        oldParentType = state.parentType
        state.blkIndent = state.ddIndent = state.sCount[ddLine] + 2
        state.tShift[ddLine] = contentStart - state.bMarks[ddLine]
        state.sCount[ddLine] = offset
        state.tight = true
        // @ts-ignore
        state.parentType = "deflist"

        // state.md.block.tokenize(state, ddLine, endLine, true);
        state.md.block.tokenize(state, ddLine, endLine)

        // If any of list item is tight, mark list as tight
        if (!state.tight || prevEmptyEnd) {
          tight = false
        }
        // Item become loose if finish with empty line,
        // but we should filter last element, because it means list finish
        prevEmptyEnd = state.line - ddLine > 1 && state.isEmpty(state.line - 1)

        state.tShift[ddLine] = oldTShift
        state.sCount[ddLine] = oldSCount
        state.tight = oldTight
        state.parentType = oldParentType
        state.blkIndent = oldIndent
        state.ddIndent = oldDDIndent

        ddContent = state.tokens[state.tokens.length - 2].content
        if (!definitions[dtContent]) {
          definitions[dtContent] = []
        }
        definitions[dtContent].push(ddContent)

        token = state.push("dd_close", "dd", -1)

        itemLines[1] = nextLine = state.line

        if (nextLine >= endLine) {
          break OUTER
        }

        if (state.sCount[nextLine] < state.blkIndent) {
          break OUTER
        }
        contentStart = skipMarker(state, nextLine)
        if (contentStart < 0) {
          break
        }

        ddLine = nextLine

        // go to the next loop iteration:
        // insert DD tag and repeat checking
      }

      if (nextLine >= endLine) {
        break
      }
      dtLine = nextLine

      if (state.isEmpty(dtLine)) {
        break
      }
      if (state.sCount[dtLine] < state.blkIndent) {
        break
      }

      ddLine = dtLine + 1
      if (ddLine >= endLine) {
        break
      }
      if (state.isEmpty(ddLine)) {
        ddLine++
      }
      if (ddLine >= endLine) {
        break
      }

      if (state.sCount[ddLine] < state.blkIndent) {
        break
      }
      contentStart = skipMarker(state, ddLine)
      if (contentStart < 0) {
        break
      }

      // go to the next loop iteration:
      // insert DT and DD tags and repeat checking
    }

    // Finilize list
    token = state.push("dl_close", "dl", -1)

    listLines[1] = nextLine

    state.line = nextLine

    // mark paragraphs tight if needed
    if (tight) {
      markTightParagraphs(state, listTokIdx)
    }

    return true
  }

  function linkReferences(state: StateCore): void {
    let i: number,
      j: number,
      l: number,
      pos: number,
      m: RegExpExecArray,
      text: string,
      nodes: Token[],
      token: Token,
      currentToken: Token
    let tokens: Token[]
    const blockTokens: Token[] = state.tokens

    if (!definitions) {
      return
    }

    const regSimple = new RegExp(
      "(?:" +
        Object.keys(definitions)
          .sort(function (a, b) {
            return b.length - a.length
          })
          .map(escapeRE)
          .join("|") +
        ")"
    )

    const regText =
      "(^|" +
      UNICODE_PUNCT_RE +
      "|" +
      UNICODE_SPACE_RE +
      "|[" +
      OTHER_CHARS.split("").map(escapeRE).join("") +
      "])" +
      "(" +
      Object.keys(definitions)
        .sort(function (a, b) {
          return b.length - a.length
        })
        .map(escapeRE)
        .join("|") +
      ")" +
      "($|" +
      UNICODE_PUNCT_RE +
      "|" +
      UNICODE_SPACE_RE +
      "|[" +
      OTHER_CHARS.split("").map(escapeRE).join("") +
      "])"

    const reg = new RegExp(regText, "g")

    for (j = 0, l = blockTokens.length; j < l; j++) {
      if (blockTokens[j].type !== "inline") {
        continue
      }
      tokens = blockTokens[j].children || []

      // We scan from the end, to keep position when new tags added.
      for (i = tokens.length - 1; i >= 0; i--) {
        currentToken = tokens[i]
        if (currentToken.type !== "text") {
          continue
        }

        pos = 0
        text = currentToken.content
        reg.lastIndex = 0
        nodes = []

        // fast regexp run to determine whether there are any abbreviated words
        // in the current token
        if (!regSimple.test(text)) {
          continue
        }

        while ((m = reg.exec(text) as RegExpExecArray)) {
          if (m.index > 0 || m[1].length > 0) {
            token = new state.Token("text", "", 0)
            token.content = text.slice(pos, m.index + m[1].length)
            nodes.push(token)
          }

          // Create link to the definition
          token = new state.Token("a_open", "a", 1)
          token.attrs = [["href", "#" + slugify(m[2])]]
          nodes.push(token)

          token = new state.Token("abbr_open", "abbr", 1)
          token.attrs = [["title", definitions[m[2]][0]]]
          nodes.push(token)

          token = new state.Token("text", "", 0)
          token.content = m[2]
          nodes.push(token)

          token = new state.Token("abbr_close", "abbr", -1)
          nodes.push(token)

          token = new state.Token("a_close", "a", -1)
          nodes.push(token)

          reg.lastIndex -= m[3].length
          pos = reg.lastIndex
        }

        if (!nodes.length) {
          continue
        }

        if (pos < text.length) {
          token = new state.Token("text", "", 0)
          token.content = text.slice(pos)
          nodes.push(token)
        }

        // replace current node
        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes)
      }
    }
  }

  md.block.ruler.before("paragraph", "linked-definitions", parseDefinitions, {
    alt: ["paragraph", "reference", "blockquote"]
  })
  md.core.ruler.after("linkify", "linked-references", linkReferences)
}