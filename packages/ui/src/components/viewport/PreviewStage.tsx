import { Stage } from '@motion-canvas/core';
import { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useApplication } from '../../contexts';
import {
  usePreviewSettings,
  useSharedSettings,
  useSubscribable,
} from '../../hooks';
import { JSX } from 'preact';
import { CustomStageOverlay } from './CustomStageOverlay'
import { StageView } from './StageView';

export function PreviewStage(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [stage] = useState(() => new Stage());
  const { player } = useApplication();
  const { size, background } = useSharedSettings();
  const { resolutionScale } = usePreviewSettings();

  useSubscribable(
    player.onRender,
    async () => {
      await stage.render(
        player.playback.currentScene,
        player.playback.previousScene,
      );
    },
    [],
  );

  useEffect(() => {
    stage.configure({ resolutionScale, size, background });
    player.requestRender();
  }, [resolutionScale, size, background, player]);

  useEffect(() => {
    ref.current.append(stage.finalBuffer);
    return () => stage.finalBuffer.remove();
  }, []);

  return <div ref={ref} {...props} >
    <CustomStageOverlay
      style={{
        aspectRatio: 'unset',
        width: '100%',
        height: '100%'
      }}
      isPlayer={true} />
  </div>;
  // return <StageView stage={stage} {...props} />;
}
