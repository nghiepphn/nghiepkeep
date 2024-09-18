import { TokenValue } from '@lib/interfaces';
import { AppTheme } from '@lib/services/theme';

type StorageObjectMap = {
    tokenInfo: TokenValue;
    appTheme: AppTheme;
};

export type StorageObjectType = 'tokenInfo' | 'appTheme';

export type StorageObjectData<T extends StorageObjectType> = {
    type: T;
    data: StorageObjectMap[T];
};
