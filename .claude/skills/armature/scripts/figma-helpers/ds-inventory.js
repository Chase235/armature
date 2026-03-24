// ds-inventory.js
// Walk the current file and return all variable collections, components, and styles.
// Adapt and pass to figma_execute. Returns a JSON string.

const inventory = { variables: {}, components: [], styles: { paint: [], text: [], effect: [] } };

// Variable collections and their contents
const collections = figma.variables.getLocalVariableCollections();
for (const collection of collections) {
  const collectionData = {
    name: collection.name,
    modes: collection.modes.map(m => ({ id: m.modeId, name: m.name })),
    variables: []
  };

  for (const varId of collection.variableIds) {
    const variable = figma.variables.getVariableById(varId);
    if (!variable) continue;

    const varData = {
      id: variable.id,
      name: variable.name,
      resolvedType: variable.resolvedType,
      values: {}
    };

    for (const mode of collection.modes) {
      const value = variable.valuesByMode[mode.modeId];
      if (variable.resolvedType === 'COLOR' && value && typeof value === 'object' && 'r' in value) {
        const r = Math.round(value.r * 255);
        const g = Math.round(value.g * 255);
        const b = Math.round(value.b * 255);
        varData.values[mode.name] = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      } else if (value && typeof value === 'object' && 'type' in value && value.type === 'VARIABLE_ALIAS') {
        const aliased = figma.variables.getVariableById(value.id);
        varData.values[mode.name] = `alias:${aliased ? aliased.name : value.id}`;
      } else {
        varData.values[mode.name] = value;
      }
    }

    collectionData.variables.push(varData);
  }

  inventory.variables[collection.name] = collectionData;
}

// Components (local to the file)
const components = figma.currentPage.findAll(n => n.type === 'COMPONENT');
for (const comp of components) {
  inventory.components.push({
    id: comp.id,
    name: comp.name,
    description: comp.description || '',
    properties: comp.componentPropertyDefinitions
      ? Object.entries(comp.componentPropertyDefinitions).map(([key, def]) => ({
          name: key,
          type: def.type,
          defaultValue: def.defaultValue
        }))
      : [],
    width: Math.round(comp.width),
    height: Math.round(comp.height)
  });
}

// Also check all pages for components (not just current page)
for (const page of figma.root.children) {
  if (page === figma.currentPage) continue;
  const pageComponents = page.findAll(n => n.type === 'COMPONENT');
  for (const comp of pageComponents) {
    inventory.components.push({
      id: comp.id,
      name: comp.name,
      page: page.name,
      description: comp.description || '',
      properties: comp.componentPropertyDefinitions
        ? Object.entries(comp.componentPropertyDefinitions).map(([key, def]) => ({
            name: key,
            type: def.type,
            defaultValue: def.defaultValue
          }))
        : [],
      width: Math.round(comp.width),
      height: Math.round(comp.height)
    });
  }
}

// Paint styles
const paintStyles = figma.getLocalPaintStyles();
for (const style of paintStyles) {
  inventory.styles.paint.push({
    id: style.id,
    name: style.name,
    paints: style.paints.map(p => {
      if (p.type === 'SOLID') {
        const r = Math.round(p.color.r * 255);
        const g = Math.round(p.color.g * 255);
        const b = Math.round(p.color.b * 255);
        return { type: 'SOLID', color: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`, opacity: p.opacity };
      }
      return { type: p.type };
    })
  });
}

// Text styles
const textStyles = figma.getLocalTextStyles();
for (const style of textStyles) {
  inventory.styles.text.push({
    id: style.id,
    name: style.name,
    fontFamily: style.fontName.family,
    fontStyle: style.fontName.style,
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing
  });
}

// Effect styles
const effectStyles = figma.getLocalEffectStyles();
for (const style of effectStyles) {
  inventory.styles.effect.push({
    id: style.id,
    name: style.name,
    effects: style.effects.map(e => ({ type: e.type, radius: e.radius, visible: e.visible }))
  });
}

// Summary counts
inventory.summary = {
  variableCollections: collections.length,
  totalVariables: Object.values(inventory.variables).reduce((sum, c) => sum + c.variables.length, 0),
  components: inventory.components.length,
  paintStyles: inventory.styles.paint.length,
  textStyles: inventory.styles.text.length,
  effectStyles: inventory.styles.effect.length
};

console.log(JSON.stringify(inventory, null, 2));
