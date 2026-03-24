// build-verified.js
// Build pattern that returns a structural description of created nodes.
// Adapt the buildFn() contents to your specific build, then pass to figma_execute.
// Use the returned description to verify against a screenshot.

// --- ADAPT THIS SECTION ---
// Replace the contents of buildFn with your actual build logic.
// It should return the root node of what was created.

async function buildFn(parent) {
  // Example: create a card
  const card = figma.createFrame();
  card.name = 'Card';
  card.layoutMode = 'VERTICAL';
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'FIXED';
  card.resize(360, 100);
  card.itemSpacing = 12;
  card.paddingTop = 20;
  card.paddingBottom = 20;
  card.paddingLeft = 20;
  card.paddingRight = 20;
  card.cornerRadius = 12;
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  parent.appendChild(card);
  return card;
}

// --- DO NOT MODIFY BELOW ---

function describeNode(node, depth = 0) {
  const desc = {
    id: node.id,
    name: node.name,
    type: node.type,
    width: Math.round(node.width),
    height: Math.round(node.height),
    x: Math.round(node.x),
    y: Math.round(node.y),
  };

  if ('layoutMode' in node && node.layoutMode !== 'NONE') {
    desc.layout = {
      mode: node.layoutMode,
      itemSpacing: node.itemSpacing,
      padding: {
        top: node.paddingTop,
        right: node.paddingRight,
        bottom: node.paddingBottom,
        left: node.paddingLeft
      },
      primarySizing: node.primaryAxisSizingMode,
      counterSizing: node.counterAxisSizingMode,
      primaryAlign: node.primaryAxisAlignItems,
      counterAlign: node.counterAxisAlignItems
    };
  }

  if ('cornerRadius' in node && node.cornerRadius > 0) {
    desc.cornerRadius = node.cornerRadius;
  }

  if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
    desc.fills = node.fills.map(f => {
      if (f.type === 'SOLID') {
        const r = Math.round(f.color.r * 255);
        const g = Math.round(f.color.g * 255);
        const b = Math.round(f.color.b * 255);
        return { type: 'SOLID', hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`, opacity: f.opacity };
      }
      return { type: f.type };
    });
  }

  if (node.type === 'TEXT') {
    desc.text = {
      characters: node.characters,
      fontSize: node.fontSize,
      fontFamily: typeof node.fontName === 'object' ? node.fontName.family : 'mixed',
      fontStyle: typeof node.fontName === 'object' ? node.fontName.style : 'mixed'
    };
  }

  if ('children' in node && node.children.length > 0 && depth < 5) {
    desc.children = node.children.map(child => describeNode(child, depth + 1));
  }

  return desc;
}

// Execute
const parentId = 'REPLACE_WITH_PARENT_NODE_ID';
const parent = figma.getNodeById(parentId) || figma.currentPage;
const result = await buildFn(parent);
const description = describeNode(result);

console.log(JSON.stringify({
  created: description,
  message: `Built "${result.name}" (${result.id}) — ${Math.round(result.width)}x${Math.round(result.height)}`
}, null, 2));
