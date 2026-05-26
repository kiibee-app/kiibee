export function findElement(
  container: HTMLElement,
  query: string,
): HTMLElement | null {
  const lowerQuery = query.toLowerCase();

  const inputs = container.querySelectorAll("input, textarea, select");
  for (const input of Array.from(inputs)) {
    const htmlInput = input as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    if (htmlInput.value && htmlInput.value.toLowerCase().includes(lowerQuery)) {
      if (htmlInput.offsetWidth > 0 && htmlInput.offsetHeight > 0) {
        return htmlInput;
      }
    }
  }

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
  );
  let node;
  let bestElement: HTMLElement | null = null;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue?.trim().toLowerCase();
    if (text && text.includes(lowerQuery)) {
      const parent = node.parentElement;
      if (parent && parent.offsetWidth > 0 && parent.offsetHeight > 0) {
        if (
          !bestElement ||
          (parent.textContent?.length || 0) <
            (bestElement.textContent?.length || 0)
        ) {
          bestElement = parent;
        }
      }
    }
  }
  return bestElement;
}
