import React, { useEffect, useState } from 'react'
import uniq from 'lodash/uniq'
import { RadioButtonGroup, RadioGroup, Radio, Select } from '@chakra-ui/core'

import { useDevSpec } from './const'
import { CustomRadio } from './ui/CustomRadio'
import { getSpecs, Spec } from './spec'
import { devServer } from './server'
import { getConfig } from '../../config'

type Mode = 'api' | 'mirage'

const getMode = (): Mode => {
  return (window.localStorage.getItem('dev-mirage') as Mode) || 'api'
}
const setMode = (mode: Mode) => {
  return window.localStorage.setItem('dev-mirage', mode)
}

const defaultMode = typeof window === 'undefined' ? 'api' : getMode()

if (defaultMode === 'mirage') {
  devServer()
}

type MirageDevTools = {
  spec?: Spec
  specs: Spec[]
  setSpecId: (id: string) => void
  groups: string[]
}
export const useMirageDevTools = (): MirageDevTools => {
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
        const { onUrlChange } = getConfig()
        if (onUrlChange) {
          onUrlChange(spec.url)
        }
      }
    },
    specs,
    groups,
  }
}

export const MirageToogle = (props: MirageDevTools) => {
  const { groups, spec, specs, setSpecId } = props
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
        w={['100%', '300px']}
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
