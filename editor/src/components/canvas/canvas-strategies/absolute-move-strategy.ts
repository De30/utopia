import { MetadataUtils } from '../../../core/model/element-metadata-utils'
import { toString } from '../../../core/shared/element-path'
import { ElementInstanceMetadataMap } from '../../../core/shared/element-template'
import { CanvasPoint, offsetPoint } from '../../../core/shared/math-utils'
import { ElementPath } from '../../../core/shared/project-file-types'
import { keepDeepReferenceEqualityIfPossible } from '../../../utils/react-performance'
import { withUnderlyingTarget } from '../../editor/store/editor-state'
import { setSnappingGuidelines } from '../commands/set-snapping-guidelines-command'
import { updateHighlightedViews } from '../commands/update-highlighted-views-command'
import { wildcardPatch } from '../commands/wildcard-patch-command'
import { runLegacyAbsoluteMoveSnapping } from '../controls/guideline-helpers'
import { determineConstrainedDragAxis } from '../controls/select-mode/move-utils'
import { ConstrainedDragAxis, GuidelineWithSnappingVector } from '../guideline'
import { CanvasStrategy } from './canvas-strategy-types'
import {
  getAbsoluteMoveCommandsForSelectedElement,
  getDragTargets,
  getMultiselectBounds,
} from './shared-absolute-move-strategy-helpers'

let elementsToRerender: Array<ElementPath> | 'rerender-all-elements'

export const absoluteMoveStrategy: CanvasStrategy = {
  id: 'ABSOLUTE_MOVE',
  name: 'Absolute Move',
  isApplicable: (canvasState, _interactionState, metadata) => {
    if (canvasState.selectedElements.length > 0) {
      const filteredSelectedElements = getDragTargets(canvasState.selectedElements)
      return filteredSelectedElements.every((element) => {
        const elementMetadata = MetadataUtils.findElementByElementPath(metadata, element)

        return elementMetadata?.specialSizeMeasurements.position === 'absolute'
      })
    } else {
      return false
    }
  },
  controlsToRender: [], // Uses existing hooks in select-mode-hooks.tsx
  fitness: (canvasState, interactionState, sessionState) => {
    return absoluteMoveStrategy.isApplicable(
      canvasState,
      interactionState,
      sessionState.startingMetadata,
    ) &&
      interactionState.interactionData.type === 'DRAG' &&
      interactionState.activeControl.type === 'BOUNDING_AREA'
      ? 1
      : 0
  },
  apply: (canvasState, interactionState, sessionState) => {
    if (
      interactionState.interactionData.type === 'DRAG' &&
      interactionState.interactionData.drag != null
    ) {
      const filteredSelectedElements = getDragTargets(canvasState.selectedElements)
      const drag = interactionState.interactionData.drag
      const shiftKeyPressed = interactionState.interactionData.modifiers.shift
      const constrainedDragAxis = shiftKeyPressed ? determineConstrainedDragAxis(drag) : null
      const { snappedDragVector, guidelinesWithSnappingVector } = snapDrag(
        drag,
        constrainedDragAxis,
        sessionState.startingMetadata,
        canvasState.selectedElements,
        canvasState.scale,
      )
      const commandsForSelectedElements = filteredSelectedElements.flatMap((selectedElement) =>
        getAbsoluteMoveCommandsForSelectedElement(
          selectedElement,
          snappedDragVector,
          canvasState,
          sessionState,
        ),
      )

      elementsToRerender = keepDeepReferenceEqualityIfPossible(elementsToRerender, [
        canvasState.selectedElements[0],
      ])

      return [
        ...commandsForSelectedElements,
        wildcardPatch('transient', {
          canvas: {
            elementsToRerender: {
              $set: elementsToRerender,
            },
          },
        }),
        updateHighlightedViews('transient', []),
        setSnappingGuidelines('transient', guidelinesWithSnappingVector),
      ]
    }
    // Fallback for when the checks above are not satisfied.
    return []
  },
}

function snapDrag(
  drag: CanvasPoint,
  constrainedDragAxis: ConstrainedDragAxis | null,
  jsxMetadata: ElementInstanceMetadataMap,
  selectedElements: Array<ElementPath>,
  canvasScale: number,
): {
  snappedDragVector: CanvasPoint
  guidelinesWithSnappingVector: Array<GuidelineWithSnappingVector>
} {
  const multiselectBounds = getMultiselectBounds(jsxMetadata, selectedElements)

  // This is the entry point to extend the list of snapping strategies, if we want to add more

  const { snappedDragVector, guidelinesWithSnappingVector } = runLegacyAbsoluteMoveSnapping(
    drag,
    constrainedDragAxis,
    jsxMetadata,
    selectedElements,
    canvasScale,
    multiselectBounds,
  )

  return { snappedDragVector, guidelinesWithSnappingVector }
}
