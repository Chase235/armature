// layout-audit.js
// Walks a Figma node tree and extracts measurable design quality data.
// Run via figma_execute. Pass the target frame's node ID.
//
// Returns structured JSON with:
// - spacing: all gap/padding values, base-8 compliance
// - contrast: text-on-background contrast ratios, WCAG pass/fail
// - targets: interactive element hit target sizes
// - tokens: color/spacing values and whether they match defined variables
// - alignment: detected alignment axes and outliers
//
// Usage in figma_execute:
//   const TARGET_ID = '94:3289';
//   // paste this entire script, replacing TARGET_ID

const TARGET_ID = '__NODE_ID__'; // replaced at runtime

const BASE_8_VALUES = new Set([0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 112, 128, 160, 192, 224, 256]);

function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return c;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getFillColor(node) {
  if (!node.fills || node.fills.length === 0) return null;
  const fill = node.fills.find(f => f.type === 'SOLID' && f.visible !== false);
  if (!fill) return null;
  return { r: fill.color.r, g: fill.color.g, b: fill.color.b, a: fill.opacity ?? 1 };
}

function getEffectiveBg(node) {
  let current = node.parent;
  while (current && current.type !== 'PAGE') {
    const color = getFillColor(current);
    if (color && color.a > 0.5) return color;
    current = current.parent;
  }
  return { r: 1, g: 1, b: 1, a: 1 }; // default white
}

async function audit(targetId) {
  const root = await figma.getNodeByIdAsync(targetId);
  if (!root) return { error: 'Node not found: ' + targetId };

  const spacing = { values: [], violations: [], compliance: 0 };
  const contrast = { pairs: [], failures: [] };
  const targets = { elements: [], undersized: [] };
  const alignment = { xPositions: {}, yPositions: {} };
  const typography = { sizes: [], weights: [] };
  const colors = { fills: [] };

  let totalSpacingValues = 0;
  let compliantSpacingValues = 0;

  async function walk(node, depth) {
    if (depth > 8) return;

    // Spacing from auto-layout
    if ('layoutMode' in node && node.layoutMode !== 'NONE') {
      const gap = Math.round(node.itemSpacing || 0);
      const pt = Math.round(node.paddingTop || 0);
      const pb = Math.round(node.paddingBottom || 0);
      const pl = Math.round(node.paddingLeft || 0);
      const pr = Math.round(node.paddingRight || 0);

      const spacingVals = [
        { type: 'gap', value: gap, node: node.name },
        { type: 'padding-top', value: pt, node: node.name },
        { type: 'padding-bottom', value: pb, node: node.name },
        { type: 'padding-left', value: pl, node: node.name },
        { type: 'padding-right', value: pr, node: node.name }
      ];

      for (const s of spacingVals) {
        if (s.value === 0) continue;
        totalSpacingValues++;
        spacing.values.push(s);
        if (BASE_8_VALUES.has(s.value)) {
          compliantSpacingValues++;
        } else {
          spacing.violations.push(s);
        }
      }
    }

    // Text nodes: contrast + typography
    if (node.type === 'TEXT') {
      const fontSize = Math.round(node.fontSize || 0);
      const fontWeight = node.fontWeight || 400;
      typography.sizes.push({ size: fontSize, node: node.name });
      typography.weights.push({ weight: fontWeight, node: node.name });

      const textColor = getFillColor(node);
      if (textColor) {
        const bgColor = getEffectiveBg(node);
        const textLum = luminance(textColor.r, textColor.g, textColor.b);
        const bgLum = luminance(bgColor.r, bgColor.g, bgColor.b);
        const ratio = contrastRatio(textLum, bgLum);
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
        const threshold = isLargeText ? 3.0 : 4.5;
        const passes = ratio >= threshold;

        const pair = {
          node: node.name,
          fontSize,
          ratio: Math.round(ratio * 100) / 100,
          threshold,
          passes,
          textColor: `rgb(${Math.round(textColor.r * 255)},${Math.round(textColor.g * 255)},${Math.round(textColor.b * 255)})`,
          bgColor: `rgb(${Math.round(bgColor.r * 255)},${Math.round(bgColor.g * 255)},${Math.round(bgColor.b * 255)})`
        };
        contrast.pairs.push(pair);
        if (!passes) contrast.failures.push(pair);
      }
    }

    // Interactive elements: hit targets
    const interactiveNames = ['button', 'btn', 'input', 'nav', 'link', 'toggle', 'checkbox', 'radio', 'switch', 'tab', 'menu', 'send', 'click', 'cta'];
    const isInteractive = interactiveNames.some(n => node.name.toLowerCase().includes(n));
    if (isInteractive && 'width' in node) {
      const w = Math.round(node.width);
      const h = Math.round(node.height);
      const minDimension = Math.min(w, h);
      const element = { node: node.name, width: w, height: h, minDimension };
      targets.elements.push(element);
      if (minDimension < 32) {
        targets.undersized.push({ ...element, recommendation: 'Minimum 32px for cursor, 44px for touch' });
      }
    }

    // Colors
    const fill = getFillColor(node);
    if (fill) {
      const hex = '#' + [fill.r, fill.g, fill.b].map(c => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
      colors.fills.push({ hex, node: node.name, type: node.type });
    }

    // Alignment tracking (direct children of auto-layout parents)
    if ('x' in node && node.parent && node.parent.id === root.id) {
      const x = Math.round(node.x);
      const y = Math.round(node.y);
      alignment.xPositions[x] = (alignment.xPositions[x] || 0) + 1;
      alignment.yPositions[y] = (alignment.yPositions[y] || 0) + 1;
    }

    // Recurse
    if ('children' in node) {
      for (const child of node.children) {
        await walk(child, depth + 1);
      }
    }
  }

  await walk(root, 0);

  // Calculate compliance
  spacing.compliance = totalSpacingValues > 0
    ? Math.round((compliantSpacingValues / totalSpacingValues) * 100)
    : 100;

  // Deduplicate colors
  const uniqueColors = [...new Set(colors.fills.map(c => c.hex))];

  // Find dominant alignment axes
  const xAxes = Object.entries(alignment.xPositions)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const yAxes = Object.entries(alignment.yPositions)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Summarize typography scale
  const sizeDistribution = {};
  for (const t of typography.sizes) {
    sizeDistribution[t.size] = (sizeDistribution[t.size] || 0) + 1;
  }

  return {
    summary: {
      spacingCompliance: spacing.compliance + '%',
      spacingViolations: spacing.violations.length,
      contrastFailures: contrast.failures.length,
      contrastTotal: contrast.pairs.length,
      undersizedTargets: targets.undersized.length,
      interactiveElements: targets.elements.length,
      uniqueColors: uniqueColors.length,
      typeSizes: Object.keys(sizeDistribution).length
    },
    spacing: {
      compliance: spacing.compliance,
      violations: spacing.violations.slice(0, 20), // cap output
      totalChecked: totalSpacingValues
    },
    contrast: {
      failures: contrast.failures,
      worstRatio: contrast.pairs.length > 0
        ? Math.min(...contrast.pairs.map(p => p.ratio))
        : null
    },
    targets: {
      undersized: targets.undersized
    },
    typography: {
      sizeDistribution,
      distinctSizes: Object.keys(sizeDistribution).sort((a, b) => a - b)
    },
    colors: {
      unique: uniqueColors,
      count: uniqueColors.length
    },
    alignment: {
      dominantXAxes: xAxes,
      dominantYAxes: yAxes
    }
  };
}

return await audit(TARGET_ID);
