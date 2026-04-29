import markdownIt from 'markdown-it';

const md = markdownIt();

export function renderTemplate(
  template: string,
  variables: Record<string, any>,
): string {
  let html = template;

  html = html.replace(
    /{{#each (\w+)}}([\s\S]*?){{\/each}}/g,
    (match, key, inner) => {
      const arr = variables[key];
      if (!Array.isArray(arr)) return '';

      return arr
        .map((item) => {
          let block = inner;
          for (const [k, v] of Object.entries(item)) {
            block = block.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), v);
          }
          return block;
        })
        .join('');
    },
  );

  for (const [key, value] of Object.entries(variables)) {
    let finalValue = value;

    if (key.endsWith('_md') && typeof value === 'string') {
      finalValue = md.render(value);
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      for (const [subKey, subValue] of Object.entries(value)) {
        const nestedRegex = new RegExp(`{{\\s*${key}\\.${subKey}\\s*}}`, 'g');
        html = html.replace(nestedRegex, String(subValue));
      }
    }

    const varRegex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(varRegex, String(finalValue));
  }

  return html;
}
