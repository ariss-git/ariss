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
const outDir = tsconfig.compilerOptions.outDir || 'dist';

const aliasMap = Object.entries(paths).map(([alias, targets]) => {
    const escapedAlias = alias.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '(.*)');
    const aliasPattern = new RegExp(`^${escapedAlias}$`);
    const targetPath = targets[0].replace(/\*/g, '');
    const resolvedTarget = path.resolve(baseUrl, targetPath);
    return [aliasPattern, resolvedTarget];
});

/** @type {import('module').ResolveHook} */
export async function resolve(specifier, context, defaultResolve) {
    for (const [pattern, target] of aliasMap) {
        const match = specifier.match(pattern);
        if (match) {
            // Correctly determine the dist folder path relative to the loader's location
            const distPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', outDir);

            // Get the relative path from the alias
            const relativeImportPath = specifier.replace(pattern, match[1]);

            // Join the dist path with the relative import path
            const resolvedPath = path.join(distPath, relativeImportPath);

            // Add .js extension only if it's not already there
            const finalPath = resolvedPath.endsWith('.js') ? resolvedPath : resolvedPath + '.js';

            const resolvedUrl = pathToFileURL(finalPath).href;
            return defaultResolve(resolvedUrl, context);
        }
    }
    return defaultResolve(specifier, context);
}
