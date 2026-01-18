import { IPC_CHANNELS } from '../../shared/constants';
import type { IPCResult } from '../../shared/types';
import { invokeIpc } from './modules/ipc-utils';

/**
 * Simplified App Update API
 * Manual file-based updates only
 */
export interface AppUpdateAPI {
  getAppVersion: () => Promise<string>;
  updateFromFile: () => Promise<IPCResult>;
}

/**
 * Creates the App Update API implementation
 */
export const createAppUpdateAPI = (): AppUpdateAPI => ({
  getAppVersion: (): Promise<string> =>
    invokeIpc(IPC_CHANNELS.APP_UPDATE_GET_VERSION),

  updateFromFile: (): Promise<IPCResult> =>
    invokeIpc(IPC_CHANNELS.APP_UPDATE_FROM_FILE)
});
