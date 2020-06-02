import React from 'react'
import { ButtonProps, Button } from '@chakra-ui/core'

export const CustomRadio = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    isChecked?: boolean
    value: string
  }
>((props, ref) => {
  const { isChecked, isDisabled, value, ...rest } = props
  return (
    <Button
      ref={ref}
      variantColor={isChecked ? 'blue' : 'gray'}
      aria-checked={isChecked}
      role="radio"
      isDisabled={isDisabled}
      {...rest}
    />
  )
})
