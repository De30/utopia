import {
  isParseSuccess,
  RevisionsState,
  TextFile,
  textFile,
  textFileContents,
} from '../shared/project-file-types'
import { emptySet } from '../shared/set-utils'
import { lintAndParse } from '../workers/parser-printer/parser-printer'
import { appJSFile, getDefaultUIJsFile } from './new-project-files'

export function appJSFilePreParsed(): TextFile {
  const appFile = appJSFile()
  const result = lintAndParse('/src/app.js', appFile.fileContents.code, null, emptySet())
  return textFile(
    textFileContents(appFile.fileContents.code, result, RevisionsState.BothMatch),
    null,
    isParseSuccess(result) ? result : null,
    Date.now(),
  )
}

export function getDefaultUIJsFilePreParsed(): TextFile {
  const uijsFile = getDefaultUIJsFile()
  const result = lintAndParse('code.tsx', uijsFile.fileContents.code, null, emptySet())
  return textFile(
    textFileContents(uijsFile.fileContents.code, result, RevisionsState.BothMatch),
    null,
    isParseSuccess(result) ? result : null,
    Date.now(),
  )
}
