import React from 'react'
import {
  FlexRow,
  H1,
  H2,
  Icons,
  InspectorSectionIcons,
  InspectorSubsectionHeader,
} from '../../../../../uuiui'
import { SeeMoreButton, SeeMoreHOC, useToggle } from '../../../widgets/see-more'
import { PaddingRow } from '../../layout-section/layout-system-subsection/layout-system-controls'
import { BlendModeRow } from './blendmode-row'
import { OpacityRow } from './opacity-row'
import { OverflowRow } from './overflow-row'
import { RadiusRow } from './radius-row'

export const ContainerSubsection = React.memo(() => {
  const [seeMoreVisible, toggleSeeMoreVisible] = useToggle(false)

  return (
    <>
      <InspectorSubsectionHeader>
        <FlexRow
          style={{
            flexGrow: 1,
            gap: 8,
          }}
        >
          <InspectorSectionIcons.Layer />
          <span>Container</span>
        </FlexRow>
        <Icons.Gear
          color={seeMoreVisible ? 'secondary' : 'subdued'}
          onClick={toggleSeeMoreVisible}
        />
      </InspectorSubsectionHeader>

      <OpacityRow />
      <OverflowRow />
      <RadiusRow />
      <PaddingRow />
      <SeeMoreHOC visible={seeMoreVisible}>
        <BlendModeRow />
      </SeeMoreHOC>
    </>
  )
})
