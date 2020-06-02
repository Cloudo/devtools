import React, { useEffect, useState } from 'react'
import uniq from 'lodash/uniq'
import { RadioButtonGroup, RadioGroup, Radio, Select } from '@chakra-ui/core'

import { useDevSpec } from './const'
import { CustomRadio } from './ui/CustomRadio'
import { getSpecs, Spec } from './spec'
import { devServer } from './server'
import { Server, Response } from 'miragejs'
import { Config } from './types'

type Mode = 'api' | 'mirage'

const getMode = (): Mode => {
  return (window.localStorage.getItem('dev-mirage') as Mode) || 'api'
}
const setMode = (mode: Mode) => {
  return window.localStorage.setItem('dev-mirage', mode)
}

const defaultMode = typeof window === 'undefined' ? 'api' : getMode()

if (defaultMode === 'mirage') {
  // @ts-ignore
  if (window.Cypress) {
    let cyServer = new Server({
      routes() {
        const methods = ['get', 'put', 'patch', 'post', 'delete'] as const
        methods.forEach((method) => {
          // @ts-ignore
          this[method]('/*', async (schema, request) => {
            // @ts-ignore
            let [status, headers, body] = await window.handleFromCypress(
              request
            )
            return new Response(status, headers, body)
          })
        })
      },
    })
    cyServer.logging = false
  } else {
    devServer()
  }
}

type MirageDevTools = {
  spec?: Spec
  specs: Spec[]
  setSpecId: (id: string) => void
  groups: string[]
}
export const useMirageDevTools = (config: Config): MirageDevTools => {
  const specs = getSpecs()
  const [specId, setSpecId] = useDevSpec()

  const getSpec = (specId: string) => specs.find((s) => s.id === specId)

  let spec: Spec | undefined
  if (specId) {
    spec = getSpec(specId)
  }
  const groups = uniq(specs.map((s) => s.group))

  useEffect(() => {
    if (defaultMode === 'mirage') {
      if (spec && spec.callback) {
        spec.callback(devServer())
      }
    }
  }, [specId])

  return {
    spec,
    setSpecId: (id) => {
      setSpecId(id)
      const spec = getSpec(id)
      if (spec && spec.url) {
        if (config.onUrlChange) {
          config.onUrlChange(spec.url)
        }
      }
    },
    specs,
    groups,
  }
}

export const MirageDevtools = (props: Config) => {
  const { groups, spec, specs, setSpecId } = useMirageDevTools(props)
  const [group, setGroup] = useState<string>(spec?.group!)

  const groupSpecs = specs.filter((s) => s.group === group)
  return (
    <>
      <RadioButtonGroup
        defaultValue={defaultMode}
        onChange={(val) => {
          setMode(val as Mode)
          window.location.reload()
        }}
        isInline
        mb={3}
      >
        <CustomRadio value="api">API</CustomRadio>
        <CustomRadio value="mirage">MIRAGE</CustomRadio>
      </RadioButtonGroup>

      <Select
        value={group}
        placeholder="Select group..."
        onChange={(e) => setGroup(e.target.value)}
        size="sm"
        w="100%"
        maxWidth="350px"
      >
        {groups.map((group, index) => (
          <option value={group} key={index}>
            {group}
          </option>
        ))}
      </Select>

      {group ? (
        <RadioGroup
          onChange={(e) => setSpecId(e.target.value)}
          value={spec?.id}
          mt={2}
        >
          {groupSpecs.map((spec) => (
            <Radio variantColor="blue" value={spec.id} key={spec.id}>
              {spec.name}
            </Radio>
          ))}
        </RadioGroup>
      ) : null}
    </>
  )
}
