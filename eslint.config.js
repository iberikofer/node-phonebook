import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
	js.configs.recommended,
	prettier,
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.node,
				...globals.browser,
				...globals.es2021,
			},
		},
		rules: {
			"no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
		},
	},
];
