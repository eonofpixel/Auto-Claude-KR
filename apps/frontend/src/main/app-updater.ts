/**
 * Manual App Updater
 *
 * Simplified updater that allows users to manually select an update file.
 * No automatic updates, no GitHub integration, no beta channel.
 */

import { app, dialog, shell } from 'electron';
import type { BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;

/**
 * Initialize the app updater (minimal setup)
 */
export function initializeAppUpdater(window: BrowserWindow): void {
  mainWindow = window;
  console.warn('[app-updater] Manual updater initialized');
}

/**
 * Get current app version
 */
export function getCurrentVersion(): string {
  return app.getVersion();
}

/**
 * Stop periodic update checks (no-op for manual updater)
 * This function exists for compatibility with upstream code.
 */
export function stopPeriodicUpdates(): void {
  // No periodic updates in manual updater
}

/**
 * Open file dialog to select an update installer file
 * Then run the installer and quit the app
 */
export async function updateFromFile(): Promise<{ success: boolean; error?: string }> {
  try {
    // Platform-specific installer extensions
    const isMac = process.platform === 'darwin';
    const isWindows = process.platform === 'win32';

    const filters = [];
    if (isMac) {
      filters.push({ name: 'macOS Installer', extensions: ['dmg', 'pkg'] });
    } else if (isWindows) {
      filters.push({ name: 'Windows Installer', extensions: ['exe', 'msi'] });
    } else {
      // Linux
      filters.push({ name: 'Linux Installer', extensions: ['AppImage', 'deb', 'rpm'] });
    }
    filters.push({ name: 'All Files', extensions: ['*'] });

    const result = await dialog.showOpenDialog({
      title: isMac ? '업데이트 파일 선택' : 'Select Update File',
      filters,
      properties: ['openFile']
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: 'No file selected' };
    }

    const installerPath = result.filePaths[0];
    console.warn('[app-updater] Running installer:', installerPath);

    // Open the installer
    await shell.openPath(installerPath);

    // Quit the app to allow installation
    setTimeout(() => {
      app.quit();
    }, 500);

    return { success: true };
  } catch (error) {
    console.error('[app-updater] Failed to run installer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
