/**
 * App Update IPC Handlers
 *
 * Simplified handlers for manual file-based updates.
 */

import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import type { IPCResult } from '../../shared/types';
import { getCurrentVersion, updateFromFile } from '../app-updater';

/**
 * Register all app-update-related IPC handlers
 */
export function registerAppUpdateHandlers(): void {
  console.warn('[IPC] Registering app update handlers');

  /**
   * APP_UPDATE_GET_VERSION: Get current app version
   */
  ipcMain.handle(
    IPC_CHANNELS.APP_UPDATE_GET_VERSION,
    async (): Promise<string> => {
      try {
        return getCurrentVersion();
      } catch (error) {
        console.error('[app-update-handlers] Get version failed:', error);
        throw error;
      }
    }
  );

  /**
   * APP_UPDATE_FROM_FILE: Open file dialog and install from selected file
   */
  ipcMain.handle(
    IPC_CHANNELS.APP_UPDATE_FROM_FILE,
    async (): Promise<IPCResult> => {
      try {
        const result = await updateFromFile();
        return result;
      } catch (error) {
        console.error('[app-update-handlers] Update from file failed:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update from file'
        };
      }
    }
  );

  console.warn('[IPC] App update handlers registered successfully');
}
