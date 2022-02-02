import { Resizable, ResizeCallback, ResizeDirection } from 're-resizable'
import React from 'react'
import { FancyError, RuntimeErrorInfo } from '../../core/shared/code-exec-utils'
import * as EditorActions from '../editor/actions/action-creators'

import {
  ConsoleLog,
  LeftPaneDefaultWidth,
  RightMenuTab,
  NavigatorWidthAtom,
} from '../editor/store/editor-state'

import { useEditorState } from '../editor/store/store-hook'
import { InspectorEntryPoint } from '../inspector/inspector'
import { CanvasWrapperComponent } from './canvas-wrapper-component'
import { InsertMenuPane } from '../navigator/left-pane'

import { CodeEditorWrapper } from '../code-editor/code-editor-container'
import { NavigatorComponent } from '../navigator/navigator'
import {
  SimpleFlexRow,
  UtopiaTheme,
  UtopiaStyles,
  SimpleFlexColumn,
  background,
  useColorTheme,
  Icons,
  LargerIcons,
  ResizableFlexColumn,
} from '../../uuiui'
import { TopMenu } from '../editor/top-menu'
import { ConsoleAndErrorsPane } from '../code-editor/console-and-errors-pane'
import { FloatingInsertMenu } from './ui/floating-insert-menu'
import { usePubSubAtom } from '../../core/shared/atom-with-pub-sub'
import CanvasActions from './canvas-actions'
import { canvasPoint } from '../../core/shared/math-utils'
import { InspectorWidthAtom } from '../inspector/common/inspector-atoms'
import { useAtom } from 'jotai'

interface NumberSize {
  width: number
  height: number
}

const TopMenuHeight = 35
// height so that the bottom border on the top menu aligns
// with the top border of the first inspector section

const NothingOpenCard = React.memo(() => {
  const colorTheme = useColorTheme()
  const dispatch = useEditorState((store) => store.dispatch, 'NothingOpenCard dispatch')
  const handleOpenCanvasClick = React.useCallback(() => {
    dispatch([EditorActions.setPanelVisibility('canvas', true)])
  }, [dispatch])
  const handleOpenCodeEditorClick = React.useCallback(() => {
    dispatch([EditorActions.setPanelVisibility('codeEditor', true)])
  }, [dispatch])
  const handleOpenBothCodeEditorAndDesignToolClick = React.useCallback(() => {
    dispatch([
      EditorActions.setPanelVisibility('codeEditor', true),
      EditorActions.setPanelVisibility('canvas', true),
    ])
  }, [dispatch])

  return (
    <div
      role='card'
      style={{
        width: 180,
        height: 240,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 4,
        backgroundColor: 'white',
        border: '1px solid lightgrey',
      }}
    >
      <LargerIcons.PixelatedPalm
        color='primary'
        style={{ width: 42, height: 42, imageRendering: 'pixelated' }}
      />
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontWeight: 600, fontSize: 11 }}>Get Started</h3>
        <p style={{ lineHeight: '1.7em', whiteSpace: 'normal' }}>
          Start building with the &nbsp;
          <span
            role='button'
            style={{ cursor: 'pointer', color: colorTheme.primary.value }}
            onClick={handleOpenCanvasClick}
          >
            canvas
          </span>
          ,&nbsp;
          <span
            role='button'
            style={{ cursor: 'pointer', color: colorTheme.primary.value }}
            onClick={handleOpenCodeEditorClick}
          >
            code editor
          </span>
          ,&nbsp; or{' '}
          <span
            role='button'
            style={{ cursor: 'pointer', color: colorTheme.primary.value }}
            onClick={handleOpenBothCodeEditorAndDesignToolClick}
          >
            both
          </span>
          .
        </p>
      </div>
    </div>
  )
})

const DesignPanelRootInner = React.memo(() => {
  const dispatch = useEditorState((store) => store.dispatch, 'DesignPanelRoot dispatch')
  const interfaceDesigner = useEditorState(
    (store) => store.editor.interfaceDesigner,
    'DesignPanelRoot interfaceDesigner',
  )

  const colorTheme = useColorTheme()
  const [codeEditorResizingWidth, setCodeEditorResizingWidth] = React.useState<number | null>(
    interfaceDesigner.codePaneWidth,
  )
  const navigatorVisible = useEditorState(
    (store) => !store.editor.navigator.minimised,
    'DesignPanelRoot navigatorVisible',
  )

  const isRightMenuExpanded = useEditorState(
    (store) => store.editor.rightMenu.expanded,
    'DesignPanelRoot isRightMenuExpanded',
  )

  const rightMenuSelectedTab = useEditorState(
    (store) => store.editor.rightMenu.selectedTab,
    'DesignPanelRoot rightMenuSelectedTab',
  )

  const leftMenuExpanded = useEditorState(
    (store) => store.editor.leftMenu.expanded,
    'EditorComponentInner leftMenuExpanded',
  )

  const isCanvasVisible = useEditorState(
    (store) => store.editor.canvas.visible,
    'design panel root',
  )

  const isInsertMenuSelected = rightMenuSelectedTab === RightMenuTab.Insert

  const updateDeltaWidth = React.useCallback(
    (deltaWidth: number) => {
      dispatch([EditorActions.resizeInterfaceDesignerCodePane(deltaWidth)])
    },
    [dispatch],
  )

  const onResizeStop = React.useCallback(
    (
      event: MouseEvent | TouchEvent,
      direction: ResizeDirection,
      elementRef: HTMLElement,
      delta: NumberSize,
    ) => {
      updateDeltaWidth(delta.width)
    },
    [updateDeltaWidth],
  )

  const onResize = React.useCallback(
    (
      event: MouseEvent | TouchEvent,
      direction: ResizeDirection,
      elementRef: HTMLElement,
      delta: NumberSize,
    ) => {
      if (navigatorVisible) {
        setCodeEditorResizingWidth(interfaceDesigner.codePaneWidth + delta.width)
      }
    },
    [interfaceDesigner, navigatorVisible],
  )

  const [navigatorWidth, setNavigatorWidth] = usePubSubAtom(NavigatorWidthAtom)

  const onNavigatorResizeStop = React.useCallback<ResizeCallback>(
    (_event, _direction, _ref, delta) => {
      setNavigatorWidth((currentWidth) => currentWidth + delta.width)
      dispatch([CanvasActions.scrollCanvas(canvasPoint({ x: -delta.width, y: 0 }))])
    },
    [setNavigatorWidth, dispatch],
  )

  return (
    <>
      <SimpleFlexRow
        className='CanvasCodeRow'
        style={{
          position: 'relative',
          flexDirection: 'row',
          alignItems: 'stretch',
          overflowX: 'hidden',
          flexGrow: 1,
          flexShrink: 0,
        }}
      >
        {!isCanvasVisible && !interfaceDesigner.codePaneVisible ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NothingOpenCard />
          </div>
        ) : null}
        <SimpleFlexColumn style={{ flexGrow: isCanvasVisible ? undefined : 1 }}>
          <Resizable
            defaultSize={{
              width: isCanvasVisible ? interfaceDesigner.codePaneWidth : '100%',
              height: '100%',
            }}
            size={{
              width: isCanvasVisible ? interfaceDesigner.codePaneWidth : '100%',
              height: '100%',
            }}
            onResizeStop={onResizeStop}
            onResize={onResize}
            enable={{
              top: false,
              right: isCanvasVisible,
              bottom: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            className='resizableFlexColumnCanvasCode'
            style={{
              ...UtopiaStyles.flexColumn,
              display: interfaceDesigner.codePaneVisible ? 'flex' : 'none',
              width: isCanvasVisible ? undefined : interfaceDesigner.codePaneWidth,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              justifyContent: 'stretch',
              alignItems: 'stretch',
              borderLeft: `1px solid ${colorTheme.subduedBorder.value}`,
            }}
          >
            <CodeEditorWrapper />
            <ConsoleAndErrorsPane />
          </Resizable>
        </SimpleFlexColumn>

        {isCanvasVisible ? (
          <SimpleFlexColumn
            style={{
              flexGrow: 1,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <SimpleFlexRow
              className='topMenu'
              style={{
                minHeight: TopMenuHeight,
                height: TopMenuHeight,
                borderBottom: `1px solid ${colorTheme.border0.value}`,
                alignItems: 'stretch',
                justifyContent: 'stretch',
                backgroundColor: 'transparent',
              }}
            >
              <TopMenu />
            </SimpleFlexRow>

            {isCanvasVisible && navigatorVisible ? (
              <div
                style={{
                  height: `calc(100% - ${TopMenuHeight}px)`,
                  position: 'absolute',
                  top: TopMenuHeight,
                  left: 0,
                  zIndex: 20,
                  overflow: 'hidden',
                }}
              >
                <ResizableFlexColumn
                  style={{
                    overscrollBehavior: 'contain',
                    backgroundColor: UtopiaTheme.color.bg0.o(90).value,
                    backdropFilter: 'blur(7px)',
                  }}
                  onResizeStop={onNavigatorResizeStop}
                  defaultSize={{
                    width: navigatorWidth,
                    height: '100%',
                  }}
                >
                  <NavigatorComponent />
                </ResizableFlexColumn>
              </div>
            ) : null}
            <CanvasWrapperComponent />
            <FloatingInsertMenu />
          </SimpleFlexColumn>
        ) : null}
      </SimpleFlexRow>

      {isCanvasVisible ? (
        <>
          {isRightMenuExpanded ? (
            <ResizableInspectorPane isInsertMenuSelected={isInsertMenuSelected} />
          ) : null}
        </>
      ) : null}
    </>
  )
})

export const DesignPanelRoot = React.memo(() => {
  const roundedCanvasOffset = useEditorState(
    (store) => store.editor.canvas.roundedCanvasOffset,
    'DesignPanelRoot roundedCanvasOffset',
  )

  const { zoom, scale } = useEditorState((store) => {
    const canvasScale = store.editor.canvas.scale
    // this is made to match the zoom and scale used in #canvas-container-outer
    return { zoom: Math.max(1, canvasScale), scale: Math.min(1, canvasScale) }
  }, 'DesignPanelRoot zoom scale')

  return (
    <>
      <style>{`
      .utopia-css-var-container {
        --utopia-canvas-offset-x: ${roundedCanvasOffset.x}px;
        --utopia-canvas-offset-y: ${roundedCanvasOffset.y}px;
        --utopia-canvas-zoom: ${zoom};
        --utopia-canvas-transform-scale: ${scale};
      }
    `}</style>
      <SimpleFlexRow
        className='OpenFileEditorShell utopia-css-var-container'
        style={{
          position: 'relative',
          flexGrow: 1,
          alignItems: 'stretch',
          overflowX: 'hidden',
        }}
      >
        <DesignPanelRootInner />
      </SimpleFlexRow>
    </>
  )
})
DesignPanelRoot.displayName = 'DesignPanelRoot'

interface ResizableInspectorPaneProps {
  isInsertMenuSelected: boolean
}
const ResizableInspectorPane = React.memo<ResizableInspectorPaneProps>((props) => {
  const colorTheme = useColorTheme()
  const [, updateInspectorWidth] = useAtom(InspectorWidthAtom)

  const resizableRef = React.useRef<Resizable>(null)
  const [width, setWidth] = React.useState<number>(UtopiaTheme.layout.inspectorSmallWidth)

  const onResize = React.useCallback(() => {
    const newWidth = resizableRef.current?.size.width
    if (newWidth != null) {
      // we have to use the instance ref to directly access the get size() getter, because re-resize's API only wants to tell us deltas, but we need the snapped width
      setWidth(newWidth)
      updateInspectorWidth(newWidth > UtopiaTheme.layout.inspectorSmallWidth ? 'wide' : 'regular')
    }
  }, [updateInspectorWidth])

  return (
    <Resizable
      ref={resizableRef}
      defaultSize={{
        width: UtopiaTheme.layout.inspectorSmallWidth,
        height: '100%',
      }}
      size={{
        width: width,
        height: '100%',
      }}
      style={{ transition: 'width 100ms ease-in-out' }}
      snap={{
        x: [UtopiaTheme.layout.inspectorSmallWidth, UtopiaTheme.layout.inspectorLargeWidth],
      }}
      onResizeStart={onResize}
      onResize={onResize}
      onResizeStop={onResize}
    >
      <SimpleFlexRow
        className='Inspector-entrypoint'
        style={{
          alignItems: 'stretch',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          backgroundColor: colorTheme.inspectorBackground.value,
          flexGrow: 0,
          flexShrink: 0,
          paddingBottom: 100,
        }}
      >
        {props.isInsertMenuSelected ? <InsertMenuPane /> : <InspectorEntryPoint />}
      </SimpleFlexRow>
    </Resizable>
  )
})
