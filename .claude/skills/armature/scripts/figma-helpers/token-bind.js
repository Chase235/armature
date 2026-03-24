// token-bind.js
// Find variables by semantic name and bind them to node properties.
// Adapt the nodeId and bindings object, then pass to figma_execute.

const nodeId = 'REPLACE_WITH_NODE_ID';

// Define bindings: property name -> variable name path
// Color properties use setBoundVariableForPaint
// Float properties use setBoundVariable
const bindings = {
  // Color bindings (fill, stroke)
  fill: 'color/bg/surface',           // Variable name to bind to the fill
  stroke: 'color/border/default',     // Variable name to bind to the stroke

  // Float bindings (spacing, radius)
  itemSpacing: 'spacing/md',
  paddingTop: 'spacing/lg',
  paddingBottom: 'spacing/lg',
  paddingLeft: 'spacing/lg',
  paddingRight: 'spacing/lg',
  cornerRadius: 'radius/lg',
};

// --- DO NOT MODIFY BELOW ---

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

// Build a lookup of all variables by name
const variablesByName = {};
const collections = figma.variables.getLocalVariableCollections();
for (const collection of collections) {
  for (const varId of collection.variableIds) {
    const variable = figma.variables.getVariableById(varId);
    if (variable) {
      variablesByName[variable.name] = variable;
    }
  }
}

const node = figma.getNodeById(nodeId);
if (!node) {
  console.log(JSON.stringify({ error: `Node ${nodeId} not found` }));
} else {
  const report = { bound: [], missing: [], errors: [] };

  for (const [prop, varName] of Object.entries(bindings)) {
    const variable = variablesByName[varName];
    if (!variable) {
      report.missing.push({ property: prop, variableName: varName });
      continue;
    }

    try {
      if (prop === 'fill') {
        const paint = figma.variables.setBoundVariableForPaint(
          { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
          'color',
          variable
        );
        node.fills = [paint];
        report.bound.push({ property: 'fills', variable: varName });
      } else if (prop === 'stroke') {
        const paint = figma.variables.setBoundVariableForPaint(
          { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
          'color',
          variable
        );
        node.strokes = [paint];
        report.bound.push({ property: 'strokes', variable: varName });
      } else {
        // Float binding (spacing, radius, etc.)
        node.setBoundVariable(prop, variable);
        report.bound.push({ property: prop, variable: varName });
      }
    } catch (e) {
      report.errors.push({ property: prop, variable: varName, error: e.message });
    }
  }

  console.log(JSON.stringify(report, null, 2));
}
