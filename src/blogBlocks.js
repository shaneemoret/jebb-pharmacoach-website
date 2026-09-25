const sameText = (left, right) => left?.trim() === right?.trim();

export function prepareArticleBlocks(blocks = []) {
  const prepared = [];

  for (let index = 0; index < blocks.length;) {
    const block = blocks[index];
    if (block.type !== "list" || block.items.length >= 3) {
      prepared.push(block);
      index += 1;
      continue;
    }

    const items = [];
    const ordered = Boolean(block.ordered);
    while (index < blocks.length) {
      const candidate = blocks[index];
      if (candidate.type !== "list" || candidate.items.length >= 3 || Boolean(candidate.ordered) !== ordered) break;
      items.push(...candidate.items);
      index += 1;

      if (candidate.items.length === 1 && blocks[index]?.type === "p" && sameText(blocks[index].text, candidate.items[0])) {
        index += 1;
      }
      if (blocks[index]?.type !== "list") break;
    }

    if (items.length >= 3) prepared.push({ type: "list", items, ordered });
    else items.forEach(text => prepared.push({ type: "p", text }));
  }

  return prepared;
}
