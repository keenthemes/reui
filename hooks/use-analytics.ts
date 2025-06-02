/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';

// Main modules from /cruds folder
type ModuleType = 'user' | 'system' | 'ecommerce';

// Submodules for each main module
type UserSubModuleType = 'users' | 'roles' | 'permissions' | 'account';
type SystemSubModuleType = 'logs' | 'settings' | 'backups';
type EcommerceSubModuleType = 'products' | 'categories' | 'orders' | 'customers';

type SubModuleType = UserSubModuleType | SystemSubModuleType | EcommerceSubModuleType;

interface TrackEventProps {
  event_name: string;
  module: ModuleType;
  submodule: SubModuleType;
  item_type: string;
  item_id?: string;
  action: 'create' | 'update' | 'delete';
  delete_type?: 'soft' | 'hard';
}

export const useAnalytics = () => {
  const trackEvent = useCallback(
    ({ event_name, module, submodule, item_type, item_id, action, delete_type }: TrackEventProps) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event_name, {
          module,
          submodule,
          module_path: `${module}/${submodule}`,
          item_type,
          item_id,
          action,
          delete_type,
          category: 'crud',
          timestamp: new Date().toISOString(),
        });
      }
    },
    [],
  );

  const trackCreate = useCallback(
    (module: ModuleType, submodule: SubModuleType, itemType: string, itemId?: string) => {
      trackEvent({
        event_name: 'crud_create',
        module,
        submodule,
        item_type: itemType,
        item_id: itemId,
        action: 'create',
      });
    },
    [trackEvent],
  );

  const trackUpdate = useCallback(
    (module: ModuleType, submodule: SubModuleType, itemType: string, itemId: string) => {
      trackEvent({
        event_name: 'crud_update',
        module,
        submodule,
        item_type: itemType,
        item_id: itemId,
        action: 'update',
      });
    },
    [trackEvent],
  );

  const trackDelete = useCallback(
    (module: ModuleType, submodule: SubModuleType, itemType: string, itemId: string, isHardDelete: boolean = false) => {
      trackEvent({
        event_name: 'crud_delete',
        module,
        submodule,
        item_type: itemType,
        item_id: itemId,
        action: 'delete',
        delete_type: isHardDelete ? 'hard' : 'soft',
      });
    },
    [trackEvent],
  );

  return {
    trackCreate,
    trackUpdate,
    trackDelete,
  };
};
