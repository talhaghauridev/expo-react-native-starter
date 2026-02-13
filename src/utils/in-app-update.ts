import { IS_ANDROID } from '@/constants/environment';
import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';

const inAppUpdates = new SpInAppUpdates(false);

export const checkForUpdate = async () => {
  try {
    const result = await inAppUpdates.checkNeedsUpdate();

    if (result.shouldUpdate) {
      const updateOptions = IS_ANDROID
        ? { updateType: IAUUpdateKind.IMMEDIATE }
        : {
            title: 'Update Available',
            message: 'Please update to continue',
            buttonUpgradeText: 'Update',
            buttonCancelText: 'Later',
          };

      inAppUpdates.startUpdate(updateOptions);
    }
  } catch (error) {
    console.log('Update check failed:', error);
  }
};
