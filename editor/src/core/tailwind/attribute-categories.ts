export type AttributeCategory =
  | 'animation'
  | 'aural'
  | 'background'
  | 'border'
  | 'container'
  | 'esoteric'
  | 'layout-self'
  | 'layout-system'
  | 'meta'
  | 'transform'
  | 'typographic'
  | 'shadow'

export const AttributeCategories: { [attribute: string]: Array<AttributeCategory> } = {
  '-moz-osx-font-smoothing': [],
  '-webkit-appearance': [],
  '-webkit-backdrop-filter': [],
  '-webkit-background-clip': [],
  '-webkit-box-decoration-break': [],
  '-webkit-font-smoothing': [],
  '-webkit-user-select': [],
  'align-content': ['layout-system'],
  'align-items': ['layout-system'],
  'align-self': ['layout-self'],
  all: ['meta'],
  animation: ['animation'],
  'animation-delay': ['animation'],
  'animation-direction': ['animation'],
  'animation-duration': ['animation'],
  'animation-fill-mode': ['animation'],
  'animation-iteration-count': ['animation'],
  'animation-name': ['animation'],
  'animation-play-state': ['animation'],
  'animation-timing-function': ['animation'],
  appearance: [],
  azimuth: ['aural'],
  'backdrop-filter': [],
  'backface-visibility': ['background'],
  background: ['background'],
  'background-attachment': ['background'],
  'background-blend-mode': ['background'],
  'background-clip': ['background'],
  'background-color': ['background'],
  'background-image': ['background'],
  'background-origin': ['background'],
  'background-position': ['background'],
  'background-repeat': ['background'],
  'background-size': ['background'],
  bleed: ['esoteric'],
  border: ['border'],
  'border-bottom-color': ['border'],
  'border-bottom-left-radius': ['border'],
  'border-bottom-right-radius': ['border'],
  'border-bottom-style': ['border'],
  'border-bottom-width': ['border'],
  'border-bottom': ['border'],
  'border-collapse': ['border'],
  'border-color': ['border'],
  'border-image': ['border'],
  'border-image-outset': ['border'],
  'border-image-repeat': ['border'],
  'border-image-source': ['border'],
  'border-image-slice': ['border'],
  'border-image-width': ['border'],
  'border-left-color': ['border'],
  'border-left-style': ['border'],
  'border-left-width': ['border'],
  'border-left': ['border'],
  'border-radius': ['border'],
  'border-right-color': ['border'],
  'border-right-style': ['border'],
  'border-right-width': ['border'],
  'border-right': ['border'],
  'border-spacing': ['border'],
  'border-style': ['border'],
  'border-top-color': ['border'],
  'border-top-left-radius': ['border'],
  'border-top-right-radius': ['border'],
  'border-top-style': ['border'],
  'border-top-width': ['border'],
  'border-top': ['border'],
  'border-width': ['border'],
  bottom: ['layout-self'],
  'box-decoration-break': ['border'],
  'box-shadow': ['shadow'],
  'box-sizing': ['container', 'layout-system'],
  'break-after': ['esoteric'],
  'break-before': ['esoteric'],
  'break-inside': ['esoteric'],
  'caption-side': ['esoteric'],
  'caret-color': ['typographic'],
  clear: ['layout-self'],
  clip: ['container'],
  color: ['typographic'],
  'color-interpolation-filters': ['background'],
  columns: ['layout-system'],
  'column-count': ['layout-system'],
  'column-fill': ['layout-system'],
  'column-gap': ['layout-system'],
  'column-rule': ['layout-system'],
  'column-rule-color': ['layout-system'],
  'column-rule-style': ['layout-system'],
  'column-rule-width': ['layout-system'],
  'column-span': ['layout-self'],
  'column-width': ['layout-system'],
  content: ['meta'],
  'counter-increment': ['typographic'],
  'counter-reset': ['typographic'],
  cue: ['aural'],
  'cue-after': ['aural'],
  'cue-before': ['aural'],
  cursor: ['meta'],
  direction: ['layout-self', 'layout-system'],
  display: ['layout-self', 'layout-system'],
  elevation: ['aural'],
  'empty-cells': ['esoteric'],
  fill: [],
  filter: ['background'],
  flex: ['layout-self'],
  'flex-basis': ['layout-self'],
  'flex-direction': ['layout-system'],
  'flex-flow': ['layout-system'],
  'flex-grow': ['layout-self'],
  'flex-shrink': ['layout-self'],
  'flex-wrap': ['layout-system'],
  float: ['layout-self'],
  'flood-color': ['background'],
  'flood-opacity': ['background'],
  font: ['typographic'],
  'font-family': ['typographic'],
  'font-feature-settings': ['typographic'],
  'font-kerning': ['typographic'],
  'font-language-override': ['typographic'],
  'font-size': ['typographic'],
  'font-size-adjust': ['typographic'],
  'font-stretch': ['typographic'],
  'font-style': ['typographic'],
  'font-synthesis': ['typographic'],
  'font-variant': ['typographic'],
  'font-variant-alternates': ['typographic'],
  'font-variant-caps': ['typographic'],
  'font-variant-east-asian': ['typographic'],
  'font-variant-ligatures': ['typographic'],
  'font-variant-numeric': ['typographic'],
  'font-variant-position': ['typographic'],
  'font-weight': ['typographic'],
  gap: ['layout-self', 'layout-system'],
  grid: ['layout-system'],
  'grid-area': ['layout-self', 'layout-system'],
  'grid-auto-columns': ['layout-self', 'layout-system'],
  'grid-auto-flow': ['layout-self', 'layout-system'],
  'grid-auto-rows': ['layout-self', 'layout-system'],
  'grid-column': ['layout-self'],
  'grid-column-gap': ['layout-system'],
  'grid-column-end': ['layout-self'],
  'grid-column-start': ['layout-self'],
  'grid-gap': ['layout-system'],
  'grid-row': ['layout-self'],
  'grid-row-gap': ['layout-system'],
  'grid-row-end': ['layout-self'],
  'grid-row-start': ['layout-self'],
  'grid-template': ['layout-self'],
  'grid-template-areas': ['layout-system'],
  'grid-template-columns': ['layout-system'],
  'grid-template-rows': ['layout-system'],
  'hanging-punctuation': ['typographic'],
  height: ['layout-self'],
  hyphens: ['typographic'],
  'image-rendering': ['meta'],
  isolation: ['container'],
  'justify-content': ['layout-system'],
  'justify-items': ['layout-system'],
  'justify-self': ['layout-self'],
  left: ['layout-self'],
  'letter-spacing': ['typographic'],
  'lighting-color': ['background'],
  'line-break': ['typographic'],
  'line-height': ['typographic'],
  'list-style': ['typographic'],
  'list-style-image': ['typographic'],
  'list-style-position': ['typographic'],
  'list-style-type': ['typographic'],
  'marker-offset': ['typographic'],
  margin: ['layout-self', 'layout-system'],
  'margin-bottom': ['layout-self', 'layout-system'],
  'margin-left': ['layout-self', 'layout-system'],
  'margin-right': ['layout-self', 'layout-system'],
  'margin-top': ['layout-self', 'layout-system'],
  marks: ['meta'],
  'max-height': ['layout-self'],
  'max-width': ['layout-self'],
  'min-height': ['layout-self'],
  'min-width': ['layout-self'],
  'mix-blend-mode': ['background'],
  'nav-up': ['esoteric'],
  'nav-down': ['esoteric'],
  'nav-left': ['esoteric'],
  'nav-right': ['esoteric'],
  'object-fit': ['layout-self'],
  'object-position': ['layout-self'],
  opacity: ['background'],
  order: ['layout-self'],
  orphans: ['esoteric'],
  outline: ['border'],
  'outline-color': ['border'],
  'outline-offset': ['border'],
  'outline-style': ['border'],
  'outline-width': ['border'],
  overflow: ['container'],
  'overflow-wrap': ['container'],
  'overflow-x': ['container'],
  'overflow-y': ['container'],
  'overscroll-behavior': [],
  'overscroll-behavior-x': [],
  'overscroll-behavior-y': [],
  padding: ['layout-self'],
  'padding-bottom': ['layout-self'],
  'padding-left': ['layout-self'],
  'padding-right': ['layout-self'],
  'padding-top': ['layout-self'],
  page: ['esoteric'],
  'page-break-after': ['esoteric'],
  'page-break-before': ['esoteric'],
  'page-break-inside': ['esoteric'],
  pause: ['aural'],
  'pause-after': ['aural'],
  'pause-before': ['aural'],
  perspective: ['transform'],
  'perspective-origin': ['transform'],
  'place-content': ['layout-system'],
  'place-items': ['layout-system'],
  'place-self': ['layout-self'],
  'play-during': ['aural'],
  pitch: ['aural'],
  'pitch-range': ['aural'],
  'pointer-events': [],
  position: ['layout-self'],
  quotes: ['typographic'],
  resize: ['meta'],
  rest: ['aural'],
  'rest-after': ['aural'],
  'rest-before': ['aural'],
  richness: ['aural'],
  right: ['layout-self'],
  'row-gap': ['layout-system'],
  size: ['esoteric'],
  speak: ['aural'],
  'speak-header': ['aural'],
  'speak-numeral': ['aural'],
  'speak-punctuation': ['aural'],
  'speech-rate': ['aural'],
  stress: ['aural'],
  stroke: [],
  'stroke-width': [],
  'tab-size': ['esoteric'],
  'table-layout': ['esoteric'],
  'text-align': ['typographic'],
  'text-align-all': ['typographic'],
  'text-align-last': ['typographic'],
  'text-combine-upright': ['typographic'],
  'text-decoration': ['typographic'],
  'text-decoration-color': ['typographic'],
  'text-decoration-line': ['typographic'],
  'text-decoration-skip': ['typographic'],
  'text-decoration-style': ['typographic'],
  'text-justify': ['typographic'],
  'text-indent': ['typographic'],
  'text-orientation': ['typographic'],
  'text-overflow': ['typographic'],
  'text-shadow': ['typographic'],
  'text-transform': ['typographic'],
  'text-underline-position': ['typographic'],
  top: ['layout-self'],
  transform: ['transform'],
  'transform-box': ['transform'],
  'transform-origin': ['transform'],
  'transform-style': ['transform'],
  transition: ['animation'],
  'transition-delay': ['animation'],
  'transition-duration': ['animation'],
  'transition-property': ['animation'],
  'transition-timing-function': ['animation'],
  'user-select': [],
  'unicode-bidi': ['typographic'],
  'vertical-align': ['layout-self'],
  visibility: ['container'],
  'voice-balance': ['aural'],
  'voice-duration': ['aural'],
  'voice-family': ['aural'],
  'voice-pitch': ['aural'],
  'voice-range': ['aural'],
  'voice-rate': ['aural'],
  'voice-stress': ['aural'],
  'voice-volume': ['aural'],
  volume: ['aural'],
  'white-space': ['typographic'],
  widows: ['typographic'],
  width: ['layout-self'],
  'will-change': ['meta'],
  'word-break': ['typographic'],
  'word-spacing': ['typographic'],
  'word-wrap': ['typographic'],
  'writing-mode': ['typographic'],
  'z-index': ['container'],
}
