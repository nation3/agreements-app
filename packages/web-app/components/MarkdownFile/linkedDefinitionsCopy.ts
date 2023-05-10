import type MarkdownIt from "markdown-it";
import type StateCore from "markdown-it/lib/rules_core/state_core";

type Definitions = Record<string, string[]>;

export default function linked_definitions2(md: MarkdownIt): void {
  const definitions: Definitions = {};
  const slugs: { [key: string]: boolean } = {};

  const slugify = (s: string): string =>
    encodeURIComponent(
      String(s).trim().toLowerCase().replace(/\s+/g, "-")
    );

  function linkReferences(state: any) {
    for (let i = 0, len = state.tokens.length; i < len; i++) {
      const token = state.tokens[i];

      if (token.type === "inline") {
        const nodes: any[] = [];

        for (let j = 0, childrenLen = token.children.length; j < childrenLen; j++) {
          const childToken = token.children[j];

          if (childToken.type === "text") {
            const dtText = childToken.content;

            if (definitions[dtText] && definitions[dtText].length > 0) {
              const aOpen = new state.Token("a_open", "a", 1);
              aOpen.attrSet("href", `#${slugify(dtText)}`);
              nodes.push(aOpen);

              const abbr = new state.Token("abbr", "", 0);
              abbr.content = dtText;
              abbr.attrs = [["title", definitions[dtText][0]]];
              nodes.push(abbr);

              const aClose = new state.Token("a_close", "a", -1);
              nodes.push(aClose);
            } else {
              nodes.push(childToken);
            }
          } else {
            nodes.push(childToken);
          }
        }

        token.children = nodes;
      }
    }
  }

  function processDefinitionList(state: StateCore): void {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === "dl_open") {
        const dtIndices: number[] = [];
        const ddIndices: number[] = [];
        let dtText: string;

        for (let j = i + 1; j < tokens.length; j++) {
          const childToken = tokens[j];

          if (childToken.type === "dt_open") {
            dtIndices.push(j);
          } else if (childToken.type === "dd_open") {
            ddIndices.push(j);
          } else if (childToken.type === "dl_close") {
            break;
          }
        }

        for (let k = 0; k < dtIndices.length; k++) {
          const dtIndex = dtIndices[k];
          const ddIndex = ddIndices[k];

          if (tokens[dtIndex + 1].type === "inline") {
            dtText = tokens[dtIndex + 1].content;
          }

          if (tokens[ddIndex + 1].type === "inline") {
            const definition = tokens[ddIndex + 1].content;
            const slug = slugify(dtText);

            if (!definitions[dtText]) {
              definitions[dtText] = [];
              slugs[slug] = true;
            } else if (!slugs[slug]) {
              // Generate a new slug if the current one is already taken
              let newSlug = slug;
              let counter = 2;

              while (slugs[newSlug]) {
                newSlug = `${slug}-${counter}`;
                counter++;
              }

              slugs[newSlug] = true;
            }

            definitions[dtText].push(definition);
            tokens[dtIndex + 1].attrSet("id", slug);
            }
            }
            }
            }
            }
            
            md.core.ruler.push("linked_definitions_process_definition_list", processDefinitionList);
            md.core.ruler.push("linked_definitions_link_references", linkReferences);
            }
