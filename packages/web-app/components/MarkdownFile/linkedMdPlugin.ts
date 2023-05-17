import { LinkedMarkdown } from '@linkedmd/parser';
import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';
import tippy, { inlinePositioning } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const IPFS_GATEWAY = 'https://cf-ipfs.com/ipfs';

interface FetchAndParseResult {
  file: string;
  parser: LinkedMarkdown;
}

const fetchAndParse = async (fileURI: string): Promise<FetchAndParseResult> => {
  const ipfsURI = fileURI.startsWith('ipfs://')
    ? `${IPFS_GATEWAY}/${fileURI.split('ipfs://')[1]}`
    : false;
  const data = await fetch(ipfsURI ? ipfsURI : fileURI);
  const file = await data.text();
  const parser = new LinkedMarkdown(file);
  await parser.parse();
  return { file, parser };
};

const loadTooltips = () => {
  tippy('abbr[title]', {
    content: (ref) => ref.getAttribute('title') as string,
    placement: 'bottom',
    inlinePositioning: true,
    plugins: [inlinePositioning],
  });
};

function linkedMarkdownPlugin(md: MarkdownIt, options: any): void {
  const defaultRender = md.renderer.rules.link_open || function (tokens: Token[], idx: number, options: any, env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = function (tokens: Token[], idx: number, options: any, env: any, self: any) {
    const hrefToken = tokens[idx].attrGet('href');
    if (hrefToken && hrefToken.startsWith('ipfs://')) {
      fetchAndParse(hrefToken).then(({ parser }) => {
        const output = parser.toHTML() || '';
        env.linkedMarkdownOutput = output;
        setTimeout(loadTooltips, 500);
      });
      return '';
    } else {
      return defaultRender(tokens, idx, options, env, self);
    }
  };
  

  md.renderer.rules.link_close = function (tokens: Token[], idx: number, options: any, env: any, self: any) {
    if (env.linkedMarkdownOutput) {
      const output = env.linkedMarkdownOutput;
      env.linkedMarkdownOutput = null;
      return output;
    } else {
      return self.renderToken(tokens, idx, options);
    }
  };
}

export default linkedMarkdownPlugin;
