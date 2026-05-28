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
    const value = htmlInput.value?.toLowerCase() ?? "";
    const isVisible = htmlInput.offsetWidth > 0 && htmlInput.offsetHeight > 0;
    if (isVisible && value.includes(lowerQuery)) {
      return htmlInput;
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
    const parent = node.parentElement;
    if (
      text?.includes(lowerQuery) &&
      parent &&
      parent.offsetWidth > 0 &&
      parent.offsetHeight > 0
    ) {
      bestElement =
        !bestElement ||
        (parent.textContent?.length || 0) <
          (bestElement.textContent?.length || 0)
          ? parent
          : bestElement;
    }
  }
  return bestElement;
}
