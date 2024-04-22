import clsx from 'clsx';
import { useMemo, useRef } from 'preact/hooks';
import { ViewportProvider, ViewportState, useApplication } from '../../contexts';
import { useRenderingSettings, useSharedSettings, useSize } from '../../hooks';
import { StageView } from '../viewport';
import { OverlayCanvas } from '../viewport/OverlayCanvas';
import styles from '../viewport/Viewport.module.scss';
import { PresentationControls } from './PresentationControls';
import { useLayoutEffect, useRef, Ref, useState } from 'preact/hooks';
import { SlideGraph } from './SlideGraph';
import { useShortcuts } from '../../contexts';
import { ModuleType, Modules } from '@motion-canvas/core';

export function PresentationMode() {
  const { plugins, presenter } = useApplication();
  const ref = useRef<HTMLDivElement>();
  const size = useSize(ref);
  const settings = useSharedSettings();
  const [keyPressed, setKeyPressed] = useState(null);
  const { resolutionScale } = useRenderingSettings();

  const drawHooks = useMemo(
    () =>
      plugins.map(plugin => plugin.presenterOverlay?.drawHook).filter(Boolean),
    [plugins],
  );

  const state: ViewportState = useMemo(() => {
    const state = {
      grid: false,
      rect: size,
      zoom: 1,
      x: 0,
      y: 0,
      resolutionScale,
    };

    const physicalSize = settings.size.scale(resolutionScale);
    if (physicalSize.width > size.width || physicalSize.height > size.height) {
      let newZoom = size.height / physicalSize.height;
      if (physicalSize.width * newZoom > size.width) {
        newZoom = size.width / physicalSize.width;
      }
      if (!isNaN(newZoom) && newZoom > 0 && newZoom < Infinity) {
        state.zoom = newZoom;
      }
    }
    state.zoom *= resolutionScale;

    return state;
  }, [settings, size, resolutionScale]);

  return (
    <ViewportProvider value={state}>
      <StageView
        forwardRef={ref}
        stage={presenter.stage}
        className={clsx(styles.viewport, styles.renderingPreview)}
      />
      <OverlayCanvas
        drawHooks={drawHooks}
        width={size.width}
        height={size.height}
      />
      <CustomStage forwardRef={ref} keyPressed={keyPressed} stage={presenter.stage} />
      <SlideGraph />
      <PresentationControls onKeyPressed={(key) => setKeyPressed(key)} customStage={ref} />
      {/* <PresentationControls /> */}
    </ViewportProvider>
  );
}
