/**
 * Vite Plugin: Build-time i18n Text Transformation
 *
 * This plugin transforms hardcoded English strings in main process files
 * to use the main-i18n module's t() function.
 *
 * Benefits:
 * - Original code remains unchanged (easier upstream merges)
 * - Translations applied at build time
 * - Runtime language switching supported via main-i18n module
 */

import { Plugin } from 'vite';
import { readFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

interface Mapping {
  original: string;
  key: string;
  file: string;
}

interface TemplateMapping {
  pattern: string;
  key: string;
  interpolation: Record<string, string>;
  file: string;
}

interface HardcodedMap {
  version: string;
  mappings: Mapping[];
  templates: TemplateMapping[];
}

/**
 * Load the hardcoded map configuration
 * Uses import.meta.url to get the correct path during Vite build
 */
function loadHardcodedMap(): HardcodedMap {
  // Get the directory of this plugin file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const mapPath = resolve(__dirname, 'hardcoded-map.json');
  const content = readFileSync(mapPath, 'utf-8');
  return JSON.parse(content) as HardcodedMap;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Transform static string mappings
 */
function transformStaticStrings(code: string, mappings: Mapping[], filename: string): string {
  let transformed = code;

  for (const mapping of mappings) {
    // Only apply mappings to the correct file
    if (!filename.includes(mapping.file.replace('.ts', ''))) {
      continue;
    }

    // Match both single and double quoted strings
    const patterns = [
      new RegExp(`'${escapeRegex(mapping.original)}'`, 'g'),
      new RegExp(`"${escapeRegex(mapping.original)}"`, 'g'),
    ];

    for (const pattern of patterns) {
      if (pattern.test(transformed)) {
        // Replace with t() call
        transformed = transformed.replace(pattern, `t('${mapping.key}')`);
      }
    }
  }

  return transformed;
}

/**
 * Transform template literal mappings
 */
function transformTemplateLiterals(code: string, templates: TemplateMapping[], filename: string): string {
  let transformed = code;

  for (const template of templates) {
    // Only apply mappings to the correct file
    if (!filename.includes(template.file.replace('.ts', ''))) {
      continue;
    }

    // Build regex pattern from the template
    // Convert ${...} to capture groups
    let regexPattern = escapeRegex(template.pattern);

    // Replace escaped template expressions with capture groups
    // The pattern in JSON is like: "Working on subtask ${subtaskMatch[1]}..."
    // We need to match the actual code: `Working on subtask ${subtaskMatch[1]}...`
    for (const [key, expr] of Object.entries(template.interpolation)) {
      const escapedExpr = escapeRegex('${' + expr + '}');
      regexPattern = regexPattern.replace(escapedExpr, '\\$\\{([^}]+)\\}');
    }

    // Match template literal with backticks
    const pattern = new RegExp('`' + regexPattern.replace(/\\`/g, '`') + '`', 'g');

    // Find and replace
    const match = code.match(pattern);
    if (match) {
      // Extract the actual expressions from the original code
      const originalMatch = match[0];
      const expressionMatches = originalMatch.match(/\$\{([^}]+)\}/g) || [];

      // Build the interpolation object
      const interpolationKeys = Object.keys(template.interpolation);
      const interpolationParts = expressionMatches.map((expr, i) => {
        const key = interpolationKeys[i] || `arg${i}`;
        const value = expr.slice(2, -1); // Remove ${ and }
        return `${key}: ${value}`;
      });

      // Build the replacement
      if (interpolationParts.length > 0) {
        transformed = transformed.replace(
          originalMatch,
          `t('${template.key}', { ${interpolationParts.join(', ')} })`
        );
      }
    }
  }

  return transformed;
}

/**
 * Check if import statement already exists
 */
function hasI18nImport(code: string): boolean {
  return code.includes("from '../i18n/main-i18n'") ||
         code.includes("from '../../i18n/main-i18n'") ||
         code.includes("from './i18n/main-i18n'");
}

/**
 * Add i18n import to the file
 */
function addI18nImport(code: string, filename: string): string {
  if (hasI18nImport(code)) {
    return code;
  }

  // Determine the correct relative import path
  let importPath: string;
  if (filename.includes('agent/agent-events') || filename.includes('agent/agent-process')) {
    importPath = '../i18n/main-i18n';
  } else if (filename.includes('agent/')) {
    importPath = '../i18n/main-i18n';
  } else {
    importPath = './i18n/main-i18n';
  }

  // Find the last import statement and add after it
  const importRegex = /^import .+ from .+;?\s*$/gm;
  let lastImportEnd = 0;
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(code)) !== null) {
    lastImportEnd = match.index + match[0].length;
  }

  if (lastImportEnd > 0) {
    const before = code.substring(0, lastImportEnd);
    const after = code.substring(lastImportEnd);
    return `${before}\nimport { t } from '${importPath}';${after}`;
  }

  // No imports found, add at the beginning
  return `import { t } from '${importPath}';\n${code}`;
}

/**
 * Create the Vite plugin
 */
export function i18nTransformPlugin(): Plugin {
  let hardcodedMap: HardcodedMap;

  return {
    name: 'vite-i18n-transform',
    enforce: 'pre', // Run before other transforms

    buildStart() {
      // Load the mapping configuration
      hardcodedMap = loadHardcodedMap();
      console.log(`[i18n-transform] Loaded ${hardcodedMap.mappings.length} static mappings and ${hardcodedMap.templates.length} template mappings`);
    },

    transform(code: string, id: string) {
      // Only transform main process agent files
      if (!id.includes('/main/agent/') && !id.includes('\\main\\agent\\')) {
        return null;
      }

      // Only transform TypeScript files
      if (!id.endsWith('.ts')) {
        return null;
      }

      // Skip if file doesn't contain any of our target strings
      const hasTargetStrings = hardcodedMap.mappings.some(m =>
        code.includes(m.original)
      ) || hardcodedMap.templates.some(t =>
        code.includes(t.pattern.split('${')[0])
      );

      if (!hasTargetStrings) {
        return null;
      }

      console.log(`[i18n-transform] Transforming: ${id}`);

      let transformed = code;

      // Transform static strings
      transformed = transformStaticStrings(transformed, hardcodedMap.mappings, id);

      // Transform template literals
      transformed = transformTemplateLiterals(transformed, hardcodedMap.templates, id);

      // Add import if transformations were made
      if (transformed !== code) {
        transformed = addI18nImport(transformed, id);

        console.log(`[i18n-transform] Applied transformations to: ${id}`);
        return {
          code: transformed,
          map: null // Source map not needed for this transform
        };
      }

      return null;
    }
  };
}

export default i18nTransformPlugin;
