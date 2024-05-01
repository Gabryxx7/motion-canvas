import { Stage } from '@motion-canvas/core';
import { useEffect, useState, useRef } from 'preact/hooks';
import { useApplication } from '../../contexts';
import {
  usePreviewSettings,
  useSharedSettings,
  useSubscribable,
} from '../../hooks';
import { JSX } from 'preact';
import { StageView } from './StageView';

export function PreviewStage(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [stage] = useState(() => new Stage());
  const ref = useRef<HTMLDivElement>();
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
    ref.current?.append(stage.finalBuffer);
    return () => stage.finalBuffer.remove();
  }, []);

  return <StageView stage={stage} {...props} />;
}
