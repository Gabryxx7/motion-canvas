import { useKeyDown } from './useKeyDown';
import { Action, UIAction } from '@motion-canvas/core';

export declare type KeyActionCallbackType = (...args: any) => void;
export function useAction(action: Action, callback?: KeyActionCallbackType) {
   return action.keys.map(key => useKeyDown(key, callback))
}