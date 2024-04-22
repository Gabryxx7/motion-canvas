import { ModuleShortcuts } from '../../contexts';
import { KeyCodes } from '@motion-canvas/core';
import { UIAction } from '../../contexts';

export enum PresentationActions {
   NEXT_SLIDE,
   TO_LAST_SLIDE,
   PREV_SLIDE,
   TO_FIRST_SLIDE,
   TOGGLE_FULLSCREEN,
   RESUME,
   SHOW_OVERLAY,
   TOGGLE_PRESENT_MODE,
}

export type PresentationKeybindingsType = Record<keyof typeof PresentationActions, UIAction> | ModuleShortcuts
export const PresentationKeybindings: PresentationKeybindingsType = {
   NEXT_SLIDE: new UIAction(
      'Next slide', [KeyCodes.UP_ARROW]
   ),
   TO_LAST_SLIDE: new UIAction(
      'To Last Slide', [KeyCodes.UP_ARROW.modifier(KeyCodes.SHIFT)]
   ),
   PREV_SLIDE: new UIAction(
      'Previous slide', [KeyCodes.DOWN_ARROW, KeyCodes.LEFT_ARROW]
   ),
   TO_FIRST_SLIDE: new UIAction(
      'To First Slide', [KeyCodes.DOWN_ARROW.modifier(KeyCodes.SHIFT)]
   ),
   TOGGLE_FULLSCREEN: new UIAction(
      'Toggle Fullscreen', [KeyCodes.KEY_F]
   ),
   RESUME: new UIAction(
      'Resume', [KeyCodes.SPACEBAR, KeyCodes.RIGHT_ARROW]
   ),
   SHOW_OVERLAY: new UIAction(
      'Show Overlay', [KeyCodes.ESCAPE, KeyCodes.KEY_Q]
   ),
   TOGGLE_PRESENT_MODE: new UIAction(
      'Toggle Presentation Mode', [KeyCodes.KEY_P]
   ),
}

