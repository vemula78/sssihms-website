// Babel plugin: SSR has no click events, so onClick={() => navigate(X)} (or the
// mobile-menu's local go(X) wrapper, which just also closes the menu) carries no
// information once rendered to a string. This finds that exact call pattern in
// each onClick handler and copies its argument expression onto a sibling
// data-page={X} JSX attribute — same expression, so dynamic values (s.key, p,
// item.page, ...) still resolve correctly per render — for the postprocess pass
// in render.mjs to turn into a real href.
export default function navigateDataAttr({ types: t }) {
  const NAV_FNS = new Set(['navigate', 'go']);

  function findNavigateArg(fn) {
    if (!t.isArrowFunctionExpression(fn) && !t.isFunctionExpression(fn)) return null;
    const body = fn.body;
    const stmts = t.isBlockStatement(body) ? body.body : [{ type: 'ExpressionStatement', expression: body }];
    for (const stmt of stmts) {
      const expr = t.isExpressionStatement(stmt) ? stmt.expression : null;
      if (expr && t.isCallExpression(expr) && t.isIdentifier(expr.callee) &&
          NAV_FNS.has(expr.callee.name) && expr.arguments.length === 1) {
        return expr.arguments[0];
      }
    }
    return null;
  }

  return {
    name: 'navigate-data-attr',
    visitor: {
      JSXAttribute(path) {
        if (path.node.name.name !== 'onClick') return;
        const value = path.node.value;
        if (!t.isJSXExpressionContainer(value)) return;
        const arg = findNavigateArg(value.expression);
        if (!arg) return;
        const opening = path.parentPath.node;
        if (opening.attributes.some((a) => t.isJSXAttribute(a) && a.name.name === 'data-page')) return;
        opening.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('data-page'), t.jsxExpressionContainer(t.cloneNode(arg)))
        );
      },
    },
  };
}
