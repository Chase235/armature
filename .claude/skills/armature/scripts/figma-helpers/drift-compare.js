// drift-compare.js
// Normalize a Figma node tree into a flat, diffable structure.
// Use during reconciliation to produce output comparable against code analysis.
// Adapt the nodeId, then pass to figma_execute.

const nodeId = 'REPLACE_WITH_NODE_ID';
const maxDepth = 6; // How deep to traverse

// --- DO NOT MODIFY BELOW ---

function hexFromColor(color) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function describeNode(node, depth) {
  if (depth > maxDepth) return { name: node.name, type: node.type, truncated: true };

  const desc = {
    name: node.name,
    type: node.type,
    size: { w: Math.round(node.width), h: Math.round(node.height) },
  };

  // Layout
  if ('layoutMode' in node && node.layoutMode !== 'NONE') {
    desc.layout = {
      direction: node.layoutMode === 'VERTICAL' ? 'column' : 'row',
      gap: node.itemSpacing,
      padding: [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft],
      wrap: node.layoutWrap === 'WRAP',
    };

    if (node.primaryAxisAlignItems !== 'MIN') {
      desc.layout.justify = node.primaryAxisAlignItems.toLowerCase();
    }
    if (node.counterAxisAlignItems !== 'MIN') {
      desc.layout.align = node.counterAxisAlignItems.toLowerCase();
    }
  }

  // Sizing within parent
  if ('layoutSizingHorizontal' in node) {
    desc.hSizing = node.layoutSizingHorizontal; // FILL, HUG, FIXED
    desc.vSizing = node.layoutSizingVertical;
  }

  // Fills
  if ('fills' in node && Array.isArray(node.fills)) {
    const visibleFills = node.fills.filter(f => f.visible !== false);
    if (visibleFills.length > 0) {
      desc.fills = visibleFills.map(f => {
        if (f.type === 'SOLID') {
          return { color: hexFromColor(f.color), opacity: f.opacity != null ? f.opacity : 1 };
        }
        return { type: f.type };
      });
    }
  }

  // Strokes
  if ('strokes' in node && Array.isArray(node.strokes) && node.strokes.length > 0) {
    desc.stroke = {
      color: node.strokes[0].type === 'SOLID' ? hexFromColor(node.strokes[0].color) : node.strokes[0].type,
      weight: node.strokeWeight,
      align: node.strokeAlign
    };
  }

  // Corner radius
  if ('cornerRadius' in node && node.cornerRadius > 0) {
    desc.radius = node.cornerRadius;
  } else if ('topLeftRadius' in node && (node.topLeftRadius > 0 || node.topRightRadius > 0 || node.bottomLeftRadius > 0 || node.bottomRightRadius > 0)) {
    desc.radius = [node.topLeftRadius, node.topRightRadius, node.bottomRightRadius, node.bottomLeftRadius];
  }

  // Effects (shadows, blur)
  if ('effects' in node && Array.isArray(node.effects) && node.effects.length > 0) {
    desc.effects = node.effects.filter(e => e.visible !== false).map(e => ({
      type: e.type,
      radius: e.radius,
      offset: e.offset ? { x: e.offset.x, y: e.offset.y } : undefined,
      opacity: e.color ? e.color.a : undefined
    }));
  }

  // Text
  if (node.type === 'TEXT') {
    desc.text = {
      content: node.characters,
      fontSize: node.fontSize !== figma.mixed ? node.fontSize : 'mixed',
      fontFamily: typeof node.fontName === 'object' ? node.fontName.family : 'mixed',
      fontWeight: typeof node.fontName === 'object' ? node.fontName.style : 'mixed',
      lineHeight: node.lineHeight !== figma.mixed ? node.lineHeight : 'mixed',
      letterSpacing: node.letterSpacing !== figma.mixed ? node.letterSpacing : 'mixed',
      autoResize: node.textAutoResize,
    };
  }

  // Clip
  if ('clipsContent' in node && node.clipsContent) {
    desc.overflow = 'hidden';
  }

  // Bound variables (token references)
  if ('boundVariables' in node) {
    const bound = {};
    for (const [prop, binding] of Object.entries(node.boundVariables)) {
      if (binding && typeof binding === 'object') {
        const varRef = Array.isArray(binding) ? binding[0] : binding;
        if (varRef && varRef.id) {
          const variable = figma.variables.getVariableById(varRef.id);
          if (variable) {
            bound[prop] = variable.name;
          }
        }
      }
    }
    if (Object.keys(bound).length > 0) {
      desc.tokens = bound;
    }
  }

  // Children
  if ('children' in node && node.children.length > 0) {
    desc.children = node.children.map(child => describeNode(child, depth + 1));
  }

  return desc;
}

const node = figma.getNodeById(nodeId);
if (!node) {
  console.log(JSON.stringify({ error: `Node ${nodeId} not found` }));
} else {
  const structure = describeNode(node, 0);
  console.log(JSON.stringify(structure, null, 2));
}
