import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { findAngularClassDecorator } from "./angular-class-decorator";
import { findNearestAncestorOf } from "./ast-traversal";

function isPropertyInInjectionTokenFactory(
  property: TSESTree.PropertyComputedName | TSESTree.PropertyNonComputedName,
): boolean {
  // Check the property is inside a `new InjectionToken()`
  const newExpression = findNearestAncestorOf(
    property,
    (node) => node.type === AST_NODE_TYPES.NewExpression,
  );

  if (
    newExpression?.callee.type === AST_NODE_TYPES.Identifier &&
    newExpression.callee.name === "InjectionToken"
  ) {
    return true;
  }

  return false;
}

function isPropertyInProviderFactory(
  property: TSESTree.PropertyComputedName | TSESTree.PropertyNonComputedName,
): boolean {
  // Check the property is called `useFactory`
  if (
    property.key.type !== AST_NODE_TYPES.Identifier ||
    property.key.name !== "useFactory"
  ) {
    return false;
  }

  // Check the object contains another property called `provide`
  const objectExpression = findNearestAncestorOf(
    property,
    (node) => node.type === AST_NODE_TYPES.ObjectExpression,
  );

  const provideProperty = objectExpression?.properties.find(
    (objectProperty) =>
      objectProperty.type === AST_NODE_TYPES.Property &&
      objectProperty.key.type === AST_NODE_TYPES.Identifier &&
      objectProperty.key.name === "provide",
  );

  if (provideProperty !== undefined) {
    return true;
  }

  return false;
}

function isPropertyInServiceFactory(
  property: TSESTree.PropertyComputedName | TSESTree.PropertyNonComputedName,
): boolean {
  // Check the property is called `useFactory`
  if (
    property.key.type !== AST_NODE_TYPES.Identifier ||
    property.key.name !== "factory"
  ) {
    return false;
  }

  // Check the property is inside an `Service()`
  const classDeclaration = findNearestAncestorOf(
    property,
    (node) => node.type === AST_NODE_TYPES.ClassDeclaration,
  );

  if (!classDeclaration) {
    return false;
  }

  if (findAngularClassDecorator(classDeclaration) === "Service") {
    return true;
  }

  return false;
}

function isPropertyInInjectableFactory(
  property: TSESTree.PropertyComputedName | TSESTree.PropertyNonComputedName,
): boolean {
  // Check the property is called `useFactory`
  if (
    property.key.type !== AST_NODE_TYPES.Identifier ||
    property.key.name !== "useFactory"
  ) {
    return false;
  }

  // Check the property is inside an `Injectable()`
  const classDeclaration = findNearestAncestorOf(
    property,
    (node) => node.type === AST_NODE_TYPES.ClassDeclaration,
  );

  if (!classDeclaration) {
    return false;
  }

  if (findAngularClassDecorator(classDeclaration) === "Injectable") {
    return true;
  }

  return false;
}

export function isInFactoryFunction(node: TSESTree.Node): boolean {
  const property = findNearestAncestorOf(
    node,
    (node) => node.type === AST_NODE_TYPES.Property,
    { notInCallback: true },
  );

  if (
    property &&
    (isPropertyInProviderFactory(property) ||
      isPropertyInInjectionTokenFactory(property) ||
      isPropertyInServiceFactory(property) ||
      isPropertyInInjectableFactory(property))
  ) {
    return true;
  }

  return false;
}
