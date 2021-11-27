import { MetaReducer } from '@ngrx/store';
import { storageSyncReducer } from '../storage-sync.reducer';

export const metaReducers: MetaReducer<any>[] = [storageSyncReducer];
