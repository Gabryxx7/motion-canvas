import {useEffect, useState, useCallback } from 'preact/hooks';
import {useDocumentEvent} from './useDocumentEvent';
import { Action, KeyCode, KeyBindingMapping } from '@motion-canvas/core';

export declare type KeyDownCallbackType = (...args: any) => void;
export function useKeyDown(key: KeyCode, callback?: KeyDownCallbackType, actionName?: string) {
  const [isDown, setDown] = useState(false);

  useDocumentEvent(
    'keydown',
      useCallback(event => {
        if (document.activeElement.tagName === 'INPUT') {
          return;
        }
        if (event.key === key.code) {
          event.preventDefault();
          setDown(true);
          callback && callback(event);
        }
      }, [key])
    )

  return isDown;
}
