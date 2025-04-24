// loaders/tsconfig-paths-loader.mjs

import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

const tsconfigPath = new URL('../tsconfig.json', import.meta.url);
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
const paths = tsconfig.compilerOptions.paths || {};
const baseUrl = path.resolve(
    path.dirname(fileURLToPath(tsconfigPath)),
    tsconfig.compilerOptions.baseUrl || '.'
);

// Preprocess paths like "@/*": ["src/*"]
const aliasMap = Object.entries(paths).map(([alias, targets]) => {
    const aliasPattern = new RegExp(`^${alias.replace('*', '(.*)')}$`);
    const targetPattern = targets[0].replace('*', '$1');
    const resolvedTarget = path.resolve(baseUrl, targetPattern);
    return [aliasPattern, resolvedTarget];
});

/** @type {import('module').ResolveHook} */
export async function resolve(specifier, context, defaultResolve) {
    for (const [pattern, target] of aliasMap) {
        const match = specifier.match(pattern);
        if (match) {
            const resolved = pathToFileURL(path.join(target, match[1])).href;
            return defaultResolve(resolved, context);
        }
    }
    return defaultResolve(specifier, context);
}
