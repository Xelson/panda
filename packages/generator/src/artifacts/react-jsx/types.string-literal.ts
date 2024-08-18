import { ArtifactFile } from '../artifact-map'

export const reactJsxFactoryStringLiteralTypesArtifact = new ArtifactFile({
  id: 'jsx/factory.d.ts',
  fileName: 'factory',
  type: 'dts',
  dir: (ctx) => ctx.paths.jsx,
  dependencies: ['jsxFactory'],
  importsType: (ctx) => {
    return {
      'types/jsx.d.ts': [ctx.jsx.upperName],
    }
  },
  computed(ctx) {
    return { jsx: ctx.jsx }
  },
  code(params) {
    const { factoryName, upperName } = params.computed.jsx
    return `export declare const ${factoryName}: ${upperName}`
  },
})

export const reactJsxTypesStringLiteralArtifact = new ArtifactFile({
  id: 'types/jsx.d.ts',
  fileName: 'jsx',
  type: 'dts',
  dir: (ctx) => ctx.paths.types,
  dependencies: ['jsxFactory'],
  importsType: {
    'types/system-types.d.ts': ['DistributiveOmit'],
  },
  computed(ctx) {
    return { jsx: ctx.jsx }
  },
  code(params) {
    const { componentName, upperName, typeName } = params.computed.jsx
    return `
import type { ComponentPropsWithoutRef, ElementType, ElementRef, JSX, Ref } from 'react'

interface Dict {
  [k: string]: unknown
}

export type ComponentProps<T extends ElementType> = DistributiveOmit<ComponentPropsWithoutRef<T>, 'ref'> & {
  ref?: Ref<ElementRef<T>>
}

export type ${componentName}<T extends ElementType> = {
  (args: { raw: readonly string[] | ArrayLike<string> }): (props: ComponentProps<T>) => JSX.Element
  displayName?: string
}

export interface JsxFactory {
  <T extends ElementType>(component: T): ${componentName}<T>
}

export type JsxElements = {
  [K in keyof JSX.IntrinsicElements]: ${componentName}<K>
}

export type ${upperName} = JsxFactory & JsxElements

export type ${typeName}<T extends ElementType> = ComponentProps<T>
  `
  },
})
