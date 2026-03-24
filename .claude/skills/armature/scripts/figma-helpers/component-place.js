// component-place.js
// Search for a component, instantiate it, apply overrides, position in parent.
// Adapt the search query, parent ID, and overrides, then pass to figma_execute.

const searchQuery = 'REPLACE_WITH_COMPONENT_NAME';
const parentNodeId = 'REPLACE_WITH_PARENT_NODE_ID';
const insertIndex = -1; // -1 = append at end. 0 = insert at beginning.

// Property overrides to apply after instantiation
// Keys must match the component's property definitions
const overrides = {
  // 'Label': 'Submit',           // TEXT property
  // 'Show Icon': true,           // BOOLEAN property
  // 'Variant': 'secondary',      // VARIANT property
};

// --- DO NOT MODIFY BELOW ---

// Search for the component
const allComponents = [];
for (const page of figma.root.children) {
  const found = page.findAll(n =>
    (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') &&
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  allComponents.push(...found);
}

if (allComponents.length === 0) {
  console.log(JSON.stringify({
    error: `No component found matching "${searchQuery}"`,
    suggestion: 'Check component names with figma_search_components first'
  }));
} else {
  // Prefer exact match, then first partial match
  let target = allComponents.find(c => c.name.toLowerCase() === searchQuery.toLowerCase());
  if (!target) target = allComponents[0];

  // If it's a component set, get the default variant
  let component = target;
  if (target.type === 'COMPONENT_SET') {
    component = target.defaultVariant || target.children[0];
  }

  // Instantiate
  const instance = component.createInstance();

  // Apply overrides
  const overrideReport = [];
  for (const [key, value] of Object.entries(overrides)) {
    try {
      const props = instance.componentProperties;
      if (props && key in props) {
        instance.setProperties({ [key]: value });
        overrideReport.push({ property: key, value: value, status: 'applied' });
      } else {
        overrideReport.push({ property: key, value: value, status: 'not found on component' });
      }
    } catch (e) {
      overrideReport.push({ property: key, value: value, status: `error: ${e.message}` });
    }
  }

  // Place in parent
  const parent = figma.getNodeById(parentNodeId);
  if (parent && 'appendChild' in parent) {
    if (insertIndex >= 0 && insertIndex < parent.children.length) {
      parent.insertChild(insertIndex, instance);
    } else {
      parent.appendChild(instance);
    }
  }

  console.log(JSON.stringify({
    component: {
      name: component.name,
      id: component.id,
      fromSet: target.type === 'COMPONENT_SET' ? target.name : null
    },
    instance: {
      id: instance.id,
      name: instance.name,
      width: Math.round(instance.width),
      height: Math.round(instance.height),
      parent: parent ? parent.name : 'current page'
    },
    overrides: overrideReport
  }, null, 2));
}
