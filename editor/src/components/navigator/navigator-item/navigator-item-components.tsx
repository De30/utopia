/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react'
import React from 'react'
import { ElementPath } from '../../../core/shared/project-file-types'
import { EditorDispatch } from '../../editor/action-types'
import * as EditorActions from '../../editor/actions/action-creators'
import * as EP from '../../../core/shared/element-path'
import * as PP from '../../../core/shared/property-path'
import { useColorTheme, Button, Icons, SectionActionSheet } from '../../../uuiui'
import { emptyComments, jsxAttributeValue } from '../../../core/shared/element-template'

interface NavigatorHintProps {
  shouldBeShown: boolean
  getMarginForHint: () => number
}

export const NavigatorHintTop: React.FunctionComponent<
  React.PropsWithChildren<NavigatorHintProps>
> = React.memo((props) => {
  const colorTheme = useColorTheme()
  if (props.shouldBeShown) {
    return (
      <div
        style={{
          marginLeft: props.getMarginForHint(),
          backgroundColor: colorTheme.navigatorResizeHintBorder.value,
          height: 2,
          position: 'absolute',
          top: 0,
          width: '100%',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      />
    )
  } else {
    return null
  }
})

export const NavigatorHintBottom: React.FunctionComponent<
  React.PropsWithChildren<NavigatorHintProps>
> = React.memo((props) => {
  const colorTheme = useColorTheme()
  if (props.shouldBeShown) {
    return (
      <div
        style={{
          marginLeft: props.getMarginForHint(),
          backgroundColor: colorTheme.navigatorResizeHintBorder.value,
          height: 2,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      />
    )
  } else {
    return null
  }
})

interface VisiblityIndicatorProps {
  shouldShow: boolean
  visibilityEnabled: boolean
  selected: boolean
  onClick: () => void
}

export const VisibilityIndicator: React.FunctionComponent<
  React.PropsWithChildren<VisiblityIndicatorProps>
> = React.memo((props) => {
  const color = props.selected ? 'on-highlight-main' : 'subdued'

  return (
    <Button
      onClick={props.onClick}
      style={{
        marginRight: 4,
        height: 18,
        width: 18,
        opacity: props.shouldShow ? 1 : 0,
      }}
    >
      {props.visibilityEnabled ? (
        <Icons.EyeOpen color={color} style={{ transform: 'scale(.85)' }} />
      ) : (
        <Icons.EyeStrikethrough color={color} />
      )}
    </Button>
  )
})

interface FocusIndicatorProps {
  explicitlyFocused: boolean | undefined
  selected: boolean
  onClick: () => void
}

export const FocusIndicator: React.FunctionComponent<React.PropsWithChildren<FocusIndicatorProps>> =
  React.memo((props) => {
    const color = props.selected ? 'on-highlight-main' : 'secondary'

    return (
      <Button
        onClick={props.onClick}
        style={{
          marginRight: 4,
          height: 18,
          width: 18,
        }}
      >
        {props.explicitlyFocused ? (
          <Icons.EditPencil color={color} />
        ) : props.explicitlyFocused == undefined ? (
          <Icons.Smiangle color={color} style={{ transform: 'scale(.85)' }} />
        ) : (
          <Icons.Cross color={color} />
        )}
      </Button>
    )
  })

interface OriginalComponentNameLabelProps {
  selected: boolean
  instanceOriginalComponentName: string | null
}

export const OriginalComponentNameLabel: React.FunctionComponent<
  React.PropsWithChildren<OriginalComponentNameLabelProps>
> = React.memo((props) => {
  const colorTheme = useColorTheme()
  return (
    <div
      style={{
        fontStyle: 'normal',
        paddingRight: 4,
        paddingLeft: 4,
        fontSize: 10,
        color: props.selected ? colorTheme.white.value : colorTheme.navigatorComponentName.value,
        display: props.instanceOriginalComponentName == null ? 'none' : undefined,
      }}
    >
      {props.instanceOriginalComponentName}
    </div>
  )
})

interface NavigatorItemActionSheetProps {
  selected: boolean
  highlighted: boolean
  elementPath: ElementPath
  isVisibleOnCanvas: boolean // TODO FIXME bad name, also, use state
  explicitlyFocused: boolean | undefined
  instanceOriginalComponentName: string | null
  dispatch: EditorDispatch
}

export const NavigatorItemActionSheet: React.FunctionComponent<
  React.PropsWithChildren<NavigatorItemActionSheetProps>
> = React.memo((props) => {
  const { elementPath, dispatch } = props

  const toggleHidden = React.useCallback(() => {
    dispatch([EditorActions.toggleHidden([elementPath])], 'everyone')
  }, [dispatch, elementPath])

  const toggleFocused = React.useCallback(() => {
    const nextValue =
      props.explicitlyFocused == undefined ? true : props.explicitlyFocused ? false : undefined
    dispatch(
      [
        EditorActions.setProp_UNSAFE(
          elementPath,
          PP.create(['data-focused']),
          jsxAttributeValue(nextValue, emptyComments),
        ),
      ],
      'everyone',
    )
  }, [dispatch, props.explicitlyFocused, elementPath])

  return (
    <SectionActionSheet>
      <OriginalComponentNameLabel
        selected={props.selected}
        instanceOriginalComponentName={props.instanceOriginalComponentName}
      />
      <VisibilityIndicator
        key={`visibility-indicator-${EP.toVarSafeComponentId(elementPath)}`}
        shouldShow={props.highlighted || props.selected || !props.isVisibleOnCanvas}
        visibilityEnabled={props.isVisibleOnCanvas}
        selected={props.selected}
        onClick={toggleHidden}
      />
      <FocusIndicator
        key={`focus-indicator-${EP.toVarSafeComponentId(elementPath)}`}
        explicitlyFocused={props.explicitlyFocused}
        selected={props.selected}
        onClick={toggleFocused}
      />
    </SectionActionSheet>
  )
})
