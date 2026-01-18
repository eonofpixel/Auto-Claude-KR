/**
 * Main Process i18n Module
 *
 * This module provides internationalization for the Electron main process.
 * Unlike the renderer process which uses react-i18next, the main process
 * uses a simple JSON-based translation system.
 *
 * The current language is synced from the renderer via IPC when settings change.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';

// Type definitions
type TranslationData = Record<string, string | Record<string, unknown>>;
type InterpolationValues = Record<string, string | number>;

// Current language (synced from renderer)
let currentLanguage = 'en';

// Loaded translations cache
const translationsCache: Record<string, TranslationData> = {};

/**
 * Get the path to locale files
 */
function getLocalesPath(): string {
  if (app.isPackaged) {
    // In packaged app, locales are in resources
    return join(process.resourcesPath, 'app.asar', 'out', 'renderer', 'locales');
  }
  // In development, use source path
  return join(__dirname, '..', '..', 'shared', 'i18n', 'locales');
}

/**
 * Load a translation namespace for a language
 */
function loadNamespace(lang: string, namespace: string): TranslationData {
  const cacheKey = `${lang}:${namespace}`;

  if (translationsCache[cacheKey]) {
    return translationsCache[cacheKey];
  }

  try {
    const localesPath = getLocalesPath();
    const filePath = join(localesPath, lang, `${namespace}.json`);
    const content = readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(content) as TranslationData;
    translationsCache[cacheKey] = translations;
    return translations;
  } catch (error) {
    console.warn(`[MainI18n] Failed to load ${lang}/${namespace}.json:`, error);
    // Fallback to English if the requested language fails
    if (lang !== 'en') {
      return loadNamespace('en', namespace);
    }
    return {};
  }
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(obj: TranslationData, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Interpolate values into a translation string
 * Supports {{key}} syntax like i18next
 */
function interpolate(text: string, values?: InterpolationValues): string {
  if (!values) return text;

  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = values[key];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}

/**
 * Translate a key with optional interpolation
 *
 * @param key - Translation key in format "namespace.path.to.key" or "namespace:path.to.key"
 * @param values - Optional interpolation values
 * @returns Translated string or the key if not found
 *
 * @example
 * t('agentMessages.discoveringContext')
 * t('agentMessages.workingOnSubtask', { subtask: '1/3' })
 */
export function t(key: string, values?: InterpolationValues): string {
  // Parse namespace and key path
  // Support both "namespace.key" and "namespace:key" formats
  let namespace: string;
  let keyPath: string;

  const colonIndex = key.indexOf(':');
  if (colonIndex > 0) {
    namespace = key.substring(0, colonIndex);
    keyPath = key.substring(colonIndex + 1);
  } else {
    const dotIndex = key.indexOf('.');
    if (dotIndex > 0) {
      namespace = key.substring(0, dotIndex);
      keyPath = key.substring(dotIndex + 1);
    } else {
      // No namespace specified, use default
      namespace = 'common';
      keyPath = key;
    }
  }

  const translations = loadNamespace(currentLanguage, namespace);
  const text = getNestedValue(translations, keyPath);

  if (text) {
    return interpolate(text, values);
  }

  // Fallback to English if current language doesn't have the key
  if (currentLanguage !== 'en') {
    const enTranslations = loadNamespace('en', namespace);
    const enText = getNestedValue(enTranslations, keyPath);
    if (enText) {
      return interpolate(enText, values);
    }
  }

  // Return the key if translation not found
  console.warn(`[MainI18n] Translation not found: ${key}`);
  return key;
}

/**
 * Set the current language
 * Called from IPC when renderer settings change
 */
export function setLanguage(lang: string): void {
  if (lang !== currentLanguage) {
    console.log(`[MainI18n] Language changed: ${currentLanguage} -> ${lang}`);
    currentLanguage = lang;
  }
}

/**
 * Get the current language
 */
export function getLanguage(): string {
  return currentLanguage;
}

/**
 * Clear the translations cache
 * Useful for development/hot reload
 */
export function clearCache(): void {
  Object.keys(translationsCache).forEach((key) => {
    delete translationsCache[key];
  });
}

export default { t, setLanguage, getLanguage, clearCache };
