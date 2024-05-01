import clsx from 'clsx';
import { ViewportProvider, ViewportState, useApplication } from '../../contexts';
import { useRenderingSettings, useSharedSettings, useSize } from '../../hooks';
import { StageView } from '../viewport';
import { OverlayCanvas } from '../viewport/OverlayCanvas';
import styles from '../viewport/Viewport.module.scss';
import { PresentationControls } from './PresentationControls';
import { useLayoutEffect, useRef, Ref, useState, useMemo } from 'preact/hooks';
import { SlideGraph } from './SlideGraph';
import { useShortcuts } from '../../contexts';
import { ModuleType, Modules } from '@motion-canvas/core';
import { ComponentChildren } from 'preact';
export * from "./PresentationKeybindings"

export function PresentationMode() {
  const { plugins, presenter } = useApplication();
  const ref = useRef<HTMLDivElement>();
  const size = useSize(ref);
  const settings = useSharedSettings();
  const [keyPressed, setKeyPressed] = useState(null);
  const overlayRef = useRef<HTMLDivElement>();
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
      >
        <div ref={overlayRef} className={styles.overlay}>
          {plugins.reduce((children, plugin) => {
            const Component = plugin.presenterOverlay?.component;
            return Component ? <Component>{children}</Component> : children;
          }, undefined as ComponentChildren)}
        </div>
      </StageView>
      <OverlayCanvas
        drawHooks={drawHooks}
        width={size.width}
        height={size.height}
      />
      <SlideGraph />
      <PresentationControls />
    </ViewportProvider>
  );
}
