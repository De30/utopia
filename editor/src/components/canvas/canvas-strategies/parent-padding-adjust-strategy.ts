import { MetadataUtils } from '../../../core/model/element-metadata-utils'
import { safeIndex } from '../../../core/shared/array-utils'
import { emptyComments, jsxAttributeValue } from '../../../core/shared/element-template'
import { forceNotNull } from '../../../core/shared/optional-utils'
import { CanvasStrategy } from '../../../interactions_proposal'
import { stylePropPathMappingFn } from '../../inspector/common/property-path-hooks'
import { setProperty, wildcardPatch } from '../commands/commands'

export const parentPaddingAdjustStrategy: CanvasStrategy = {
  name: 'Change Parent Padding',
  isApplicable: (canvasState, interactionState) => {
    if (
      canvasState.selectedElements.length === 1 &&
      interactionState != null &&
      interactionState.interactionData.type === 'DRAG'
    ) {
      const metadata = MetadataUtils.findElementByElementPath(
        canvasState.metadata,
        canvasState.selectedElements[0],
      )

      // what if the element has margin or margin left only
      // interaction direction is also important
      if (metadata?.specialSizeMeasurements.position === 'static') {
        const parentMetadata = MetadataUtils.getParent(
          canvasState.metadata,
          canvasState.selectedElements[0],
        )
        const dragDeltaX = interactionState.interactionData.drag?.x ?? 0
        const parentPaddingTop = parentMetadata?.specialSizeMeasurements.padding.top ?? 0

        return parentPaddingTop > 0 || (parentPaddingTop === 0 && dragDeltaX > 0)
      }
    }
    return false
  },
  controlsToRender: [], // parent padding control
  fitness: (canvasState, interactionState) => {
    return parentPaddingAdjustStrategy.isApplicable(canvasState, interactionState) &&
      interactionState.interactionData.type === 'DRAG'
      ? 1
      : 0
  },
  apply: (canvasState, interactionState, sessionState) => {
    if (
      interactionState.interactionData.type === 'DRAG' &&
      interactionState.interactionData.drag != null
    ) {
      // Only looks at the first selected element.
      const targetedElement = forceNotNull(
        'Could not get first element.',
        safeIndex(canvasState.selectedElements, 0),
      )
      const targetParent = MetadataUtils.getParent(sessionState.startingMetadata, targetedElement)
      const paddingPath = stylePropPathMappingFn('padding', ['style'])
      if (targetParent !== null) {
        const paddingChange = interactionState.interactionData.drag.x
        const currentPadding = targetParent?.specialSizeMeasurements.padding.top ?? 0
        const newPadding = Math.max(currentPadding + paddingChange, 0)
        const adjustProperty = setProperty(
          'permanent',
          targetParent.elementPath,
          paddingPath,
          jsxAttributeValue(newPadding, emptyComments),
        )

        return [
          adjustProperty,
          wildcardPatch('transient', {
            highlightedViews: {
              $set: [],
            },
          }),
        ]
      }
    }

    // Fallback for when the checks above are not satisfied.
    return []
  },
}