import {
  NodeModules,
  isEsCodeFile,
  ESCodeFile,
  isEsRemoteDependencyPlaceholder,
} from '../../shared/project-file-types'
import { RequireFn, TypeDefinitions } from '../../shared/npm-dependency-types'
import { resolveModule } from './module-resolution'
import { evaluator } from '../evaluator/evaluator'
import { fetchMissingFileDependency } from './fetch-packages'
import { EditorDispatch } from '../../../components/editor/action-types'
import { memoize } from '../../shared/memoize'
import { mapArrayToDictionary } from '../../shared/array-utils'
import { updateNodeModulesContents } from '../../../components/editor/actions/actions'
import { utopiaApiTypings } from './utopia-api-typings'
import { resolveBuiltInDependency } from './built-in-dependencies'

export const DependencyNotFoundErrorName = 'DependencyNotFoundError'

export function createDependencyNotFoundError(importOrigin: string, toImport: string) {
  let error = new Error(`Could not find dependency: '${toImport}' relative to '${importOrigin}'`)
  error.name = DependencyNotFoundErrorName
  return error
}

export const getMemoizedRequireFn = memoize(
  (nodeModules: NodeModules, dispatch: EditorDispatch) => {
    return getRequireFn(
      (modulesToAdd) => dispatch([updateNodeModulesContents(modulesToAdd, 'incremental')]),
      nodeModules,
    )
  },
  {
    maxSize: 1,
  },
)

export function getRequireFn(
  updateNodeModules: (modulesToAdd: NodeModules) => void,
  nodeModules: NodeModules,
  injectedEvaluator = evaluator,
): RequireFn {
  return function require(importOrigin, toImport): unknown {
    const builtInDependency = resolveBuiltInDependency(toImport)
    if (builtInDependency != null) {
      return builtInDependency
    }

    const resolvedPath = resolveModule(nodeModules, importOrigin, toImport)
    if (resolvedPath != null) {
      const notNullResolvedPath: string = resolvedPath
      const resolvedFile = nodeModules[resolvedPath]

      /**
       * we create a result cache with an empty exports object here.
       * the `injectedEvaluator` function is going to mutate this exports object.
       * the reason is that if we have cyclic dependencies, we want to be able to
       * return a partial exports object for a module which is under evaluation,
       * to avoid infinite loops
       *
       * https://nodejs.org/api/modules.html#modules_cycles
       *
       */
      let partialModule = {
        exports: {},
      }
      function partialRequire(name: string): unknown {
        return require(notNullResolvedPath, name)
      }
      if (resolvedFile != null && isEsCodeFile(resolvedFile)) {
        if (resolvedFile.evalResultCache == null) {
          try {
            // TODO this is the node.js `module` object we pass in to the evaluation scope.
            // we should extend the module objects so it not only contains the exports,
            // to have feature parity with the popular bundlers (Parcel / webpack)
            // MUTATION
            resolvedFile.evalResultCache = { module: partialModule }
            injectedEvaluator(
              resolvedPath,
              resolvedFile.fileContents,
              resolvedFile.evalResultCache.module,
              partialRequire,
            )
          } catch (e) {
            /**
             * The module evaluation threw an error. We want to surface this error,
             * but before we do that, we want to clear out the evalResultCache
             * so the next time someone tries to run the same require,
             * we give another change to the evaluator.
             *
             * This is inline with the real Node behavior
             */
            // MUTATION
            resolvedFile.evalResultCache = null
            throw e
          }
        }
        return resolvedFile.evalResultCache.module.exports
      } else if (isEsRemoteDependencyPlaceholder(resolvedFile)) {
        if (!resolvedFile.downloadStarted) {
          // return empty exports object, fire off an async job to fetch the dependency from jsdelivr
          // MUTATION
          resolvedFile.downloadStarted = true
          fetchMissingFileDependency(updateNodeModules, resolvedFile, resolvedPath).then(
            (response) => {
              injectedEvaluator(resolvedPath, response, partialModule, partialRequire)
              partialRequire(resolvedPath)
            },
          )
        }

        return {}
      }
    }
    throw createDependencyNotFoundError(importOrigin, toImport)
  }
}

// These are used for code completion
const UtopiaProvidedTypings = {
  '/node_modules/utopia-api/index.d.ts': utopiaApiTypings,
}

export const getDependencyTypeDefinitions = memoize(
  (nodeModules: NodeModules): TypeDefinitions => {
    const dtsFilepaths = Object.keys(nodeModules).filter(
      (path) => path.endsWith('.d.ts') && isEsCodeFile(nodeModules[path]),
    )
    const ret = mapArrayToDictionary(
      dtsFilepaths,
      (filepath) => filepath,
      (filepath) => (nodeModules[filepath] as ESCodeFile).fileContents,
    )

    return {
      ...UtopiaProvidedTypings,
      ...ret,
    }
  },
  {
    maxSize: 1,
    equals: Object.is, // for an object with thousands of entries, where the values are _large_ strings, even a shallow equals is expensive
  },
)
