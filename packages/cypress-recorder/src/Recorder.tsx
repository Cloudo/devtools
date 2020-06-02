import React, { useState, useEffect } from 'react'
import { Flex, Text } from '@chakra-ui/core'

import { subscribe } from './core'

export const Recorder = () => {
  const [blocks, setBlocks] = useState<string[]>([])

  useEffect(() => {
    const unsubscribe = subscribe((nextBlocks) => setBlocks(nextBlocks))
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <Flex flexDirection="column" overflow="scroll" flexGrow={1}>
      <Text as="pre">{blocks.join('\n')}</Text>
    </Flex>
  )
}
