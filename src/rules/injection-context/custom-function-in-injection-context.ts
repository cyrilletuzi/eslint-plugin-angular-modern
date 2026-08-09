import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isInInjectionContext } from "../../utils/angular-injection-context";
import { isCalledWithProperty } from "../../utils/ast-call-argument";

export const ruleName = "custom-function-in-injection-context";

type SpecialInjectionContext = "routing" | "http" | "factory" | "asyncApplicationInitialization" | "syncApplicationInitialization";

interface FunctionConfig {
  readonly name: string;
  readonly argumentPosition?: number | undefined;
  readonly argumentPropertyName?: string | undefined;
  readonly allowedSpecialInjectionContexts?: readonly SpecialInjectionContext[];
}

interface RuleOptions {
  readonly functions?: readonly FunctionConfig[];
}

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    docs: {
      description: `Checks that a function is called in an injection context, or that an explicit injection context is provided as an argument.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/CUSTOM_FUNCTION.md',
    },
    schema: [{
      type: "object",
      additionalProperties: false,
      description: "Configuration of the rule.",
      properties: {
        functions: {
          type: "array",
          description: "List of the functions to check.",
          items: {
            type: "object",
            additionalProperties: false,
            description: "Configuration of a functions to check.",
            properties: {
              name: {
                type: "string",
                minLength: 1,
                description: "Name of the function to check, for example 'customInject'.",
              },
              argumentPosition: {
                type: "number",
                minimum: 0,
                description: "0-based position of the argument in which it is possible to pass an explicit injection context."
              },
              argumentPropertyName: {
                type: "string",
                minLength: 1,
                description: "If the explicit injection context argument is an object, the name of the property, for example 'injector'. If not provided, the rule will consider the argument is directly the explicit injection context."
              },
              allowedSpecialInjectionContexts: {
                type: "array",
                description: "List of special injection contexts to allow.",
                items: {
                  type: "string",
                  enum: ["routing", "http", "factory", "asyncApplicationInitialization", "syncApplicationInitialization"],
                  description: "Special injection contexts to allow: routing features, HTTP features, factories or sync / async application initilization features.",
                },
              },
            },
            required: ["name"],
          },
        },
      },
    }],
  },
  create(context) {
    return {
      "CallExpression[callee.type='Identifier']"(node: TSESTree.CallExpression) {
        const ruleOptions = context.options[0] as RuleOptions | undefined;
        const functionsConfigs = ruleOptions?.functions ?? [];
        const callee = node.callee as TSESTree.Identifier;

        for (const functionConfig of functionsConfigs) {
          if (callee.name === functionConfig.name) {
            if ((
              functionConfig.argumentPosition === undefined ||
              functionConfig.argumentPropertyName !== undefined && !isCalledWithProperty(node, functionConfig.argumentPosition, functionConfig.argumentPropertyName) ||
              node.arguments.length < functionConfig.argumentPosition + 1
            ) &&
              !isInInjectionContext(node, {
                includeRouting: functionConfig.allowedSpecialInjectionContexts?.includes("routing") ?? false,
                includeHttp: functionConfig.allowedSpecialInjectionContexts?.includes("http") ?? false,
                includeFactories: functionConfig.allowedSpecialInjectionContexts?.includes("factory") ?? false,
                includeAsyncAppInitializationFunctions: functionConfig.allowedSpecialInjectionContexts?.includes("asyncApplicationInitialization") ?? false,
                includeSyncAppInitializationFunctions: functionConfig.allowedSpecialInjectionContexts?.includes("syncApplicationInitialization") ?? false,
              })) {
              context.report({
                node,
                message: `\`${functionConfig.name}()\` must be called in an injection context, or ${functionConfig.argumentPropertyName !== undefined ? `\`${functionConfig.argumentPropertyName}\`` : `an explicit injection context`} must be provided in an argument.`,
              });
            }
            /* No need to check other functions names if one has already matched */
            break;
          }
        }
      },
    };
  },
};
