function normalizeAssetUrl(url: string, rawBase: string): string {
  if (!url) {
    return url;
  }

  const githubFile = url.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|raw)\/(?:refs\/(?:heads|tags)\/)?([^/]+)\/(.+)$/i
  );
  if (githubFile) {
    return `https://raw.githubusercontent.com/${githubFile[1]}/${githubFile[2]}/${githubFile[3]}/${githubFile[4]}`;
  }
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(url)) {
    return url;
  }
  return rawBase + url.replace(/^(?:\.\/|\/)+/, '');
}

export function normalizeReadmeSrcset(
  srcset: string,
  owner: string,
  repo: string,
  branch: string
): string {
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
  const candidates: string[] = [];
  let index = 0;

  while (index < srcset.length) {
    while (index < srcset.length && /[\s,]/.test(srcset[index])) {
      index += 1;
    }
    if (index >= srcset.length) {
      break;
    }

    const urlStart = index;
    while (index < srcset.length && !/\s/.test(srcset[index])) {
      index += 1;
    }

    let url = srcset.slice(urlStart, index);
    if (url.endsWith(',')) {
      url = url.replace(/,+$/, '');
      candidates.push(normalizeAssetUrl(url, rawBase));
      continue;
    }

    while (index < srcset.length && /\s/.test(srcset[index])) {
      index += 1;
    }
    const descriptorStart = index;
    while (index < srcset.length && srcset[index] !== ',') {
      index += 1;
    }
    const descriptor = srcset.slice(descriptorStart, index).trim();
    candidates.push(`${normalizeAssetUrl(url, rawBase)}${descriptor ? ` ${descriptor}` : ''}`);
    if (srcset[index] === ',') {
      index += 1;
    }
  }

  return candidates.join(', ');
}

/** Normalize only image/source URL attributes and adapt GitHub themed-picture markup. */
export function processReadmeHtml(
  html: string,
  owner: string,
  repo: string,
  branch: string
): string {
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
  let out = html.replace(/<(img|source)\b([^>]*)>/gi, (tag, _name: string, attributes: string) => {
    const normalizedAttributes = attributes.replace(
      /(^|\s)(src|srcset)(\s*=\s*)(["'])(.*?)\4/gi,
      (_attribute, prefix: string, name: string, equals: string, quote: string, value: string) => {
        const normalized =
          name.toLowerCase() === 'srcset'
            ? normalizeReadmeSrcset(value, owner, repo, branch)
            : normalizeAssetUrl(value.trim(), rawBase);
        return `${prefix}${name}${equals}${quote}${normalized}${quote}`;
      }
    );
    return tag.replace(attributes, normalizedAttributes);
  });

  out = out.replace(/<themed-picture\b([^>]*)>/gi, '<picture$1>');
  out = out.replace(/<\/themed-picture\s*>/gi, '</picture>');
  out = out.replace(/<a\s+[^>]*class="[^"]*anchor[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
  out = out.replace(
    /<a\s+([^>]*?)href=(["'])([^"']+)\2([^>]*)>/gi,
    (_, before, quote, href, after) => {
      const combined = `${before}${after}`;
      const targetAttr = /target\s*=/i.test(combined) ? '' : ' target="_blank"';
      const relAttr = /rel\s*=/i.test(combined) ? '' : ' rel="noopener noreferrer"';
      return `<a ${combined}href=${quote}${href}${quote}${targetAttr}${relAttr}>`;
    }
  );

  return out;
}
