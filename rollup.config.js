import resolver from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
	input: "./src/index.ts",
	output: [
		{
			file: "dist/dispose.min.js",
			format: "umd",
			name: "Dispose",
		},
		{
			file: "dist/index.es.js",
			format: "es",
		},
	],
	plugins: [typescript({ tsconfig: "./tsconfig.json" }), resolver(), commonjs(), terser()],
};
