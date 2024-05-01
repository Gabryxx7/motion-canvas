import styles from './PresentationControls.module.scss';

import { useDocumentEvent, useKeyDown, useSubscribableValue } from '../../hooks';
import { useCallback, Ref, StateUpdater, useEffect } from 'preact/hooks';
import { useApplication, useShortcuts } from '../../contexts';
import { IconButton } from '../controls';
import {
  Close,
  Fullscreen,
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from '../icons';

export function PresentationControls() {
  const { presenter, project } = useApplication();
  // const {moduleShortcuts} : {moduleShortcuts: PresentationKeybindingsType} = useShortcuts();
  const state = useSubscribableValue(presenter.onStateChanged);
  const status = useSubscribableValue(presenter.onInfoChanged);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      presenter.stage.finalBuffer.requestFullscreen();
    }
  };


  useDocumentEvent(
    'mousedown',
    useCallback(
      event => {
        event.preventDefault();
        presenter.resume();
      },
      [presenter],
    ),
  );

  return (
    <div className={styles.controls}>
      <div className={styles.count}>
        [
        {((status.index ?? 0) + 1)
          .toString()
          .padStart(status.count.toString().length, '0')}
        /{status.count}]
      </div>
      {!project.variables?.startFullscreen &&
        <IconButton title="Go back to editing" onClick={() => presenter.abort()}>
          <Close />
        </IconButton>
      }
      <IconButton
        title="Previous slide [Left arrow]"
        onClick={() => presenter.requestPreviousSlide()}
        disabled={!status.hasPrevious}
      >
        <SkipPrevious />
      </IconButton>
      <IconButton
        title="Resume [Space]"
        onClick={() => presenter.resume()}
        disabled={!status.isWaiting}
      >
        {status.isWaiting ? <PlayArrow /> : <Pause />}
      </IconButton>
      <IconButton
        title="Next slide [Right arrow]"
        onClick={() => presenter.requestNextSlide()}
        disabled={!status.hasNext}
      >
        <SkipNext />
      </IconButton>
      <IconButton title="Enter fullscreen [F]" onClick={toggleFullscreen}>
        <Fullscreen />
      </IconButton>
    </div>
  );
}
